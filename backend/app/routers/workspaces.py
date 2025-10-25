from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from ..database import get_db
from ..models.workspace import Workspace, WorkspaceTemplate
from ..services.workspace_installer import WorkspaceInstaller

router = APIRouter()

# Pydantic models for request/response
class WorkspaceInstallRequest(BaseModel):
    template_id: str
    custom_name: Optional[str] = None
    custom_settings: Optional[dict] = {}

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    workspace_type: str
    status: str
    installation_progress: int
    created_at: datetime
    template_name: Optional[str] = None

    class Config:
        from_attributes = True

class InstallationStatusResponse(BaseModel):
    workspace_id: str
    status: str
    progress: int
    current_step: str
    logs: List[dict]

@router.get("/", response_model=List[WorkspaceResponse])
async def get_user_workspaces(
    user_id: str,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all workspaces for a user"""
    query = db.query(Workspace).filter(Workspace.user_id == user_id)
    
    if status:
        query = query.filter(Workspace.status == status)
    
    workspaces = query.order_by(Workspace.created_at.desc()).all()
    
    # Add template names
    result = []
    for workspace in workspaces:
        workspace_dict = {
            "id": str(workspace.id),
            "name": workspace.name,
            "workspace_type": workspace.workspace_type,
            "status": workspace.status,
            "installation_progress": workspace.installation_progress,
            "created_at": workspace.created_at,
            "template_name": workspace.template.name if workspace.template else None
        }
        result.append(workspace_dict)
    
    return result

@router.post("/install")
async def install_workspace(
    request: WorkspaceInstallRequest,
    background_tasks: BackgroundTasks,
    user_id: str = "default_user",  # In production, get from auth
    db: Session = Depends(get_db)
):
    """Install a new workspace from template"""
    
    # Get template
    template = db.query(WorkspaceTemplate).filter(
        WorkspaceTemplate.id == request.template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Create workspace record
    workspace = Workspace(
        user_id=user_id,
        template_id=request.template_id,
        name=request.custom_name or template.name,
        workspace_type=template.category,
        status="installing",
        installation_progress=0,
        custom_settings=request.custom_settings or {}
    )
    
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    # Start installation in background
    background_tasks.add_task(
        install_workspace_background,
        str(workspace.id),
        template.id,
        user_id,
        db
    )
    
    return {
        "workspace_id": str(workspace.id),
        "status": "installing",
        "message": "Installation started"
    }

@router.get("/{workspace_id}/status", response_model=InstallationStatusResponse)
async def get_installation_status(
    workspace_id: str,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Get real-time installation status"""
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Get recent logs
    from ..models.installation import InstallationLog
    logs = db.query(InstallationLog).filter(
        InstallationLog.workspace_id == workspace_id
    ).order_by(InstallationLog.started_at.desc()).limit(10).all()
    
    log_data = [
        {
            "id": str(log.id),
            "tool_id": log.tool_id,
            "status": log.status,
            "message": log.logs,
            "timestamp": log.started_at.isoformat()
        }
        for log in logs
    ]
    
    return {
        "workspace_id": workspace_id,
        "status": workspace.status,
        "progress": workspace.installation_progress,
        "current_step": "Installing tools...",  # This would come from installation service
        "logs": log_data
    }

@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Delete a workspace"""
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    db.delete(workspace)
    db.commit()
    
    return {"message": "Workspace deleted successfully"}

async def install_workspace_background(
    workspace_id: str,
    template_id: str,
    user_id: str,
    db: Session
):
    """Background task for workspace installation"""
    
    installer = WorkspaceInstaller(workspace_id, template_id, user_id, db)
    await installer.install()

@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: str,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Get workspace details"""
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    return {
        "id": str(workspace.id),
        "name": workspace.name,
        "description": workspace.description,
        "workspace_type": workspace.workspace_type,
        "status": workspace.status,
        "installation_progress": workspace.installation_progress,
        "installed_tools": workspace.installed_tools,
        "installed_packages": workspace.installed_packages,
        "custom_settings": workspace.custom_settings,
        "created_at": workspace.created_at,
        "updated_at": workspace.updated_at,
        "template": {
            "id": str(workspace.template.id),
            "name": workspace.template.name,
            "category": workspace.template.category
        } if workspace.template else None
    }