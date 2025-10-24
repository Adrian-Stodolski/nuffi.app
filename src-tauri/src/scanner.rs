use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::command;
use walkdir::WalkDir;
use regex::Regex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemScan {
    pub id: String,
    pub user_id: String,
    pub detected_tools: Vec<DetectedTool>,
    pub conflicts: Vec<ToolConflict>,
    pub suggestions: Vec<String>,
    pub scanned_at: chrono::DateTime<chrono::Utc>,
    pub os_info: SystemInfo,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectedTool {
    pub name: String,
    pub tool_type: String,
    pub version: String,
    pub path: String,
    pub size: u64,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolConflict {
    pub tool_name: String,
    pub conflict_type: String,
    pub description: String,
    pub resolution: String,
    pub severity: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub cpu_count: usize,
    pub memory_total: u64,
    pub disk_total: u64,
    pub platform_version: String,
    pub shell: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepositoryAnalysis {
    pub url: String,
    pub detected_languages: Vec<String>,
    pub frameworks: Vec<String>,
    pub databases: Vec<String>,
    pub services: Vec<String>,
    pub tools_needed: Vec<ToolRequirement>,
    pub estimated_setup_time: u32,
    pub complexity_score: u8,
    pub suggested_workspace_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolRequirement {
    pub name: String,
    pub tool_type: String,
    pub version: Option<String>,
    pub required: bool,
    pub alternatives: Vec<String>,
}

pub struct SystemScanner;

impl SystemScanner {
    pub fn new() -> Self {
        Self
    }

    pub fn scan_system(&self) -> Result<SystemScan, String> {
        let detected_tools = self.detect_installed_tools()?;
        let conflicts = self.detect_conflicts(&detected_tools);
        let suggestions = self.generate_suggestions(&detected_tools, &conflicts);
        let os_info = self.get_system_info()?;

        Ok(SystemScan {
            id: uuid::Uuid::new_v4().to_string(),
            user_id: "default".to_string(),
            detected_tools,
            conflicts,
            suggestions,
            scanned_at: chrono::Utc::now(),
            os_info,
        })
    }

    fn detect_installed_tools(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();

        // Detect programming languages
        tools.extend(self.detect_languages()?);
        
        // Detect databases
        tools.extend(self.detect_databases()?);
        
        // Detect IDEs and editors
        tools.extend(self.detect_ides()?);
        
        // Detect CLI tools
        tools.extend(self.detect_cli_tools()?);
        
        // Detect package managers
        tools.extend(self.detect_package_managers()?);

        Ok(tools)
    }

    fn detect_languages(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();
        
        // Python
        if let Ok(output) = Command::new("python3").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.trim().replace("Python ", "");
                
                if let Ok(which_output) = Command::new("which").arg("python3").output() {
                    let path = String::from_utf8_lossy(&which_output.stdout).trim().to_string();
                    
                    tools.push(DetectedTool {
                        name: "Python".to_string(),
                        tool_type: "language".to_string(),
                        version,
                        path,
                        size: 0, // TODO: Calculate actual size
                        status: "installed".to_string(),
                    });
                }
            }
        }

        // Node.js
        if let Ok(output) = Command::new("node").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                
                if let Ok(which_output) = Command::new("which").arg("node").output() {
                    let path = String::from_utf8_lossy(&which_output.stdout).trim().to_string();
                    
                    tools.push(DetectedTool {
                        name: "Node.js".to_string(),
                        tool_type: "language".to_string(),
                        version,
                        path,
                        size: 0,
                        status: "installed".to_string(),
                    });
                }
            }
        }

        // Rust
        if let Ok(output) = Command::new("rustc").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(1).unwrap_or("unknown").to_string();
                
                if let Ok(which_output) = Command::new("which").arg("rustc").output() {
                    let path = String::from_utf8_lossy(&which_output.stdout).trim().to_string();
                    
                    tools.push(DetectedTool {
                        name: "Rust".to_string(),
                        tool_type: "language".to_string(),
                        version,
                        path,
                        size: 0,
                        status: "installed".to_string(),
                    });
                }
            }
        }

        // Go
        if let Ok(output) = Command::new("go").arg("version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(2).unwrap_or("unknown").to_string();
                
                if let Ok(which_output) = Command::new("which").arg("go").output() {
                    let path = String::from_utf8_lossy(&which_output.stdout).trim().to_string();
                    
                    tools.push(DetectedTool {
                        name: "Go".to_string(),
                        tool_type: "language".to_string(),
                        version,
                        path,
                        size: 0,
                        status: "installed".to_string(),
                    });
                }
            }
        }

        Ok(tools)
    }

    fn detect_databases(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();

        // PostgreSQL
        if let Ok(output) = Command::new("psql").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(2).unwrap_or("unknown").to_string();
                
                tools.push(DetectedTool {
                    name: "PostgreSQL".to_string(),
                    tool_type: "database".to_string(),
                    version,
                    path: "/usr/local/bin/psql".to_string(), // Default path
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        // MySQL
        if let Ok(output) = Command::new("mysql").arg("--version").output() {
            if output.status.success() {
                let _version = String::from_utf8_lossy(&output.stdout);
                // Parse MySQL version from output
                let version = "unknown".to_string(); // TODO: Parse properly
                
                tools.push(DetectedTool {
                    name: "MySQL".to_string(),
                    tool_type: "database".to_string(),
                    version,
                    path: "/usr/local/bin/mysql".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        // Redis
        if let Ok(output) = Command::new("redis-server").arg("--version").output() {
            if output.status.success() {
                let _version = String::from_utf8_lossy(&output.stdout);
                let version = "unknown".to_string(); // TODO: Parse properly
                
                tools.push(DetectedTool {
                    name: "Redis".to_string(),
                    tool_type: "database".to_string(),
                    version,
                    path: "/usr/local/bin/redis-server".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        Ok(tools)
    }

    fn detect_ides(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();

        // VS Code
        if let Ok(output) = Command::new("code").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.lines().next().unwrap_or("unknown").to_string();
                
                tools.push(DetectedTool {
                    name: "Visual Studio Code".to_string(),
                    tool_type: "ide".to_string(),
                    version,
                    path: "/usr/local/bin/code".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        Ok(tools)
    }

    fn detect_cli_tools(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();

        // Git
        if let Ok(output) = Command::new("git").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(2).unwrap_or("unknown").to_string();
                
                tools.push(DetectedTool {
                    name: "Git".to_string(),
                    tool_type: "cli".to_string(),
                    version,
                    path: "/usr/bin/git".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        // Docker
        if let Ok(output) = Command::new("docker").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(2).unwrap_or("unknown").to_string();
                
                tools.push(DetectedTool {
                    name: "Docker".to_string(),
                    tool_type: "cli".to_string(),
                    version,
                    path: "/usr/local/bin/docker".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        Ok(tools)
    }

    fn detect_package_managers(&self) -> Result<Vec<DetectedTool>, String> {
        let mut tools = Vec::new();

        // npm
        if let Ok(output) = Command::new("npm").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                
                tools.push(DetectedTool {
                    name: "npm".to_string(),
                    tool_type: "package".to_string(),
                    version,
                    path: "/usr/local/bin/npm".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        // pip
        if let Ok(output) = Command::new("pip3").arg("--version").output() {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                let version = version.split_whitespace().nth(1).unwrap_or("unknown").to_string();
                
                tools.push(DetectedTool {
                    name: "pip".to_string(),
                    tool_type: "package".to_string(),
                    version,
                    path: "/usr/local/bin/pip3".to_string(),
                    size: 0,
                    status: "installed".to_string(),
                });
            }
        }

        Ok(tools)
    }

    fn detect_conflicts(&self, tools: &[DetectedTool]) -> Vec<ToolConflict> {
        let mut conflicts = Vec::new();

        // Check for multiple Python versions
        let python_tools: Vec<_> = tools.iter().filter(|t| t.name.contains("Python")).collect();
        if python_tools.len() > 1 {
            conflicts.push(ToolConflict {
                tool_name: "Python".to_string(),
                conflict_type: "version".to_string(),
                description: "Multiple Python versions detected".to_string(),
                resolution: "Use pyenv to manage Python versions".to_string(),
                severity: "medium".to_string(),
            });
        }

        // Check for multiple Node.js versions
        let node_tools: Vec<_> = tools.iter().filter(|t| t.name.contains("Node")).collect();
        if node_tools.len() > 1 {
            conflicts.push(ToolConflict {
                tool_name: "Node.js".to_string(),
                conflict_type: "version".to_string(),
                description: "Multiple Node.js versions detected".to_string(),
                resolution: "Use nvm to manage Node.js versions".to_string(),
                severity: "medium".to_string(),
            });
        }

        conflicts
    }

    fn generate_suggestions(&self, tools: &[DetectedTool], conflicts: &[ToolConflict]) -> Vec<String> {
        let mut suggestions = Vec::new();

        if !tools.iter().any(|t| t.name == "Git") {
            suggestions.push("Install Git for version control".to_string());
        }

        if !tools.iter().any(|t| t.name == "Docker") {
            suggestions.push("Install Docker for containerization".to_string());
        }

        if !conflicts.is_empty() {
            suggestions.push("Resolve version conflicts for better stability".to_string());
        }

        suggestions
    }

    fn get_system_info(&self) -> Result<SystemInfo, String> {
        Ok(SystemInfo {
            os: std::env::consts::OS.to_string(),
            arch: std::env::consts::ARCH.to_string(),
            cpu_count: num_cpus::get(),
            memory_total: 0, // TODO: Get actual memory info
            disk_total: 0,   // TODO: Get actual disk info
            platform_version: "unknown".to_string(), // TODO: Get platform version
            shell: std::env::var("SHELL").unwrap_or_else(|_| "unknown".to_string()),
        })
    }

    pub fn analyze_repository(&self, url: &str) -> Result<RepositoryAnalysis, String> {
        // TODO: Clone repository temporarily and analyze
        // For now, return a mock analysis
        Ok(RepositoryAnalysis {
            url: url.to_string(),
            detected_languages: vec!["JavaScript".to_string(), "TypeScript".to_string()],
            frameworks: vec!["React".to_string(), "Node.js".to_string()],
            databases: vec!["PostgreSQL".to_string()],
            services: vec!["Redis".to_string()],
            tools_needed: vec![
                ToolRequirement {
                    name: "Node.js".to_string(),
                    tool_type: "language".to_string(),
                    version: Some("18.x".to_string()),
                    required: true,
                    alternatives: vec![],
                },
                ToolRequirement {
                    name: "PostgreSQL".to_string(),
                    tool_type: "database".to_string(),
                    version: Some("15.x".to_string()),
                    required: true,
                    alternatives: vec!["MySQL".to_string()],
                },
            ],
            estimated_setup_time: 15,
            complexity_score: 6,
            suggested_workspace_type: "web-dev".to_string(),
        })
    }
}

// Tauri commands
#[command]
pub async fn scan_system() -> Result<SystemScan, String> {
    let scanner = SystemScanner::new();
    scanner.scan_system()
}

#[command]
pub async fn analyze_repository(url: String) -> Result<RepositoryAnalysis, String> {
    let scanner = SystemScanner::new();
    scanner.analyze_repository(&url)
}