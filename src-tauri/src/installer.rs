use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tauri::command;
use tokio::sync::mpsc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallationJob {
    pub id: String,
    pub workspace_id: String,
    pub tool: ToolInstallRequest,
    pub status: String,
    pub progress: u8,
    pub log: Vec<String>,
    pub started_at: Option<chrono::DateTime<chrono::Utc>>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolInstallRequest {
    pub name: String,
    pub tool_type: String,
    pub version: Option<String>,
    pub required: bool,
    pub alternatives: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallationProgress {
    pub job_id: String,
    pub progress: u8,
    pub message: String,
    pub status: String,
}

pub struct UniversalInstaller {
    jobs: Arc<Mutex<HashMap<String, InstallationJob>>>,
}

impl UniversalInstaller {
    pub fn new() -> Self {
        Self {
            jobs: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn install_tool(&self, workspace_id: String, tool: ToolInstallRequest) -> Result<String, String> {
        let job_id = uuid::Uuid::new_v4().to_string();
        
        let job = InstallationJob {
            id: job_id.clone(),
            workspace_id,
            tool: tool.clone(),
            status: "queued".to_string(),
            progress: 0,
            log: Vec::new(),
            started_at: None,
            completed_at: None,
            error: None,
        };

        {
            let mut jobs = self.jobs.lock().unwrap();
            jobs.insert(job_id.clone(), job);
        }

        // Start installation in background
        let jobs_clone = Arc::clone(&self.jobs);
        let job_id_clone = job_id.clone();
        
        tokio::spawn(async move {
            Self::execute_installation(jobs_clone, job_id_clone, tool).await;
        });

        Ok(job_id)
    }

    async fn execute_installation(
        jobs: Arc<Mutex<HashMap<String, InstallationJob>>>,
        job_id: String,
        tool: ToolInstallRequest,
    ) {
        // Update job status to installing
        {
            let mut jobs_guard = jobs.lock().unwrap();
            if let Some(job) = jobs_guard.get_mut(&job_id) {
                job.status = "installing".to_string();
                job.started_at = Some(chrono::Utc::now());
                job.progress = 10;
                job.log.push("Starting installation...".to_string());
            }
        }

        let result = match tool.tool_type.as_str() {
            "language" => Self::install_language(&tool).await,
            "database" => Self::install_database(&tool).await,
            "ide" => Self::install_ide(&tool).await,
            "cli" => Self::install_cli_tool(&tool).await,
            "package" => Self::install_package_manager(&tool).await,
            _ => Err("Unknown tool type".to_string()),
        };

        // Update job with result
        {
            let mut jobs_guard = jobs.lock().unwrap();
            if let Some(job) = jobs_guard.get_mut(&job_id) {
                match result {
                    Ok(log_messages) => {
                        job.status = "completed".to_string();
                        job.progress = 100;
                        job.log.extend(log_messages);
                        job.completed_at = Some(chrono::Utc::now());
                    }
                    Err(error) => {
                        job.status = "failed".to_string();
                        job.error = Some(error.clone());
                        job.log.push(format!("Error: {}", error));
                        job.completed_at = Some(chrono::Utc::now());
                    }
                }
            }
        }
    }

    async fn install_language(tool: &ToolInstallRequest) -> Result<Vec<String>, String> {
        let mut log = Vec::new();
        
        match tool.name.as_str() {
            "Python" => {
                log.push("Installing Python...".to_string());
                
                // Use pyenv for Python installation
                let output = Command::new("pyenv")
                    .args(&["install", tool.version.as_deref().unwrap_or("3.11.0")])
                    .output()
                    .map_err(|e| format!("Failed to run pyenv: {}", e))?;

                if output.status.success() {
                    log.push("Python installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Python installation failed: {}", error));
                }
            }
            "Node.js" => {
                log.push("Installing Node.js...".to_string());
                
                // Use nvm for Node.js installation
                let output = Command::new("nvm")
                    .args(&["install", tool.version.as_deref().unwrap_or("18")])
                    .output()
                    .map_err(|e| format!("Failed to run nvm: {}", e))?;

                if output.status.success() {
                    log.push("Node.js installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Node.js installation failed: {}", error));
                }
            }
            "Rust" => {
                log.push("Installing Rust...".to_string());
                
                // Use rustup for Rust installation
                let output = Command::new("rustup")
                    .args(&["toolchain", "install", tool.version.as_deref().unwrap_or("stable")])
                    .output()
                    .map_err(|e| format!("Failed to run rustup: {}", e))?;

                if output.status.success() {
                    log.push("Rust installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Rust installation failed: {}", error));
                }
            }
            _ => {
                return Err(format!("Unsupported language: {}", tool.name));
            }
        }

        Ok(log)
    }

    async fn install_database(tool: &ToolInstallRequest) -> Result<Vec<String>, String> {
        let mut log = Vec::new();
        
        match tool.name.as_str() {
            "PostgreSQL" => {
                log.push("Installing PostgreSQL...".to_string());
                
                // Use Homebrew on macOS
                let output = Command::new("brew")
                    .args(&["install", "postgresql"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("PostgreSQL installed successfully".to_string());
                    log.push("Starting PostgreSQL service...".to_string());
                    
                    // Start the service
                    let _ = Command::new("brew")
                        .args(&["services", "start", "postgresql"])
                        .output();
                        
                    log.push("PostgreSQL service started".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("PostgreSQL installation failed: {}", error));
                }
            }
            "MySQL" => {
                log.push("Installing MySQL...".to_string());
                
                let output = Command::new("brew")
                    .args(&["install", "mysql"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("MySQL installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("MySQL installation failed: {}", error));
                }
            }
            "Redis" => {
                log.push("Installing Redis...".to_string());
                
                let output = Command::new("brew")
                    .args(&["install", "redis"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("Redis installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Redis installation failed: {}", error));
                }
            }
            _ => {
                return Err(format!("Unsupported database: {}", tool.name));
            }
        }

        Ok(log)
    }

    async fn install_ide(tool: &ToolInstallRequest) -> Result<Vec<String>, String> {
        let mut log = Vec::new();
        
        match tool.name.as_str() {
            "Visual Studio Code" => {
                log.push("Installing Visual Studio Code...".to_string());
                
                let output = Command::new("brew")
                    .args(&["install", "--cask", "visual-studio-code"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("Visual Studio Code installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("VS Code installation failed: {}", error));
                }
            }
            _ => {
                return Err(format!("Unsupported IDE: {}", tool.name));
            }
        }

        Ok(log)
    }

    async fn install_cli_tool(tool: &ToolInstallRequest) -> Result<Vec<String>, String> {
        let mut log = Vec::new();
        
        match tool.name.as_str() {
            "Git" => {
                log.push("Installing Git...".to_string());
                
                let output = Command::new("brew")
                    .args(&["install", "git"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("Git installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Git installation failed: {}", error));
                }
            }
            "Docker" => {
                log.push("Installing Docker...".to_string());
                
                let output = Command::new("brew")
                    .args(&["install", "--cask", "docker"])
                    .output()
                    .map_err(|e| format!("Failed to run brew: {}", e))?;

                if output.status.success() {
                    log.push("Docker installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Docker installation failed: {}", error));
                }
            }
            _ => {
                return Err(format!("Unsupported CLI tool: {}", tool.name));
            }
        }

        Ok(log)
    }

    async fn install_package_manager(tool: &ToolInstallRequest) -> Result<Vec<String>, String> {
        let mut log = Vec::new();
        
        match tool.name.as_str() {
            "Homebrew" => {
                log.push("Installing Homebrew...".to_string());
                
                let output = Command::new("bash")
                    .args(&["-c", r#"/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)""#])
                    .output()
                    .map_err(|e| format!("Failed to install Homebrew: {}", e))?;

                if output.status.success() {
                    log.push("Homebrew installed successfully".to_string());
                } else {
                    let error = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Homebrew installation failed: {}", error));
                }
            }
            _ => {
                return Err(format!("Unsupported package manager: {}", tool.name));
            }
        }

        Ok(log)
    }

    pub fn get_job(&self, job_id: &str) -> Option<InstallationJob> {
        let jobs = self.jobs.lock().unwrap();
        jobs.get(job_id).cloned()
    }

    pub fn get_all_jobs(&self) -> Vec<InstallationJob> {
        let jobs = self.jobs.lock().unwrap();
        jobs.values().cloned().collect()
    }
}

// Tauri commands
#[command]
pub async fn install_tool(workspace_id: String, tool: ToolInstallRequest) -> Result<String, String> {
    let installer = UniversalInstaller::new();
    installer.install_tool(workspace_id, tool)
}

#[command]
pub async fn get_installation_job(job_id: String) -> Result<Option<InstallationJob>, String> {
    let installer = UniversalInstaller::new();
    Ok(installer.get_job(&job_id))
}

#[command]
pub async fn get_all_installation_jobs() -> Result<Vec<InstallationJob>, String> {
    let installer = UniversalInstaller::new();
    Ok(installer.get_all_jobs())
}