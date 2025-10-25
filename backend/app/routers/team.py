from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets
import uuid

from ..database import get_db
from ..models.company import Company, TeamWorkspaceTemplate, Profile
from ..models.workspace import WorkspaceTemplate
from ..services.team_onboarding import TeamOnboardingService

router = APIRouter()

class TeamWorkspaceRequest(BaseModel):
    base_template_id: str
    role: str
    custom_tools: List[str] = []
    custom_dotfiles: dict = {}
    custom_packages: dict = {}
    custom_settings: dict = {}
    github_org: Optional[str] = None
    slack_workspace: Optional[str] = None
    vpn_config: Optional[str] = None
    onboarding_guide: Optional[str] = None
    internal_wiki: Optional[str] = None

class OnboardInviteRequest(BaseModel):
    employee_email: EmailStr
    employee_name: Optional[str] = None
    role: str

class TeamTemplateResponse(BaseModel):
    id: str
    role: str
    base_template_name: str
    custom_tools: List[str]
    members_count: int
    created_at: datetime

class CompanyStatsResponse(BaseModel):
    total_members: int
    active_workspaces: int
    pending_invites: int
    role_templates: int

@router.get("/company/{company_id}/stats", response_model=CompanyStatsResponse)
async def get_company_stats(
    company_id: str,
    db: Session = Depends(get_db)
):
    """Get company statistics for dashboard"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Count members
    total_members = db.query(Profile).filter(Profile.company_id == company_id).count()
    
    # Count role templates
    role_templates = db.query(TeamWorkspaceTemplate).filter(
        TeamWorkspaceTemplate.company_id == company_id
    ).count()
    
    # For now, mock active workspaces and pending invites
    # In production, these would come from actual workspace and invitation tables
    active_workspaces = total_members - 2  # Mock data
    pending_invites = 2  # Mock data
    
    return {
        "total_members": total_members,
        "active_workspaces": max(0, active_workspaces),
        "pending_invites": pending_invites,
        "role_templates": role_templates
    }

@router.get("/company/{company_id}/templates", response_model=List[TeamTemplateResponse])
async def get_company_templates(
    company_id: str,
    db: Session = Depends(get_db)
):
    """Get all team workspace templates for a company"""
    
    templates = db.query(TeamWorkspaceTemplate).filter(
        TeamWorkspaceTemplate.company_id == company_id
    ).join(WorkspaceTemplate).all()
    
    result = []
    for template in templates:
        # Count members using this template (mock for now)
        members_count = len(template.custom_tools) + 5  # Mock calculation
        
        result.append({
            "id": str(template.id),
            "role": template.role,
            "base_template_name": template.template.name,
            "custom_tools": template.custom_tools or [],
            "members_count": members_count,
            "created_at": template.created_at
        })
    
    return result

@router.post("/company/{company_id}/templates")
async def create_team_template(
    company_id: str,
    request: TeamWorkspaceRequest,
    current_user_role: str = "admin",  # In production, get from auth
    db: Session = Depends(get_db)
):
    """Create company-specific workspace template for a role"""
    
    # Verify user is company admin
    if current_user_role != "admin":
        raise HTTPException(status_code=403, detail="Only company admins can create team workspaces")
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Verify base template exists
    base_template = db.query(WorkspaceTemplate).filter(
        WorkspaceTemplate.id == request.base_template_id
    ).first()
    if not base_template:
        raise HTTPException(status_code=404, detail="Base template not found")
    
    # Check if role template already exists
    existing = db.query(TeamWorkspaceTemplate).filter(
        TeamWorkspaceTemplate.company_id == company_id,
        TeamWorkspaceTemplate.role == request.role
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Template for this role already exists")
    
    # Create team workspace template
    team_template = TeamWorkspaceTemplate(
        company_id=company_id,
        template_id=request.base_template_id,
        role=request.role,
        custom_tools=request.custom_tools,
        custom_dotfiles=request.custom_dotfiles,
        custom_packages=request.custom_packages,
        custom_settings=request.custom_settings,
        github_org=request.github_org,
        slack_workspace=request.slack_workspace,
        vpn_config=request.vpn_config,
        onboarding_guide=request.onboarding_guide,
        internal_wiki=request.internal_wiki,
        required_for_role=True
    )
    
    db.add(team_template)
    db.commit()
    db.refresh(team_template)
    
    return {
        "success": True,
        "team_template_id": str(team_template.id),
        "message": f"Team template for {request.role} created successfully"
    }

@router.post("/company/{company_id}/invite")
async def send_onboarding_invite(
    company_id: str,
    request: OnboardInviteRequest,
    current_user_role: str = "admin",
    db: Session = Depends(get_db)
):
    """Send onboarding invitation to new employee"""
    
    # Verify company admin
    if current_user_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can send invites")
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get team workspace template for role
    team_template = db.query(TeamWorkspaceTemplate).filter(
        TeamWorkspaceTemplate.company_id == company_id,
        TeamWorkspaceTemplate.role == request.role
    ).first()
    
    if not team_template:
        raise HTTPException(
            status_code=404, 
            detail=f"No template found for role: {request.role}"
        )
    
    # Create onboarding token
    token = secrets.token_urlsafe(32)
    
    # In production, you'd store this in an onboarding_invitations table
    # For now, we'll return the invitation details
    
    invite_url = f"https://nuffi.app/onboard/{token}"
    
    # Here you would send the actual email
    # await send_onboarding_email(...)
    
    return {
        "success": True,
        "invite_url": invite_url,
        "expires_in_days": 7,
        "message": f"Invitation sent to {request.employee_email}"
    }

@router.get("/onboard/{token}")
async def get_onboarding_info(token: str, db: Session = Depends(get_db)):
    """Get onboarding information from invitation token"""
    
    # In production, you'd look up the token in onboarding_invitations table
    # For now, we'll return mock data
    
    if not token or len(token) < 10:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation")
    
    # Mock onboarding data
    return {
        "company_name": "Acme Corp",
        "role": "Frontend Developer",
        "employee_name": "New Employee",
        "workspace_info": {
            "name": "Frontend Development",
            "description": "Complete frontend development environment",
            "tools": ["VS Code", "Node.js", "React", "Chrome DevTools"],
            "setup_time": "12-15 min"
        }
    }

@router.post("/onboard/{token}/accept")
async def accept_onboarding(
    token: str,
    employee_data: dict = {},
    db: Session = Depends(get_db)
):
    """Accept invitation and start workspace installation"""
    
    # Verify invitation token
    if not token or len(token) < 10:
        raise HTTPException(status_code=404, detail="Invalid invitation")
    
    # In production, you'd:
    # 1. Verify invitation exists and not expired
    # 2. Create user account
    # 3. Get team template
    # 4. Merge base template with company customizations
    # 5. Start workspace installation
    
    # Mock response for now
    mock_user_id = str(uuid.uuid4())
    mock_workspace_id = str(uuid.uuid4())
    
    return {
        "success": True,
        "workspace_id": mock_workspace_id,
        "user_id": mock_user_id,
        "message": "Onboarding accepted, workspace installation started"
    }

@router.get("/company/{company_id}/members")
async def get_team_members(
    company_id: str,
    db: Session = Depends(get_db)
):
    """Get all team members for a company"""
    
    members = db.query(Profile).filter(Profile.company_id == company_id).all()
    
    result = []
    for member in members:
        result.append({
            "id": str(member.id),
            "name": member.full_name,
            "email": member.email,
            "role": member.role,
            "status": "active",  # Mock status
            "workspace": "Frontend Complete",  # Mock workspace
            "invited_at": member.created_at,
            "avatar_url": member.avatar_url
        })
    
    return {"members": result}

@router.put("/templates/{template_id}")
async def update_team_template(
    template_id: str,
    request: TeamWorkspaceRequest,
    current_user_role: str = "admin",
    db: Session = Depends(get_db)
):
    """Update an existing team workspace template"""
    
    if current_user_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update templates")
    
    template = db.query(TeamWorkspaceTemplate).filter(
        TeamWorkspaceTemplate.id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Update template fields
    template.custom_tools = request.custom_tools
    template.custom_dotfiles = request.custom_dotfiles
    template.custom_packages = request.custom_packages
    template.custom_settings = request.custom_settings
    template.github_org = request.github_org
    template.slack_workspace = request.slack_workspace
    template.vpn_config = request.vpn_config
    template.onboarding_guide = request.onboarding_guide
    template.internal_wiki = request.internal_wiki
    
    db.commit()
    
    return {
        "success": True,
        "message": "Template updated successfully"
    }