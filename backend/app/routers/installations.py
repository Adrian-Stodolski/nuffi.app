from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models.installation import InstallationLog
from ..models.workspace import Workspace

router = APIRouter()

class InstallationLogResponse(BaseModel):
    id: str
    workspace_id: str
    tool_id: str
    tool_type: str
    tool_version: Optional[str]
    action: str
    status: str
    progress: int
    logs: Optional[str]
    error_message: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    duration_seconds: Optional[int]

    class Config:
        from_attributes = True

class InstallationStatsResponse(BaseModel):
    total_installations: int
    successful_installations: int
    failed_installations: int
    average_duration_minutes: float
    most_installed_tools: List[dict]

@router.get("/workspace/{workspace_id}/logs", response_model=List[InstallationLogResponse])
async def get_workspace_installation_logs(
    workspace_id: str,
    limit: int = 50,
    tool_type: Optional[str] = None,
    status: Optional[str] = None,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Get installation logs for a specific workspace"""
    
    # Verify workspace belongs to user
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    query = db.query(InstallationLog).filter(
        InstallationLog.workspace_id == workspace_id
    )
    
    if tool_type:
        query = query.filter(InstallationLog.tool_type == tool_type)
    
    if status:
        query = query.filter(InstallationLog.status == status)
    
    logs = query.order_by(InstallationLog.started_at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(log.id),
            "workspace_id": str(log.workspace_id),
            "tool_id": log.tool_id,
            "tool_type": log.tool_type,
            "tool_version": log.tool_version,
            "action": log.action,
            "status": log.status,
            "progress": log.progress,
            "logs": log.logs,
            "error_message": log.error_message,
            "started_at": log.started_at,
            "completed_at": log.completed_at,
            "duration_seconds": log.duration_seconds
        }
        for log in logs
    ]

@router.get("/user/{user_id}/stats", response_model=InstallationStatsResponse)
async def get_user_installation_stats(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get installation statistics for a user"""
    
    # Get all workspaces for user
    workspace_ids = db.query(Workspace.id).filter(Workspace.user_id == user_id).all()
    workspace_ids = [str(w[0]) for w in workspace_ids]
    
    if not workspace_ids:
        return {
            "total_installations": 0,
            "successful_installations": 0,
            "failed_installations": 0,
            "average_duration_minutes": 0.0,
            "most_installed_tools": []
        }
    
    # Get all installation logs for user's workspaces
    logs = db.query(InstallationLog).filter(
        InstallationLog.workspace_id.in_(workspace_ids)
    ).all()
    
    total_installations = len(logs)
    successful_installations = len([log for log in logs if log.status == "success"])
    failed_installations = len([log for log in logs if log.status == "failed"])
    
    # Calculate average duration
    completed_logs = [log for log in logs if log.duration_seconds is not None]
    if completed_logs:
        avg_duration_seconds = sum(log.duration_seconds for log in completed_logs) / len(completed_logs)
        average_duration_minutes = avg_duration_seconds / 60
    else:
        average_duration_minutes = 0.0
    
    # Most installed tools
    tool_counts = {}
    for log in logs:
        if log.status == "success":
            tool_counts[log.tool_id] = tool_counts.get(log.tool_id, 0) + 1
    
    most_installed_tools = [
        {"tool_id": tool, "count": count}
        for tool, count in sorted(tool_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    return {
        "total_installations": total_installations,
        "successful_installations": successful_installations,
        "failed_installations": failed_installations,
        "average_duration_minutes": round(average_duration_minutes, 2),
        "most_installed_tools": most_installed_tools
    }

@router.get("/logs/recent")
async def get_recent_installation_logs(
    limit: int = 20,
    tool_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get recent installation logs across all users (for admin dashboard)"""
    
    query = db.query(InstallationLog)
    
    if tool_type:
        query = query.filter(InstallationLog.tool_type == tool_type)
    
    logs = query.order_by(InstallationLog.started_at.desc()).limit(limit).all()
    
    result = []
    for log in logs:
        # Get workspace info
        workspace = db.query(Workspace).filter(Workspace.id == log.workspace_id).first()
        
        result.append({
            "id": str(log.id),
            "tool_id": log.tool_id,
            "tool_type": log.tool_type,
            "status": log.status,
            "started_at": log.started_at,
            "duration_seconds": log.duration_seconds,
            "workspace_name": workspace.name if workspace else "Unknown",
            "workspace_type": workspace.workspace_type if workspace else "Unknown"
        })
    
    return {"logs": result}

@router.get("/stats/global")
async def get_global_installation_stats(db: Session = Depends(get_db)):
    """Get global installation statistics"""
    
    total_logs = db.query(InstallationLog).count()
    successful_logs = db.query(InstallationLog).filter(
        InstallationLog.status == "success"
    ).count()
    failed_logs = db.query(InstallationLog).filter(
        InstallationLog.status == "failed"
    ).count()
    
    # Tool type breakdown
    tool_types = db.query(
        InstallationLog.tool_type,
        db.func.count(InstallationLog.id).label('count')
    ).filter(
        InstallationLog.status == "success"
    ).group_by(InstallationLog.tool_type).all()
    
    tool_type_stats = [
        {"tool_type": tt[0], "count": tt[1]}
        for tt in tool_types
    ]
    
    # Most popular tools
    popular_tools = db.query(
        InstallationLog.tool_id,
        db.func.count(InstallationLog.id).label('count')
    ).filter(
        InstallationLog.status == "success"
    ).group_by(InstallationLog.tool_id).order_by(
        db.func.count(InstallationLog.id).desc()
    ).limit(10).all()
    
    popular_tools_list = [
        {"tool_id": tool[0], "installations": tool[1]}
        for tool in popular_tools
    ]
    
    return {
        "total_installations": total_logs,
        "successful_installations": successful_logs,
        "failed_installations": failed_logs,
        "success_rate": round((successful_logs / total_logs * 100) if total_logs > 0 else 0, 2),
        "tool_type_breakdown": tool_type_stats,
        "most_popular_tools": popular_tools_list
    }

@router.post("/workspace/{workspace_id}/retry-failed")
async def retry_failed_installations(
    workspace_id: str,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Retry all failed installations for a workspace"""
    
    # Verify workspace belongs to user
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Get failed installations
    failed_logs = db.query(InstallationLog).filter(
        InstallationLog.workspace_id == workspace_id,
        InstallationLog.status == "failed"
    ).all()
    
    if not failed_logs:
        return {
            "message": "No failed installations to retry",
            "retried_count": 0
        }
    
    # In production, you would trigger actual retry logic here
    # For now, we'll just update the status to pending
    for log in failed_logs:
        log.status = "pending"
        log.error_message = None
    
    db.commit()
    
    return {
        "message": f"Retrying {len(failed_logs)} failed installations",
        "retried_count": len(failed_logs)
    }