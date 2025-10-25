import json
import os
from typing import Dict, List, Optional
from pathlib import Path

class ToolManager:
    def __init__(self):
        self.manifests_dir = Path(__file__).parent.parent / "tools" / "manifests"
        self.gui_manifests_dir = self.manifests_dir / "gui"
        self.cli_manifests_dir = self.manifests_dir / "cli"
        
    def get_tool_manifest(self, tool_id: str, tool_type: str) -> Optional[Dict]:
        """Get tool manifest by ID and type"""
        
        if tool_type == "gui":
            manifest_path = self.gui_manifests_dir / f"{tool_id}.json"
        elif tool_type == "cli":
            manifest_path = self.cli_manifests_dir / f"{tool_id}.json"
        else:
            return None
        
        if manifest_path.exists():
            with open(manifest_path, 'r') as f:
                return json.load(f)
        
        return None
    
    def get_all_gui_tools(self) -> List[Dict]:
        """Get all available GUI tool manifests"""
        tools = []
        
        if self.gui_manifests_dir.exists():
            for manifest_file in self.gui_manifests_dir.glob("*.json"):
                try:
                    with open(manifest_file, 'r') as f:
                        manifest = json.load(f)
                        tools.append(manifest)
                except Exception as e:
                    print(f"Error loading manifest {manifest_file}: {e}")
        
        return tools
    
    def get_all_cli_tools(self) -> List[Dict]:
        """Get all available CLI tool manifests"""
        tools = []
        
        if self.cli_manifests_dir.exists():
            for manifest_file in self.cli_manifests_dir.glob("*.json"):
                try:
                    with open(manifest_file, 'r') as f:
                        manifest = json.load(f)
                        tools.append(manifest)
                except Exception as e:
                    print(f"Error loading manifest {manifest_file}: {e}")
        
        return tools
    
    def validate_tool_manifest(self, manifest: Dict) -> bool:
        """Validate tool manifest structure"""
        required_fields = ["id", "name", "type", "platforms"]
        
        for field in required_fields:
            if field not in manifest:
                return False
        
        # Validate platforms
        if not isinstance(manifest["platforms"], dict):
            return False
        
        for platform, config in manifest["platforms"].items():
            if platform not in ["windows", "macos", "linux"]:
                continue
                
            if "installer" not in config:
                return False
        
        return True
    
    def get_tools_by_category(self, category: str) -> List[Dict]:
        """Get tools filtered by category"""
        all_tools = self.get_all_gui_tools() + self.get_all_cli_tools()
        
        return [
            tool for tool in all_tools 
            if tool.get("category", "").lower() == category.lower()
        ]
    
    def search_tools(self, query: str) -> List[Dict]:
        """Search tools by name or description"""
        all_tools = self.get_all_gui_tools() + self.get_all_cli_tools()
        query_lower = query.lower()
        
        matching_tools = []
        for tool in all_tools:
            if (query_lower in tool.get("name", "").lower() or 
                query_lower in tool.get("description", "").lower() or
                query_lower in tool.get("id", "").lower()):
                matching_tools.append(tool)
        
        return matching_tools
    
    def get_tool_dependencies(self, tool_id: str, tool_type: str) -> List[str]:
        """Get tool dependencies"""
        manifest = self.get_tool_manifest(tool_id, tool_type)
        
        if not manifest:
            return []
        
        return manifest.get("dependencies", [])
    
    def get_platform_specific_config(self, tool_id: str, tool_type: str, platform: str) -> Optional[Dict]:
        """Get platform-specific configuration for a tool"""
        manifest = self.get_tool_manifest(tool_id, tool_type)
        
        if not manifest:
            return None
        
        platforms = manifest.get("platforms", {})
        return platforms.get(platform)
    
    def is_tool_available_for_platform(self, tool_id: str, tool_type: str, platform: str) -> bool:
        """Check if tool is available for specific platform"""
        config = self.get_platform_specific_config(tool_id, tool_type, platform)
        return config is not None
    
    def get_installation_size(self, tool_id: str, tool_type: str, platform: str) -> Optional[str]:
        """Get estimated installation size for a tool"""
        config = self.get_platform_specific_config(tool_id, tool_type, platform)
        
        if not config:
            return None
        
        return config.get("size", "Unknown")
    
    def get_tool_version(self, tool_id: str, tool_type: str, platform: str) -> Optional[str]:
        """Get tool version for specific platform"""
        config = self.get_platform_specific_config(tool_id, tool_type, platform)
        
        if not config:
            return None
        
        return config.get("version", "latest")