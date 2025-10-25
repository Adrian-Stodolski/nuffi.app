from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base

class InstallationLog(Base):
    __tablename__ = "installation_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # References
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Tool Info
    tool_id = Column(String, nullable=False)
    tool_type = Column(String, nullable=False)  # gui, cli, package, dotfile
    tool_version = Column(String)
    
    # Action
    action = Column(String, nullable=False)  # install, update, uninstall
    status = Column(String, nullable=False)  # pending, in_progress, success, failed
    
    # Progress
    progress = Column(Integer, default=0)
    
    # Logs
    logs = Column(Text)
    error_message = Column(Text)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    
    # Relationships
    workspace = relationship("Workspace", backref="installation_logs")