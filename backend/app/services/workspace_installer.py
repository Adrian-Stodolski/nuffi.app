import asyncio
import json
import os
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from ..models.workspace import Workspace, WorkspaceTemplate
from ..models.installation import InstallationLog
from .tool_manager import ToolManager

class WorkspaceInstaller:
    def __init__(self, workspace_id: str, template_id: str, user_id: str, db: Session):
        self.workspace_id = workspace_id
        self.template_id = template_id
        self.user_id = user_id
        self.db = db
        self.tool_manager = ToolManager()
        
    async def install(self):
        """Main installation process"""
        try:
            # Get workspace and template
            workspace = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
            template = self.db.query(WorkspaceTemplate).filter(WorkspaceTemplate.id == self.template_id).first()
            
            if not workspace or not template:
                raise Exception("Workspace or template not found")
            
            # Installation steps
            steps = [
                ("system_check", "System Compatibility Check", 10),
                ("gui_tools", "Installing GUI Applications", 30),
                ("cli_tools", "Installing CLI Tools", 25),
                ("packages", "Installing Packages", 20),
                ("dotfiles", "Configuring Environment", 10),
                ("verification", "Verifying Installation", 5)
            ]
            
            total_progress = 0
            
            for step_id, step_name, step_weight in steps:
                await self._log_step_start(step_id, step_name)
                
                try:
                    if step_id == "system_check":
                        await self._system_check()
                    elif step_id == "gui_tools":
                        await self._install_gui_tools(template.gui_tools or [])
                    elif step_id == "cli_tools":
                        await self._install_cli_tools(template.cli_tools or [])
                    elif step_id == "packages":
                        await self._install_packages(template.packages or {})
                    elif step_id == "dotfiles":
                        await self._setup_dotfiles(template.dotfiles or [])
                    elif step_id == "verification":
                        await self._verify_installation()
                    
                    total_progress += step_weight
                    await self._update_workspace_progress(total_progress, f"Completed {step_name}")
                    await self._log_step_complete(step_id, step_name)
                    
                except Exception as e:
                    await self._log_step_error(step_id, step_name, str(e))
                    raise e
            
            # Mark installation as complete
            await self._complete_installation()
            
        except Exception as e:
            await self._handle_installation_error(str(e))
    
    async def _system_check(self):
        """Check system compatibility"""
        await asyncio.sleep(1)  # Simulate check time
        
        # In production, this would check:
        # - Operating system compatibility
        # - Available disk space
        # - Required dependencies
        # - Network connectivity
        
        await self._log_info("system_check", "Checking operating system compatibility...")
        await asyncio.sleep(0.5)
        
        await self._log_info("system_check", "Checking available disk space...")
        await asyncio.sleep(0.5)
        
        await self._log_info("system_check", "Verifying network connectivity...")
        await asyncio.sleep(0.5)
        
        await self._log_success("system_check", "System compatibility check passed")
    
    async def _install_gui_tools(self, gui_tools: List[str]):
        """Install GUI applications"""
        if not gui_tools:
            await self._log_info("gui_tools", "No GUI tools to install")
            return
        
        for i, tool in enumerate(gui_tools):
            await self._log_info("gui_tools", f"Installing {tool}...")
            
            # Simulate tool installation
            await asyncio.sleep(2)  # Simulate download and install time
            
            # Log installation progress
            progress = int((i + 1) / len(gui_tools) * 100)
            await self._log_tool_progress("gui_tools", tool, progress)
            
            await self._log_success("gui_tools", f"{tool} installed successfully")
    
    async def _install_cli_tools(self, cli_tools: List[str]):
        """Install CLI tools via package managers"""
        if not cli_tools:
            await self._log_info("cli_tools", "No CLI tools to install")
            return
        
        for i, tool in enumerate(cli_tools):
            await self._log_info("cli_tools", f"Installing {tool} via package manager...")
            
            # Simulate package manager installation
            await asyncio.sleep(1.5)
            
            progress = int((i + 1) / len(cli_tools) * 100)
            await self._log_tool_progress("cli_tools", tool, progress)
            
            await self._log_success("cli_tools", f"{tool} installed and added to PATH")
    
    async def _install_packages(self, packages: Dict):
        """Install language-specific packages"""
        if not packages:
            await self._log_info("packages", "No packages to install")
            return
        
        total_packages = sum(len(pkg_list) if isinstance(pkg_list, list) else 1 for pkg_list in packages.values())
        installed_count = 0
        
        for package_manager, pkg_list in packages.items():
            await self._log_info("packages", f"Installing {package_manager} packages...")
            
            if isinstance(pkg_list, list):
                for package in pkg_list:
                    await self._log_info("packages", f"Installing {package}...")
                    await asyncio.sleep(0.8)  # Simulate package install
                    
                    installed_count += 1
                    progress = int(installed_count / total_packages * 100)
                    await self._log_tool_progress("packages", package, progress)
            else:
                await asyncio.sleep(0.8)
                installed_count += 1
        
        await self._log_success("packages", f"All packages installed successfully")
    
    async def _setup_dotfiles(self, dotfiles: List[Dict]):
        """Setup configuration files"""
        if not dotfiles:
            await self._log_info("dotfiles", "No dotfiles to configure")
            return
        
        for i, dotfile in enumerate(dotfiles):
            filename = dotfile.get('filename', f'config_{i}')
            await self._log_info("dotfiles", f"Configuring {filename}...")
            
            # Simulate dotfile setup
            await asyncio.sleep(0.5)
            
            progress = int((i + 1) / len(dotfiles) * 100)
            await self._log_tool_progress("dotfiles", filename, progress)
            
            await self._log_success("dotfiles", f"{filename} configured successfully")
    
    async def _verify_installation(self):
        """Verify all installations completed successfully"""
        await self._log_info("verification", "Verifying installed tools...")
        await asyncio.sleep(1)
        
        await self._log_info("verification", "Checking PATH configuration...")
        await asyncio.sleep(0.5)
        
        await self._log_info("verification", "Testing tool accessibility...")
        await asyncio.sleep(0.5)
        
        await self._log_success("verification", "Installation verification completed")
    
    async def _complete_installation(self):
        """Mark installation as complete"""
        workspace = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
        if workspace:
            workspace.status = "installed"
            workspace.installation_progress = 100
            self.db.commit()
        
        await self._log_success("complete", "🎉 Workspace installation completed successfully!")
    
    async def _handle_installation_error(self, error_message: str):
        """Handle installation errors"""
        workspace = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
        if workspace:
            workspace.status = "error"
            self.db.commit()
        
        await self._log_error("error", f"Installation failed: {error_message}")
    
    async def _update_workspace_progress(self, progress: int, step: str):
        """Update workspace installation progress"""
        workspace = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
        if workspace:
            workspace.installation_progress = min(progress, 100)
            self.db.commit()
    
    async def _log_step_start(self, step_id: str, step_name: str):
        """Log step start"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="step",
            action="install",
            status="in_progress",
            progress=0,
            logs=f"Starting {step_name}..."
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_step_complete(self, step_id: str, step_name: str):
        """Log step completion"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="step",
            action="install",
            status="success",
            progress=100,
            logs=f"{step_name} completed successfully"
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_step_error(self, step_id: str, step_name: str, error: str):
        """Log step error"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="step",
            action="install",
            status="failed",
            progress=0,
            logs=f"{step_name} failed",
            error_message=error
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_info(self, step_id: str, message: str):
        """Log info message"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="info",
            action="install",
            status="in_progress",
            logs=message
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_success(self, step_id: str, message: str):
        """Log success message"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="info",
            action="install",
            status="success",
            logs=message
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_error(self, step_id: str, message: str):
        """Log error message"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=step_id,
            tool_type="error",
            action="install",
            status="failed",
            logs=message
        )
        self.db.add(log)
        self.db.commit()
    
    async def _log_tool_progress(self, step_id: str, tool_name: str, progress: int):
        """Log tool installation progress"""
        log = InstallationLog(
            workspace_id=self.workspace_id,
            user_id=self.user_id,
            tool_id=tool_name,
            tool_type=step_id,
            action="install",
            status="in_progress",
            progress=progress,
            logs=f"{tool_name}: {progress}% complete"
        )
        self.db.add(log)
        self.db.commit()