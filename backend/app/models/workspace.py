from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base

class WorkspaceTemplate(Base):
    __tablename__ = "workspace_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text)
    long_description = Column(Text)
    thumbnail_url = Column(String)
    
    # Author
    author_id = Column(UUID(as_uuid=True))
    author_type = Column(String, default="official")  # user, company, official
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    
    # Tools Configuration (JSON)
    gui_tools = Column(JSON, default=list)
    cli_tools = Column(JSON, default=list)
    packages = Column(JSON, default=dict)
    dotfiles = Column(JSON, default=list)
    settings = Column(JSON, default=dict)
    extensions = Column(JSON, default=list)
    starter_projects = Column(JSON, default=list)
    
    # Documentation
    readme = Column(Text)
    tutorials = Column(JSON, default=list)
    
    # Requirements
    requirements = Column(JSON, nullable=False)
    
    # Metadata
    downloads = Column(Integer, default=0)
    stars = Column(Integer, default=0)
    rating_average = Column(Integer, default=0)
    rating_count = Column(Integer, default=0)
    tags = Column(JSON, default=list)
    
    # Flags
    is_official = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    is_team_template = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Owner
    user_id = Column(UUID(as_uuid=True), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workspace_templates.id"))
    
    # Basic Info
    name = Column(String, nullable=False)
    description = Column(Text)
    workspace_type = Column(String, nullable=False)
    
    # Installation Status
    status = Column(String, default="installing")  # installing, active, inactive, error, archived
    installation_progress = Column(Integer, default=0)
    
    # Installed Components (JSON)
    installed_tools = Column(JSON, default=list)
    installed_packages = Column(JSON, default=dict)
    installed_dotfiles = Column(JSON, default=list)
    
    # Custom Configuration
    custom_settings = Column(JSON, default=dict)
    environment_variables = Column(JSON, default=dict)
    
    # Paths
    workspace_path = Column(String)
    projects_path = Column(String)
    
    # Metadata
    disk_usage = Column(Integer, default=0)
    last_used_at = Column(DateTime(timezone=True))
    total_runtime_hours = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    archived_at = Column(DateTime(timezone=True))
    
    # Relationships
    template = relationship("WorkspaceTemplate", backref="workspaces")