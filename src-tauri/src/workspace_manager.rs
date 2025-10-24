use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::command;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub workspace_type: String,
    pub status: String,
    pub tools: Vec<InstalledTool>,
    pub config: WorkspaceConfig,
    pub resource_usage: ResourceUsage,
    pub created_at: DateTime<Utc>,
    pub last_active: DateTime<Utc>,
    pub user_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceConfig {
    pub auto_start: bool,
    pub port_mappings: Vec<PortMapping>,
    pub environment_variables: HashMap<String, String>,
    pub startup_commands: Vec<String>,
    pub cleanup_commands: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortMapping {
    pub host_port: u16,
    pub container_port: u16,
    pub protocol: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceUsage {
    pub cpu: f64,
    pub memory: u64,
    pub disk: u64,
    pub network_in: f64,
    pub network_out: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstalledTool {
    pub name: String,
    pub tool_type: String,
    pub version: String,
    pub path: String,
    pub size: u64,
    pub status: String,
    pub dependencies: Vec<String>,
    pub conflicts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateWorkspaceRequest {
    pub name: String,
    pub workspace_type: String,
    pub tools: Vec<String>,
    pub config: Option<WorkspaceConfig>,
}

pub struct WorkspaceManager {
    workspaces: Vec<Workspace>,
}

impl WorkspaceManager {
    pub fn new() -> Self {
        Self {
            workspaces: Vec::new(),
        }
    }

    pub fn create_workspace(&mut self, request: CreateWorkspaceRequest) -> Result<Workspace, String> {
        let workspace = Workspace {
            id: Uuid::new_v4().to_string(),
            name: request.name,
            workspace_type: request.workspace_type,
            status: "inactive".to_string(),
            tools: Vec::new(),
            config: request.config.unwrap_or_else(|| WorkspaceConfig {
                auto_start: false,
                port_mappings: Vec::new(),
                environment_variables: HashMap::new(),
                startup_commands: Vec::new(),
                cleanup_commands: Vec::new(),
            }),
            resource_usage: ResourceUsage {
                cpu: 0.0,
                memory: 0,
                disk: 0,
                network_in: 0.0,
                network_out: 0.0,
            },
            created_at: Utc::now(),
            last_active: Utc::now(),
            user_id: "default".to_string(), // TODO: Get from auth
        };

        self.workspaces.push(workspace.clone());
        Ok(workspace)
    }

    pub fn get_workspaces(&self) -> Vec<Workspace> {
        self.workspaces.clone()
    }

    pub fn get_workspace(&self, id: &str) -> Option<Workspace> {
        self.workspaces.iter().find(|w| w.id == id).cloned()
    }

    pub fn update_workspace(&mut self, id: &str, updates: HashMap<String, serde_json::Value>) -> Result<Workspace, String> {
        if let Some(workspace) = self.workspaces.iter_mut().find(|w| w.id == id) {
            // Update fields based on the updates map
            if let Some(name) = updates.get("name").and_then(|v| v.as_str()) {
                workspace.name = name.to_string();
            }
            if let Some(status) = updates.get("status").and_then(|v| v.as_str()) {
                workspace.status = status.to_string();
            }
            workspace.last_active = Utc::now();
            Ok(workspace.clone())
        } else {
            Err("Workspace not found".to_string())
        }
    }

    pub fn delete_workspace(&mut self, id: &str) -> Result<(), String> {
        let initial_len = self.workspaces.len();
        self.workspaces.retain(|w| w.id != id);
        
        if self.workspaces.len() < initial_len {
            Ok(())
        } else {
            Err("Workspace not found".to_string())
        }
    }

    pub fn activate_workspace(&mut self, id: &str) -> Result<Workspace, String> {
        if let Some(workspace) = self.workspaces.iter_mut().find(|w| w.id == id) {
            workspace.status = "active".to_string();
            workspace.last_active = Utc::now();
            Ok(workspace.clone())
        } else {
            Err("Workspace not found".to_string())
        }
    }

    pub fn deactivate_workspace(&mut self, id: &str) -> Result<Workspace, String> {
        if let Some(workspace) = self.workspaces.iter_mut().find(|w| w.id == id) {
            workspace.status = "inactive".to_string();
            Ok(workspace.clone())
        } else {
            Err("Workspace not found".to_string())
        }
    }
}

// Tauri commands
#[command]
pub async fn create_workspace(request: CreateWorkspaceRequest) -> Result<Workspace, String> {
    // TODO: Use global state manager
    let mut manager = WorkspaceManager::new();
    manager.create_workspace(request)
}

#[command]
pub async fn get_workspaces() -> Result<Vec<Workspace>, String> {
    // TODO: Use global state manager
    let manager = WorkspaceManager::new();
    Ok(manager.get_workspaces())
}

#[command]
pub async fn get_workspace(id: String) -> Result<Option<Workspace>, String> {
    // TODO: Use global state manager
    let manager = WorkspaceManager::new();
    Ok(manager.get_workspace(&id))
}

#[command]
pub async fn update_workspace(id: String, updates: HashMap<String, serde_json::Value>) -> Result<Workspace, String> {
    // TODO: Use global state manager
    let mut manager = WorkspaceManager::new();
    manager.update_workspace(&id, updates)
}

#[command]
pub async fn delete_workspace(id: String) -> Result<(), String> {
    // TODO: Use global state manager
    let mut manager = WorkspaceManager::new();
    manager.delete_workspace(&id)
}

#[command]
pub async fn activate_workspace(id: String) -> Result<Workspace, String> {
    // TODO: Use global state manager
    let mut manager = WorkspaceManager::new();
    manager.activate_workspace(&id)
}

#[command]
pub async fn deactivate_workspace(id: String) -> Result<Workspace, String> {
    // TODO: Use global state manager
    let mut manager = WorkspaceManager::new();
    manager.deactivate_workspace(&id)
}