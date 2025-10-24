// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use sysinfo::{System, SystemExt, CpuExt, ProcessExt, DiskExt};
use std::time::{SystemTime, UNIX_EPOCH};

mod models;
mod database;
mod workspace_manager;
mod scanner;
mod installer;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to NUFFI!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Developer tools disabled for better UX
            // #[cfg(debug_assertions)]
            // {
            //     let window = app.get_webview_window("main").unwrap();
            //     window.open_devtools();
            // }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // Workspace management
            workspace_manager::create_workspace,
            workspace_manager::get_workspaces,
            workspace_manager::get_workspace,
            workspace_manager::update_workspace,
            workspace_manager::delete_workspace,
            workspace_manager::activate_workspace,
            workspace_manager::deactivate_workspace,
            // System scanning
            scanner::scan_system,
            scanner::analyze_repository,
            // Tool installation
            installer::install_tool,
            installer::get_installation_job,
            installer::get_all_installation_jobs,
            // System monitoring
            get_system_metrics,
            // Real installation commands
            check_tool_installed,
            get_platform,
            check_package_manager,
            execute_installation,
            clone_dotfiles,
            install_dotfiles,
            get_historical_metrics,
            // Setup system
            check_dependency,
            install_dependency
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(serde::Serialize)]
struct SystemMetrics {
    cpu_usage: f32,
    memory_usage: f32,
    disk_usage: u64,
    network_io: u64,
    active_processes: usize,
    uptime_seconds: u64,
}

#[tauri::command]
async fn get_system_metrics() -> Result<SystemMetrics, String> {
    let mut system = System::new_all();
    system.refresh_all();
    
    // Calculate CPU usage (average across all cores)
    let cpu_usage = system.cpus().iter()
        .map(|cpu| cpu.cpu_usage())
        .sum::<f32>() / system.cpus().len() as f32;
    
    // Calculate memory usage percentage
    let total_memory = system.total_memory();
    let used_memory = system.used_memory();
    let memory_usage = if total_memory > 0 {
        (used_memory as f32 / total_memory as f32) * 100.0
    } else {
        0.0
    };
    
    // Get disk usage (first disk)
    let disk_usage = system.disks().first()
        .map(|disk| disk.total_space() - disk.available_space())
        .unwrap_or(0);
    
    // Count active processes
    let active_processes = system.processes().len();
    
    // Get system uptime
    let uptime_seconds = system.uptime();
    
    // Network I/O (simplified - would need more complex implementation for real network stats)
    let network_io = 0; // Placeholder
    
    Ok(SystemMetrics {
        cpu_usage,
        memory_usage,
        disk_usage,
        network_io,
        active_processes,
        uptime_seconds,
    })
}

#[tauri::command]
async fn get_historical_metrics(limit: usize) -> Result<Vec<SystemMetrics>, String> {
    // In a real implementation, this would fetch from database
    // For now, return empty array - the frontend will use mock data
    Ok(vec![])
}

#[tauri::command]
async fn check_dependency(command: String) -> Result<bool, String> {
    use std::process::Command;
    
    let parts: Vec<&str> = command.split_whitespace().collect();
    if parts.is_empty() {
        return Err("Invalid command".to_string());
    }
    
    let result = Command::new(parts[0])
        .args(&parts[1..])
        .output();
    
    match result {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn install_dependency(dependency: String) -> Result<bool, String> {
    use std::process::Command;
    
    match dependency.as_str() {
        "tauri-cli" => {
            let result = Command::new("cargo")
                .args(&["install", "tauri-cli"])
                .output();
            
            match result {
                Ok(output) => Ok(output.status.success()),
                Err(e) => Err(format!("Failed to install Tauri CLI: {}", e)),
            }
        }
        _ => Err(format!("Unknown dependency: {}", dependency)),
    }
}

fn main() {
    run();
}
// Real installation commands
#[tauri::command]
async fn check_tool_installed(tool_name: String, check_commands: Vec<String>) -> Result<serde_json::Value, String> {
    use std::process::Command;
    
    for cmd in check_commands {
        let parts: Vec<&str> = cmd.split_whitespace().collect();
        if parts.is_empty() { continue; }
        
        let mut command = Command::new(parts[0]);
        if parts.len() > 1 {
            command.args(&parts[1..]);
        }
        
        match command.output() {
            Ok(output) if output.status.success() => {
                let version = String::from_utf8_lossy(&output.stdout);
                return Ok(serde_json::json!({
                    "success": true,
                    "path": parts[0],
                    "version": version.trim()
                }));
            }
            _ => continue,
        }
    }
    
    Ok(serde_json::json!({
        "success": false
    }))
}

#[tauri::command]
async fn get_platform() -> Result<String, String> {
    Ok(std::env::consts::OS.to_string())
}

#[tauri::command]
async fn check_package_manager(manager: String) -> Result<bool, String> {
    use std::process::Command;
    
    let check_cmd = match manager.as_str() {
        "brew" => "brew --version",
        "apt" => "apt --version",
        "yum" => "yum --version",
        "dnf" => "dnf --version",
        "pacman" => "pacman --version",
        "chocolatey" => "choco --version",
        "winget" => "winget --version",
        "scoop" => "scoop --version",
        "npm" => "npm --version",
        "pip" => "pip --version",
        _ => return Ok(false),
    };
    
    let parts: Vec<&str> = check_cmd.split_whitespace().collect();
    if parts.is_empty() { return Ok(false); }
    
    let mut command = Command::new(parts[0]);
    if parts.len() > 1 {
        command.args(&parts[1..]);
    }
    
    match command.output() {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn execute_installation(command: String, tool_name: String) -> Result<serde_json::Value, String> {
    use std::process::Command;
    use std::time::Duration;
    
    println!("Installing {}: {}", tool_name, command);
    
    // Parse command
    let parts: Vec<&str> = command.split_whitespace().collect();
    if parts.is_empty() {
        return Err("Empty command".to_string());
    }
    
    let mut cmd = Command::new(parts[0]);
    if parts.len() > 1 {
        cmd.args(&parts[1..]);
    }
    
    // Execute with timeout
    match cmd.output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            let combined_output = format!("{}\n{}", stdout, stderr);
            
            if output.status.success() {
                Ok(serde_json::json!({
                    "success": true,
                    "output": combined_output
                }))
            } else {
                Ok(serde_json::json!({
                    "success": false,
                    "output": combined_output,
                    "error": format!("Command failed with exit code: {:?}", output.status.code())
                }))
            }
        }
        Err(e) => {
            Err(format!("Failed to execute command: {}", e))
        }
    }
}

#[tauri::command]
async fn clone_dotfiles(repo_url: String, target_dir: String) -> Result<serde_json::Value, String> {
    use std::process::Command;
    
    println!("Cloning dotfiles from {} to {}", repo_url, target_dir);
    
    // Expand ~ in target_dir
    let expanded_dir = if target_dir.starts_with("~/") {
        match std::env::var("HOME") {
            Ok(home) => target_dir.replace("~", &home),
            Err(_) => target_dir,
        }
    } else {
        target_dir
    };
    
    let mut cmd = Command::new("git");
    cmd.args(&["clone", &repo_url, &expanded_dir]);
    
    match cmd.output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            let combined_output = format!("{}\n{}", stdout, stderr);
            
            if output.status.success() {
                Ok(serde_json::json!({
                    "success": true,
                    "output": combined_output
                }))
            } else {
                Ok(serde_json::json!({
                    "success": false,
                    "output": combined_output,
                    "error": "Git clone failed"
                }))
            }
        }
        Err(e) => {
            Err(format!("Failed to clone dotfiles: {}", e))
        }
    }
}

#[tauri::command]
async fn install_dotfiles(dotfiles_dir: String) -> Result<serde_json::Value, String> {
    use std::process::Command;
    use std::path::Path;
    
    println!("Installing dotfiles from {}", dotfiles_dir);
    
    // Expand ~ in dotfiles_dir
    let expanded_dir = if dotfiles_dir.starts_with("~/") {
        match std::env::var("HOME") {
            Ok(home) => dotfiles_dir.replace("~", &home),
            Err(_) => dotfiles_dir,
        }
    } else {
        dotfiles_dir
    };
    
    // Check if install script exists
    let install_script = Path::new(&expanded_dir).join("install.sh");
    let makefile = Path::new(&expanded_dir).join("Makefile");
    
    let mut cmd = if install_script.exists() {
        let mut c = Command::new("bash");
        c.arg(install_script);
        c
    } else if makefile.exists() {
        let mut c = Command::new("make");
        c.current_dir(&expanded_dir);
        c.arg("install");
        c
    } else {
        // Fallback: try to symlink common dotfiles
        let mut c = Command::new("bash");
        c.arg("-c");
        c.arg(format!("cd {} && for file in .*; do [ -f \"$file\" ] && ln -sf \"$(pwd)/$file\" \"$HOME/$file\"; done", expanded_dir));
        c
    };
    
    match cmd.output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            let combined_output = format!("{}\n{}", stdout, stderr);
            
            Ok(serde_json::json!({
                "success": true,
                "output": combined_output
            }))
        }
        Err(e) => {
            Err(format!("Failed to install dotfiles: {}", e))
        }
    }
}