use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::error::EnvError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ProjectType {
    NodeJS,
    Rust,
    Python,
    Mixed,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum DependencyType {
    Runtime,
    Development,
    Build,
    System,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EnvironmentStatus {
    Active,
    Inactive,
    Installing,
    Error(String),
    Validating,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DependencySpec {
    pub name: String,
    pub version: Option<String>,
    pub dependency_type: DependencyType,
    pub install_command: Option<String>,
    pub required: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AISettings {
    pub enabled: bool,
    pub preferred_model: Option<String>,
    pub analysis_frequency: Option<String>,
    pub auto_suggestions: bool,
}

impl Default for AISettings {
    fn default() -> Self {
        Self {
            enabled: true,
            preferred_model: None,
            analysis_frequency: Some("on_save".to_string()),
            auto_suggestions: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentConfig {
    pub name: String,
    pub path: PathBuf,
    pub project_type: ProjectType,
    pub dependencies: Vec<DependencySpec>,
    pub environment_variables: HashMap<String, String>,
    pub scripts: HashMap<String, String>,
    pub ai_settings: AISettings,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Environment {
    pub id: String,
    pub name: String,
    pub path: PathBuf,
    pub project_type: ProjectType,
    pub dependencies: Vec<DependencySpec>,
    pub environment_variables: HashMap<String, String>,
    pub scripts: HashMap<String, String>,
    pub ai_settings: AISettings,
    pub description: Option<String>,
    pub status: EnvironmentStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_activated: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub missing_dependencies: Vec<String>,
    pub invalid_paths: Vec<String>,
    pub warnings: Vec<String>,
    pub errors: Vec<String>,
}

impl EnvironmentConfig {
    pub fn new(name: String, path: PathBuf, project_type: ProjectType) -> Self {
        Self {
            name,
            path,
            project_type,
            dependencies: Vec::new(),
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: None,
        }
    }

    pub fn validate(&self) -> Result<(), EnvError> {
        if self.name.trim().is_empty() {
            return Err(EnvError::InvalidConfig("Environment name cannot be empty".to_string()));
        }

        if !self.path.exists() {
            return Err(EnvError::Path(format!("Path does not exist: {}", self.path.display())));
        }

        if !self.path.is_dir() {
            return Err(EnvError::Path(format!("Path is not a directory: {}", self.path.display())));
        }

        // Validate dependencies
        for dep in &self.dependencies {
            if dep.name.trim().is_empty() {
                return Err(EnvError::InvalidConfig("Dependency name cannot be empty".to_string()));
            }
        }

        // Validate scripts
        for (script_name, _) in &self.scripts {
            if script_name.trim().is_empty() {
                return Err(EnvError::InvalidConfig("Script name cannot be empty".to_string()));
            }
        }

        Ok(())
    }

    pub fn add_dependency(&mut self, dependency: DependencySpec) {
        // Remove existing dependency with same name if it exists
        self.dependencies.retain(|dep| dep.name != dependency.name);
        self.dependencies.push(dependency);
    }

    pub fn remove_dependency(&mut self, name: &str) {
        self.dependencies.retain(|dep| dep.name != name);
    }

    pub fn add_script(&mut self, name: String, command: String) {
        self.scripts.insert(name, command);
    }

    pub fn remove_script(&mut self, name: &str) {
        self.scripts.remove(name);
    }

    pub fn set_environment_variable(&mut self, key: String, value: String) {
        self.environment_variables.insert(key, value);
    }

    pub fn remove_environment_variable(&mut self, key: &str) {
        self.environment_variables.remove(key);
    }
}

impl Environment {
    pub fn from_config(config: EnvironmentConfig) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name: config.name,
            path: config.path,
            project_type: config.project_type,
            dependencies: config.dependencies,
            environment_variables: config.environment_variables,
            scripts: config.scripts,
            ai_settings: config.ai_settings,
            description: config.description,
            status: EnvironmentStatus::Inactive,
            created_at: now,
            updated_at: now,
            last_activated: None,
        }
    }

    pub fn update_from_config(&mut self, config: EnvironmentConfig) {
        self.name = config.name;
        self.path = config.path;
        self.project_type = config.project_type;
        self.dependencies = config.dependencies;
        self.environment_variables = config.environment_variables;
        self.scripts = config.scripts;
        self.ai_settings = config.ai_settings;
        self.description = config.description;
        self.updated_at = Utc::now();
    }

    pub fn activate(&mut self) {
        self.status = EnvironmentStatus::Active;
        self.last_activated = Some(Utc::now());
        self.updated_at = Utc::now();
    }

    pub fn deactivate(&mut self) {
        self.status = EnvironmentStatus::Inactive;
        self.updated_at = Utc::now();
    }

    pub fn set_status(&mut self, status: EnvironmentStatus) {
        self.status = status;
        self.updated_at = Utc::now();
    }

    pub fn is_active(&self) -> bool {
        matches!(self.status, EnvironmentStatus::Active)
    }

    pub fn validate_dependencies(&self) -> ValidationResult {
        let mut result = ValidationResult {
            is_valid: true,
            missing_dependencies: Vec::new(),
            invalid_paths: Vec::new(),
            warnings: Vec::new(),
            errors: Vec::new(),
        };

        // Check if project path exists
        if !self.path.exists() {
            result.is_valid = false;
            result.invalid_paths.push(self.path.to_string_lossy().to_string());
            result.errors.push(format!("Project path does not exist: {}", self.path.display()));
        }

        // Basic dependency validation (more detailed validation would require actual dependency checking)
        for dep in &self.dependencies {
            if dep.required && dep.version.is_none() {
                result.warnings.push(format!("Required dependency '{}' has no version specified", dep.name));
            }
        }

        result
    }

    pub fn get_dependency(&self, name: &str) -> Option<&DependencySpec> {
        self.dependencies.iter().find(|dep| dep.name == name)
    }

    pub fn has_dependency(&self, name: &str) -> bool {
        self.dependencies.iter().any(|dep| dep.name == name)
    }

    pub fn get_script(&self, name: &str) -> Option<&String> {
        self.scripts.get(name)
    }

    pub fn get_environment_variable(&self, key: &str) -> Option<&String> {
        self.environment_variables.get(key)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_project_type_serialization() {
        let types = vec![
            ProjectType::NodeJS,
            ProjectType::Rust,
            ProjectType::Python,
            ProjectType::Mixed,
        ];
        
        for project_type in types {
            let json = serde_json::to_string(&project_type).unwrap();
            let deserialized: ProjectType = serde_json::from_str(&json).unwrap();
            assert_eq!(project_type, deserialized);
        }
    }

    #[test]
    fn test_dependency_type_serialization() {
        let types = vec![
            DependencyType::Runtime,
            DependencyType::Development,
            DependencyType::Build,
            DependencyType::System,
        ];
        
        for dep_type in types {
            let json = serde_json::to_string(&dep_type).unwrap();
            let deserialized: DependencyType = serde_json::from_str(&json).unwrap();
            assert_eq!(dep_type, deserialized);
        }
    }

    #[test]
    fn test_environment_status_serialization() {
        let statuses = vec![
            EnvironmentStatus::Active,
            EnvironmentStatus::Inactive,
            EnvironmentStatus::Installing,
            EnvironmentStatus::Error("Test error".to_string()),
            EnvironmentStatus::Validating,
        ];
        
        for status in statuses {
            let json = serde_json::to_string(&status).unwrap();
            let deserialized: EnvironmentStatus = serde_json::from_str(&json).unwrap();
            assert_eq!(status, deserialized);
        }
    }

    #[test]
    fn test_ai_settings_default() {
        let settings = AISettings::default();
        assert!(settings.enabled);
        assert_eq!(settings.preferred_model, None);
        assert_eq!(settings.analysis_frequency, Some("on_save".to_string()));
        assert!(settings.auto_suggestions);
    }

    #[test]
    fn test_dependency_spec_creation() {
        let dep = DependencySpec {
            name: "react".to_string(),
            version: Some("18.0.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react@18.0.0".to_string()),
            required: true,
        };
        
        assert_eq!(dep.name, "react");
        assert_eq!(dep.version, Some("18.0.0".to_string()));
        assert_eq!(dep.dependency_type, DependencyType::Runtime);
        assert!(dep.required);
        
        // Test serialization
        let json = serde_json::to_string(&dep).unwrap();
        let deserialized: DependencySpec = serde_json::from_str(&json).unwrap();
        assert_eq!(dep.name, deserialized.name);
        assert_eq!(dep.version, deserialized.version);
        assert_eq!(dep.dependency_type, deserialized.dependency_type);
        assert_eq!(dep.required, deserialized.required);
    }

    #[test]
    fn test_environment_config_validation() {
        let temp_dir = tempdir().unwrap();
        let config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        assert!(config.validate().is_ok());

        // Test empty name
        let mut invalid_config = config.clone();
        invalid_config.name = "".to_string();
        assert!(invalid_config.validate().is_err());
        
        // Test whitespace-only name
        let mut whitespace_name = config.clone();
        whitespace_name.name = "   ".to_string();
        assert!(whitespace_name.validate().is_err());
        
        // Test non-existent path
        let mut invalid_path = config.clone();
        invalid_path.path = PathBuf::from("/non/existent/path");
        assert!(invalid_path.validate().is_err());
        
        // Test file instead of directory
        let temp_file = temp_dir.path().join("test_file.txt");
        std::fs::write(&temp_file, "test content").unwrap();
        let mut file_path = config.clone();
        file_path.path = temp_file;
        assert!(file_path.validate().is_err());
        
        // Test empty dependency name
        let mut invalid_dep = config.clone();
        invalid_dep.dependencies.push(DependencySpec {
            name: "".to_string(),
            version: None,
            dependency_type: DependencyType::Runtime,
            install_command: None,
            required: false,
        });
        assert!(invalid_dep.validate().is_err());
        
        // Test empty script name
        let mut invalid_script = config.clone();
        invalid_script.scripts.insert("".to_string(), "echo test".to_string());
        assert!(invalid_script.validate().is_err());
    }

    #[test]
    fn test_environment_config_dependency_management() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        let dep1 = DependencySpec {
            name: "react".to_string(),
            version: Some("18.0.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react".to_string()),
            required: true,
        };
        
        let dep2 = DependencySpec {
            name: "typescript".to_string(),
            version: Some("5.0.0".to_string()),
            dependency_type: DependencyType::Development,
            install_command: Some("npm install -D typescript".to_string()),
            required: false,
        };
        
        // Add dependencies
        config.add_dependency(dep1.clone());
        config.add_dependency(dep2.clone());
        assert_eq!(config.dependencies.len(), 2);
        
        // Test replacing existing dependency
        let updated_react = DependencySpec {
            name: "react".to_string(),
            version: Some("18.2.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react@18.2.0".to_string()),
            required: true,
        };
        config.add_dependency(updated_react);
        assert_eq!(config.dependencies.len(), 2); // Should still be 2
        
        let react_dep = config.dependencies.iter().find(|d| d.name == "react").unwrap();
        assert_eq!(react_dep.version, Some("18.2.0".to_string()));
        
        // Remove dependency
        config.remove_dependency("react");
        assert_eq!(config.dependencies.len(), 1);
        assert!(config.dependencies.iter().all(|d| d.name != "react"));
        
        // Remove non-existent dependency
        config.remove_dependency("non-existent");
        assert_eq!(config.dependencies.len(), 1);
    }

    #[test]
    fn test_environment_config_script_management() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        // Add scripts
        config.add_script("build".to_string(), "npm run build".to_string());
        config.add_script("test".to_string(), "npm test".to_string());
        assert_eq!(config.scripts.len(), 2);
        
        // Update existing script
        config.add_script("build".to_string(), "npm run build:prod".to_string());
        assert_eq!(config.scripts.len(), 2);
        assert_eq!(config.scripts.get("build"), Some(&"npm run build:prod".to_string()));
        
        // Remove script
        config.remove_script("test");
        assert_eq!(config.scripts.len(), 1);
        assert!(!config.scripts.contains_key("test"));
        
        // Remove non-existent script
        config.remove_script("non-existent");
        assert_eq!(config.scripts.len(), 1);
    }

    #[test]
    fn test_environment_config_environment_variables() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        // Add environment variables
        config.set_environment_variable("NODE_ENV".to_string(), "development".to_string());
        config.set_environment_variable("PORT".to_string(), "3000".to_string());
        assert_eq!(config.environment_variables.len(), 2);
        
        // Update existing variable
        config.set_environment_variable("NODE_ENV".to_string(), "production".to_string());
        assert_eq!(config.environment_variables.len(), 2);
        assert_eq!(config.environment_variables.get("NODE_ENV"), Some(&"production".to_string()));
        
        // Remove variable
        config.remove_environment_variable("PORT");
        assert_eq!(config.environment_variables.len(), 1);
        assert!(!config.environment_variables.contains_key("PORT"));
        
        // Remove non-existent variable
        config.remove_environment_variable("NON_EXISTENT");
        assert_eq!(config.environment_variables.len(), 1);
    }

    #[test]
    fn test_environment_from_config() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        config.description = Some("Test environment description".to_string());
        config.add_dependency(DependencySpec {
            name: "react".to_string(),
            version: Some("18.0.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react".to_string()),
            required: true,
        });
        config.add_script("start".to_string(), "npm start".to_string());
        config.set_environment_variable("NODE_ENV".to_string(), "development".to_string());
        
        let env = Environment::from_config(config.clone());
        
        assert_eq!(env.name, config.name);
        assert_eq!(env.path, config.path);
        assert_eq!(env.project_type, config.project_type);
        assert_eq!(env.dependencies.len(), config.dependencies.len());
        assert_eq!(env.scripts.len(), config.scripts.len());
        assert_eq!(env.environment_variables.len(), config.environment_variables.len());
        assert_eq!(env.description, config.description);
        assert_eq!(env.status, EnvironmentStatus::Inactive);
        assert!(!env.id.is_empty());
        assert!(env.last_activated.is_none());
        assert!(!env.is_active());
    }

    #[test]
    fn test_environment_update_from_config() {
        let temp_dir = tempdir().unwrap();
        let config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        let mut env = Environment::from_config(config);
        let original_id = env.id.clone();
        let original_created_at = env.created_at;
        
        // Create updated config
        let mut updated_config = EnvironmentConfig::new(
            "updated-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::Rust,
        );
        updated_config.description = Some("Updated description".to_string());
        
        std::thread::sleep(std::time::Duration::from_millis(10));
        env.update_from_config(updated_config.clone());
        
        // Check that fields were updated
        assert_eq!(env.name, updated_config.name);
        assert_eq!(env.project_type, updated_config.project_type);
        assert_eq!(env.description, updated_config.description);
        
        // Check that ID and created_at were preserved
        assert_eq!(env.id, original_id);
        assert_eq!(env.created_at, original_created_at);
        
        // Check that updated_at was changed
        assert!(env.updated_at > original_created_at);
    }

    #[test]
    fn test_environment_activation_lifecycle() {
        let temp_dir = tempdir().unwrap();
        let config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        let mut env = Environment::from_config(config);
        let original_updated_at = env.updated_at;
        
        // Initially inactive
        assert!(!env.is_active());
        assert_eq!(env.status, EnvironmentStatus::Inactive);
        assert!(env.last_activated.is_none());
        
        std::thread::sleep(std::time::Duration::from_millis(10));
        
        // Activate environment
        env.activate();
        assert!(env.is_active());
        assert_eq!(env.status, EnvironmentStatus::Active);
        assert!(env.last_activated.is_some());
        assert!(env.updated_at > original_updated_at);
        
        let activation_time = env.last_activated.unwrap();
        let activation_updated_at = env.updated_at;
        
        std::thread::sleep(std::time::Duration::from_millis(10));
        
        // Deactivate environment
        env.deactivate();
        assert!(!env.is_active());
        assert_eq!(env.status, EnvironmentStatus::Inactive);
        assert_eq!(env.last_activated, Some(activation_time)); // Should preserve last activation time
        assert!(env.updated_at > activation_updated_at);
        
        // Test setting custom status
        env.set_status(EnvironmentStatus::Installing);
        assert_eq!(env.status, EnvironmentStatus::Installing);
        assert!(!env.is_active());
        
        env.set_status(EnvironmentStatus::Error("Installation failed".to_string()));
        assert_eq!(env.status, EnvironmentStatus::Error("Installation failed".to_string()));
        assert!(!env.is_active());
    }

    #[test]
    fn test_environment_dependency_validation() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        // Add dependencies with different requirements
        config.add_dependency(DependencySpec {
            name: "react".to_string(),
            version: None, // No version specified
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react".to_string()),
            required: true,
        });
        
        config.add_dependency(DependencySpec {
            name: "typescript".to_string(),
            version: Some("5.0.0".to_string()),
            dependency_type: DependencyType::Development,
            install_command: Some("npm install -D typescript".to_string()),
            required: false,
        });
        
        let env = Environment::from_config(config);
        let validation_result = env.validate_dependencies();
        
        assert!(validation_result.is_valid);
        assert!(validation_result.missing_dependencies.is_empty());
        assert!(validation_result.invalid_paths.is_empty());
        assert_eq!(validation_result.warnings.len(), 1); // Warning for required dependency without version
        assert!(validation_result.errors.is_empty());
        
        // Test with invalid path
        let mut invalid_env = env.clone();
        invalid_env.path = PathBuf::from("/non/existent/path");
        let invalid_result = invalid_env.validate_dependencies();
        
        assert!(!invalid_result.is_valid);
        assert_eq!(invalid_result.invalid_paths.len(), 1);
        assert_eq!(invalid_result.errors.len(), 1);
    }

    #[test]
    fn test_environment_helper_methods() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::NodeJS,
        );
        
        config.add_dependency(DependencySpec {
            name: "react".to_string(),
            version: Some("18.0.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react".to_string()),
            required: true,
        });
        
        config.add_script("build".to_string(), "npm run build".to_string());
        config.set_environment_variable("NODE_ENV".to_string(), "development".to_string());
        
        let env = Environment::from_config(config);
        
        // Test dependency methods
        assert!(env.has_dependency("react"));
        assert!(!env.has_dependency("vue"));
        
        let react_dep = env.get_dependency("react");
        assert!(react_dep.is_some());
        assert_eq!(react_dep.unwrap().version, Some("18.0.0".to_string()));
        
        let non_existent_dep = env.get_dependency("vue");
        assert!(non_existent_dep.is_none());
        
        // Test script methods
        let build_script = env.get_script("build");
        assert!(build_script.is_some());
        assert_eq!(build_script.unwrap(), "npm run build");
        
        let non_existent_script = env.get_script("test");
        assert!(non_existent_script.is_none());
        
        // Test environment variable methods
        let node_env = env.get_environment_variable("NODE_ENV");
        assert!(node_env.is_some());
        assert_eq!(node_env.unwrap(), "development");
        
        let non_existent_var = env.get_environment_variable("PORT");
        assert!(non_existent_var.is_none());
    }

    #[test]
    fn test_environment_serialization() {
        let temp_dir = tempdir().unwrap();
        let mut config = EnvironmentConfig::new(
            "test-env".to_string(),
            temp_dir.path().to_path_buf(),
            ProjectType::Mixed,
        );
        
        config.description = Some("Complex test environment".to_string());
        config.add_dependency(DependencySpec {
            name: "react".to_string(),
            version: Some("18.0.0".to_string()),
            dependency_type: DependencyType::Runtime,
            install_command: Some("npm install react".to_string()),
            required: true,
        });
        config.add_script("build".to_string(), "npm run build".to_string());
        config.set_environment_variable("NODE_ENV".to_string(), "production".to_string());
        
        let mut env = Environment::from_config(config);
        env.activate();
        env.set_status(EnvironmentStatus::Error("Test error".to_string()));
        
        // Test JSON serialization
        let json_str = serde_json::to_string(&env).unwrap();
        let deserialized_env: Environment = serde_json::from_str(&json_str).unwrap();
        
        assert_eq!(env.id, deserialized_env.id);
        assert_eq!(env.name, deserialized_env.name);
        assert_eq!(env.path, deserialized_env.path);
        assert_eq!(env.project_type, deserialized_env.project_type);
        assert_eq!(env.dependencies.len(), deserialized_env.dependencies.len());
        assert_eq!(env.scripts.len(), deserialized_env.scripts.len());
        assert_eq!(env.environment_variables.len(), deserialized_env.environment_variables.len());
        assert_eq!(env.status, deserialized_env.status);
        assert_eq!(env.description, deserialized_env.description);
        
        // Test that timestamps are preserved
        assert_eq!(env.created_at.timestamp(), deserialized_env.created_at.timestamp());
        assert_eq!(env.updated_at.timestamp(), deserialized_env.updated_at.timestamp());
        assert_eq!(
            env.last_activated.map(|t| t.timestamp()),
            deserialized_env.last_activated.map(|t| t.timestamp())
        );
    }

    #[test]
    fn test_validation_result() {
        let result = ValidationResult {
            is_valid: true,
            missing_dependencies: vec!["missing-dep".to_string()],
            invalid_paths: vec!["/invalid/path".to_string()],
            warnings: vec!["Warning message".to_string()],
            errors: vec!["Error message".to_string()],
        };
        
        // Test serialization
        let json_str = serde_json::to_string(&result).unwrap();
        let deserialized: ValidationResult = serde_json::from_str(&json_str).unwrap();
        
        assert_eq!(result.is_valid, deserialized.is_valid);
        assert_eq!(result.missing_dependencies, deserialized.missing_dependencies);
        assert_eq!(result.invalid_paths, deserialized.invalid_paths);
        assert_eq!(result.warnings, deserialized.warnings);
        assert_eq!(result.errors, deserialized.errors);
    }
}