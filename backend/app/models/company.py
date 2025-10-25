from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    domain = Column(String)
    logo_url = Column(String)
    
    # SSO Configuration
    sso_enabled = Column(Boolean, default=False)
    sso_provider = Column(String)  # google, microsoft, okta
    sso_config = Column(JSON)
    
    # Subscription
    plan = Column(String, default="team")  # team, enterprise
    seats_total = Column(Integer)
    seats_used = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class TeamWorkspaceTemplate(Base):
    __tablename__ = "team_workspace_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Company & Template
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workspace_templates.id"), nullable=False)
    
    # Role Configuration
    role = Column(String, nullable=False)
    
    # Company-Specific Additions (JSON)
    custom_tools = Column(JSON, default=list)
    custom_dotfiles = Column(JSON, default=list)
    custom_packages = Column(JSON, default=dict)
    custom_settings = Column(JSON, default=dict)
    
    # Access Configuration
    github_org = Column(String)
    slack_workspace = Column(String)
    vpn_config = Column(String)
    
    # Documentation
    onboarding_guide = Column(String)
    internal_wiki = Column(String)
    
    # Flags
    required_for_role = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", backref="team_templates")
    template = relationship("WorkspaceTemplate", backref="team_templates")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True)
    full_name = Column(String)
    avatar_url = Column(String)
    bio = Column(Text)
    
    # Company Association
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    role = Column(String)
    
    # Subscription
    subscription_tier = Column(String, default="free")  # free, pro, enterprise
    subscription_status = Column(String, default="active")
    subscription_expires_at = Column(DateTime(timezone=True))
    
    # Gamification
    xp_points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    
    # Preferences
    theme = Column(String, default="dark")
    language = Column(String, default="en")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", backref="members")