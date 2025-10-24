use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use chrono::{DateTime, Utc};

use super::error::ConfigError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub connection_timeout_seconds: u64,
    pub enable_migrations: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIProviderConfig {
    pub name: String,
    pub api_key: Option<String>,
    pub api_url: Option<String>,
    pub model: String,
    pub max_tokens: Option<u32>,
    pub temperature: Option<f32>,
    pub timeout_seconds: u64,
    pub rate_limit_per_minute: Option<u32>,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    pub level: String,
    pub file_path: Option<PathBuf>,
    pub max_file_size_mb: u64,
    pub max_files: u32,
    pub enable_console: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitoringConfig {
    pub enabled: bool,
    pub collection_interval_seconds: u64,
    pub retention_days: u32,
    pub metrics_to_collect: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowConfig {
    pub max_concurrent_executions: u32,
    pub default_timeout_seconds: u64,
    pub enable_auto_retry: bool,
    pub max_retry_attempts: u32,
    pub retry_delay_seconds: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UIConfig {
    pub theme: String,
    pub auto_save: bool,
    pub auto_save_interval_seconds: u64,
    pub show_notifications: bool,
    pub default_view: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub version: String,
    pub data_directory: PathBuf,
    pub database: DatabaseConfig,
    pub ai_providers: Vec<AIProviderConfig>,
    pub logging: LoggingConfig,
    pub monitoring: MonitoringConfig,
    pub workflow: WorkflowConfig,
    pub ui: UIConfig,
    pub custom_settings: HashMap<String, serde_json::Value>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Default for DatabaseConfig {
    fn default() -> Self {
        Self {
            url: "sqlite://data/app.db".to_string(),
            max_connections: 10,
            connection_timeout_seconds: 30,
            enable_migrations: true,
        }
    }
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            level: "info".to_string(),
            file_path: Some(PathBuf::from("logs/app.log")),
            max_file_size_mb: 10,
            max_files: 5,
            enable_console: true,
        }
    }
}

impl Default for MonitoringConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            collection_interval_seconds: 60,
            retention_days: 30,
            metrics_to_collect: vec![
                "cpu_usage".to_string(),
                "memory_usage".to_string(),
                "disk_usage".to_string(),
                "build_times".to_string(),
                "test_results".to_string(),
            ],
        }
    }
}

impl Default for WorkflowConfig {
    fn default() -> Self {
        Self {
            max_concurrent_executions: 5,
            default_timeout_seconds: 300,
            enable_auto_retry: true,
            max_retry_attempts: 3,
            retry_delay_seconds: 5,
        }
    }
}

impl Default for UIConfig {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            auto_save: true,
            auto_save_interval_seconds: 30,
            show_notifications: true,
            default_view: "dashboard".to_string(),
        }
    }
}

impl Default for AppConfig {
    fn default() -> Self {
        let now = Utc::now();
        Self {
            version: "0.1.0".to_string(),
            data_directory: PathBuf::from("data"),
            database: DatabaseConfig::default(),
            ai_providers: Vec::new(),
            logging: LoggingConfig::default(),
            monitoring: MonitoringConfig::default(),
            workflow: WorkflowConfig::default(),
            ui: UIConfig::default(),
            custom_settings: HashMap::new(),
            created_at: now,
            updated_at: now,
        }
    }
}

impl AIProviderConfig {
    pub fn new(name: String, model: String) -> Self {
        Self {
            name,
            api_key: None,
            api_url: None,
            model,
            max_tokens: Some(4000),
            temperature: Some(0.3),
            timeout_seconds: 30,
            rate_limit_per_minute: None,
            enabled: true,
        }
    }

    pub fn openai(api_key: String) -> Self {
        Self {
            name: "openai".to_string(),
            api_key: Some(api_key),
            api_url: Some("https://api.openai.com/v1".to_string()),
            model: "gpt-4".to_string(),
            max_tokens: Some(4000),
            temperature: Some(0.3),
            timeout_seconds: 30,
            rate_limit_per_minute: Some(60),
            enabled: true,
        }
    }

    pub fn anthropic(api_key: String) -> Self {
        Self {
            name: "anthropic".to_string(),
            api_key: Some(api_key),
            api_url: Some("https://api.anthropic.com".to_string()),
            model: "claude-3-sonnet-20240229".to_string(),
            max_tokens: Some(4000),
            temperature: Some(0.3),
            timeout_seconds: 30,
            rate_limit_per_minute: Some(60),
            enabled: true,
        }
    }

    pub fn local(name: String, api_url: String, model: String) -> Self {
        Self {
            name,
            api_key: None,
            api_url: Some(api_url),
            model,
            max_tokens: Some(2000),
            temperature: Some(0.3),
            timeout_seconds: 60,
            rate_limit_per_minute: None,
            enabled: true,
        }
    }

    pub fn validate(&self) -> Result<(), ConfigError> {
        if self.name.trim().is_empty() {
            return Err(ConfigError::ValidationFailed("AI provider name cannot be empty".to_string()));
        }

        if self.model.trim().is_empty() {
            return Err(ConfigError::ValidationFailed("AI provider model cannot be empty".to_string()));
        }

        if let Some(temp) = self.temperature {
            if temp < 0.0 || temp > 2.0 {
                return Err(ConfigError::ValidationFailed("Temperature must be between 0.0 and 2.0".to_string()));
            }
        }

        if let Some(max_tokens) = self.max_tokens {
            if max_tokens == 0 {
                return Err(ConfigError::ValidationFailed("Max tokens must be greater than 0".to_string()));
            }
        }

        if self.timeout_seconds == 0 {
            return Err(ConfigError::ValidationFailed("Timeout must be greater than 0".to_string()));
        }

        Ok(())
    }

    pub fn is_configured(&self) -> bool {
        self.enabled && !self.model.is_empty() && 
        (self.api_key.is_some() || self.api_url.as_ref().map_or(false, |url| url.contains("localhost") || url.contains("127.0.0.1")))
    }
}

impl AppConfig {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn load_from_file(path: &PathBuf) -> Result<Self, ConfigError> {
        if !path.exists() {
            return Err(ConfigError::FileNotFound(path.to_string_lossy().to_string()));
        }

        let content = std::fs::read_to_string(path)
            .map_err(|e| ConfigError::InvalidFormat(format!("Failed to read config file: {}", e)))?;

        let config: AppConfig = toml::from_str(&content)
            .map_err(|e| ConfigError::InvalidFormat(format!("Failed to parse config file: {}", e)))?;

        config.validate()?;
        Ok(config)
    }

    pub fn save_to_file(&self, path: &PathBuf) -> Result<(), ConfigError> {
        self.validate()?;

        // Create parent directories if they don't exist
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| ConfigError::InvalidFormat(format!("Failed to create config directory: {}", e)))?;
        }

        let content = toml::to_string_pretty(self)
            .map_err(|e| ConfigError::InvalidFormat(format!("Failed to serialize config: {}", e)))?;

        std::fs::write(path, content)
            .map_err(|e| ConfigError::InvalidFormat(format!("Failed to write config file: {}", e)))?;

        Ok(())
    }

    pub fn validate(&self) -> Result<(), ConfigError> {
        // Validate version format
        if self.version.trim().is_empty() {
            return Err(ConfigError::ValidationFailed("Version cannot be empty".to_string()));
        }

        // Validate data directory
        if self.data_directory.to_string_lossy().trim().is_empty() {
            return Err(ConfigError::ValidationFailed("Data directory cannot be empty".to_string()));
        }

        // Validate database config
        if self.database.url.trim().is_empty() {
            return Err(ConfigError::ValidationFailed("Database URL cannot be empty".to_string()));
        }

        if self.database.max_connections == 0 {
            return Err(ConfigError::ValidationFailed("Database max connections must be greater than 0".to_string()));
        }

        // Validate AI providers
        for provider in &self.ai_providers {
            provider.validate()?;
        }

        // Validate logging config
        if !["trace", "debug", "info", "warn", "error"].contains(&self.logging.level.as_str()) {
            return Err(ConfigError::ValidationFailed("Invalid logging level".to_string()));
        }

        // Validate monitoring config
        if self.monitoring.collection_interval_seconds == 0 {
            return Err(ConfigError::ValidationFailed("Monitoring collection interval must be greater than 0".to_string()));
        }

        // Validate workflow config
        if self.workflow.max_concurrent_executions == 0 {
            return Err(ConfigError::ValidationFailed("Max concurrent executions must be greater than 0".to_string()));
        }

        // Validate UI config
        if !["light", "dark", "auto"].contains(&self.ui.theme.as_str()) {
            return Err(ConfigError::ValidationFailed("Invalid UI theme".to_string()));
        }

        Ok(())
    }

    pub fn add_ai_provider(&mut self, provider: AIProviderConfig) -> Result<(), ConfigError> {
        provider.validate()?;
        
        // Remove existing provider with same name
        self.ai_providers.retain(|p| p.name != provider.name);
        self.ai_providers.push(provider);
        self.updated_at = Utc::now();
        
        Ok(())
    }

    pub fn remove_ai_provider(&mut self, name: &str) {
        self.ai_providers.retain(|p| p.name != name);
        self.updated_at = Utc::now();
    }

    pub fn get_ai_provider(&self, name: &str) -> Option<&AIProviderConfig> {
        self.ai_providers.iter().find(|p| p.name == name)
    }

    pub fn get_ai_provider_mut(&mut self, name: &str) -> Option<&mut AIProviderConfig> {
        self.ai_providers.iter_mut().find(|p| p.name == name)
    }

    pub fn get_enabled_ai_providers(&self) -> Vec<&AIProviderConfig> {
        self.ai_providers.iter().filter(|p| p.enabled && p.is_configured()).collect()
    }

    pub fn set_custom_setting(&mut self, key: String, value: serde_json::Value) {
        self.custom_settings.insert(key, value);
        self.updated_at = Utc::now();
    }

    pub fn get_custom_setting(&self, key: &str) -> Option<&serde_json::Value> {
        self.custom_settings.get(key)
    }

    pub fn remove_custom_setting(&mut self, key: &str) {
        self.custom_settings.remove(key);
        self.updated_at = Utc::now();
    }

    pub fn update_database_url(&mut self, url: String) {
        self.database.url = url;
        self.updated_at = Utc::now();
    }

    pub fn set_data_directory(&mut self, path: PathBuf) {
        self.data_directory = path;
        self.updated_at = Utc::now();
    }

    pub fn enable_monitoring(&mut self) {
        self.monitoring.enabled = true;
        self.updated_at = Utc::now();
    }

    pub fn disable_monitoring(&mut self) {
        self.monitoring.enabled = false;
        self.updated_at = Utc::now();
    }

    pub fn set_log_level(&mut self, level: String) -> Result<(), ConfigError> {
        if !["trace", "debug", "info", "warn", "error"].contains(&level.as_str()) {
            return Err(ConfigError::ValidationFailed("Invalid logging level".to_string()));
        }
        self.logging.level = level;
        self.updated_at = Utc::now();
        Ok(())
    }

    pub fn set_ui_theme(&mut self, theme: String) -> Result<(), ConfigError> {
        if !["light", "dark", "auto"].contains(&theme.as_str()) {
            return Err(ConfigError::ValidationFailed("Invalid UI theme".to_string()));
        }
        self.ui.theme = theme;
        self.updated_at = Utc::now();
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use tempfile::tempdir;

    #[test]
    fn test_app_config_default() {
        let config = AppConfig::default();
        assert_eq!(config.version, "0.1.0");
        assert_eq!(config.database.url, "sqlite://data/app.db");
        assert_eq!(config.logging.level, "info");
        assert!(config.monitoring.enabled);
        assert_eq!(config.ui.theme, "dark");
        assert!(config.ai_providers.is_empty());
        assert!(config.custom_settings.is_empty());
    }

    #[test]
    fn test_database_config_default() {
        let db_config = DatabaseConfig::default();
        assert_eq!(db_config.url, "sqlite://data/app.db");
        assert_eq!(db_config.max_connections, 10);
        assert_eq!(db_config.connection_timeout_seconds, 30);
        assert!(db_config.enable_migrations);
    }

    #[test]
    fn test_logging_config_default() {
        let logging_config = LoggingConfig::default();
        assert_eq!(logging_config.level, "info");
        assert_eq!(logging_config.file_path, Some(PathBuf::from("logs/app.log")));
        assert_eq!(logging_config.max_file_size_mb, 10);
        assert_eq!(logging_config.max_files, 5);
        assert!(logging_config.enable_console);
    }

    #[test]
    fn test_monitoring_config_default() {
        let monitoring_config = MonitoringConfig::default();
        assert!(monitoring_config.enabled);
        assert_eq!(monitoring_config.collection_interval_seconds, 60);
        assert_eq!(monitoring_config.retention_days, 30);
        assert_eq!(monitoring_config.metrics_to_collect.len(), 5);
        assert!(monitoring_config.metrics_to_collect.contains(&"cpu_usage".to_string()));
    }

    #[test]
    fn test_workflow_config_default() {
        let workflow_config = WorkflowConfig::default();
        assert_eq!(workflow_config.max_concurrent_executions, 5);
        assert_eq!(workflow_config.default_timeout_seconds, 300);
        assert!(workflow_config.enable_auto_retry);
        assert_eq!(workflow_config.max_retry_attempts, 3);
        assert_eq!(workflow_config.retry_delay_seconds, 5);
    }

    #[test]
    fn test_ui_config_default() {
        let ui_config = UIConfig::default();
        assert_eq!(ui_config.theme, "dark");
        assert!(ui_config.auto_save);
        assert_eq!(ui_config.auto_save_interval_seconds, 30);
        assert!(ui_config.show_notifications);
        assert_eq!(ui_config.default_view, "dashboard");
    }

    #[test]
    fn test_ai_provider_config_validation() {
        let provider = AIProviderConfig::new("test".to_string(), "gpt-4".to_string());
        assert!(provider.validate().is_ok());

        // Test empty name
        let mut invalid_provider = provider.clone();
        invalid_provider.name = "".to_string();
        assert!(invalid_provider.validate().is_err());

        // Test empty model
        let mut invalid_model = provider.clone();
        invalid_model.model = "".to_string();
        assert!(invalid_model.validate().is_err());

        // Test invalid temperature
        let mut invalid_temp = provider.clone();
        invalid_temp.temperature = Some(3.0);
        assert!(invalid_temp.validate().is_err());

        // Test negative temperature
        let mut negative_temp = provider.clone();
        negative_temp.temperature = Some(-0.1);
        assert!(negative_temp.validate().is_err());

        // Test zero max tokens
        let mut zero_tokens = provider.clone();
        zero_tokens.max_tokens = Some(0);
        assert!(zero_tokens.validate().is_err());

        // Test zero timeout
        let mut zero_timeout = provider.clone();
        zero_timeout.timeout_seconds = 0;
        assert!(zero_timeout.validate().is_err());
    }

    #[test]
    fn test_ai_provider_config_is_configured() {
        // Test with API key
        let provider_with_key = AIProviderConfig::openai("test-key".to_string());
        assert!(provider_with_key.is_configured());

        // Test with local URL
        let provider_local = AIProviderConfig::local(
            "local".to_string(),
            "http://localhost:8080".to_string(),
            "local-model".to_string(),
        );
        assert!(provider_local.is_configured());

        // Test disabled provider
        let mut disabled_provider = provider_with_key.clone();
        disabled_provider.enabled = false;
        assert!(!disabled_provider.is_configured());

        // Test provider without API key or local URL
        let mut unconfigured = provider_with_key.clone();
        unconfigured.api_key = None;
        unconfigured.api_url = Some("https://api.example.com".to_string());
        assert!(!unconfigured.is_configured());
    }

    #[test]
    fn test_openai_provider_config() {
        let provider = AIProviderConfig::openai("test-key".to_string());
        assert_eq!(provider.name, "openai");
        assert_eq!(provider.model, "gpt-4");
        assert_eq!(provider.api_key, Some("test-key".to_string()));
        assert_eq!(provider.api_url, Some("https://api.openai.com/v1".to_string()));
        assert_eq!(provider.rate_limit_per_minute, Some(60));
        assert!(provider.validate().is_ok());
        assert!(provider.is_configured());
    }

    #[test]
    fn test_anthropic_provider_config() {
        let provider = AIProviderConfig::anthropic("test-key".to_string());
        assert_eq!(provider.name, "anthropic");
        assert_eq!(provider.model, "claude-3-sonnet-20240229");
        assert_eq!(provider.api_key, Some("test-key".to_string()));
        assert_eq!(provider.api_url, Some("https://api.anthropic.com".to_string()));
        assert!(provider.validate().is_ok());
        assert!(provider.is_configured());
    }

    #[test]
    fn test_local_provider_config() {
        let provider = AIProviderConfig::local(
            "ollama".to_string(),
            "http://localhost:11434".to_string(),
            "llama2".to_string(),
        );
        assert_eq!(provider.name, "ollama");
        assert_eq!(provider.model, "llama2");
        assert_eq!(provider.api_key, None);
        assert_eq!(provider.api_url, Some("http://localhost:11434".to_string()));
        assert_eq!(provider.max_tokens, Some(2000));
        assert_eq!(provider.timeout_seconds, 60);
        assert_eq!(provider.rate_limit_per_minute, None);
        assert!(provider.validate().is_ok());
        assert!(provider.is_configured());
    }

    #[test]
    fn test_app_config_ai_provider_management() {
        let mut config = AppConfig::default();
        
        let provider = AIProviderConfig::openai("test-key".to_string());
        let provider_name = provider.name.clone();
        config.add_ai_provider(provider).unwrap();
        
        assert_eq!(config.ai_providers.len(), 1);
        assert!(config.get_ai_provider(&provider_name).is_some());
        
        // Test replacing existing provider
        let new_provider = AIProviderConfig::openai("new-key".to_string());
        config.add_ai_provider(new_provider).unwrap();
        assert_eq!(config.ai_providers.len(), 1); // Should replace, not add
        assert_eq!(config.get_ai_provider(&provider_name).unwrap().api_key, Some("new-key".to_string()));
        
        // Test getting enabled providers
        let enabled_providers = config.get_enabled_ai_providers();
        assert_eq!(enabled_providers.len(), 1);
        
        // Test mutable access
        if let Some(provider_mut) = config.get_ai_provider_mut(&provider_name) {
            provider_mut.enabled = false;
        }
        let enabled_providers = config.get_enabled_ai_providers();
        assert_eq!(enabled_providers.len(), 0);
        
        config.remove_ai_provider(&provider_name);
        assert_eq!(config.ai_providers.len(), 0);
        assert!(config.get_ai_provider(&provider_name).is_none());
    }

    #[test]
    fn test_config_file_operations() {
        let mut config = AppConfig::default();
        config.add_ai_provider(AIProviderConfig::openai("test-key".to_string())).unwrap();
        config.set_custom_setting("test".to_string(), serde_json::json!({"value": 42}));
        
        let temp_dir = tempdir().unwrap();
        let config_path = temp_dir.path().join("test_config.toml");
        
        // Save config
        config.save_to_file(&config_path).unwrap();
        assert!(config_path.exists());
        
        // Load config
        let loaded_config = AppConfig::load_from_file(&config_path).unwrap();
        assert_eq!(loaded_config.version, config.version);
        assert_eq!(loaded_config.database.url, config.database.url);
        assert_eq!(loaded_config.ai_providers.len(), 1);
        assert_eq!(loaded_config.custom_settings.len(), 1);
        
        // Test loading non-existent file
        let non_existent = temp_dir.path().join("non_existent.toml");
        let result = AppConfig::load_from_file(&non_existent);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), ConfigError::FileNotFound(_)));
    }

    #[test]
    fn test_config_validation() {
        let mut config = AppConfig::default();
        assert!(config.validate().is_ok());
        
        // Test invalid version
        config.version = "".to_string();
        assert!(config.validate().is_err());
        
        // Reset and test invalid data directory
        config = AppConfig::default();
        config.data_directory = PathBuf::from("");
        assert!(config.validate().is_err());
        
        // Reset and test invalid database URL
        config = AppConfig::default();
        config.database.url = "".to_string();
        assert!(config.validate().is_err());
        
        // Reset and test invalid database max connections
        config = AppConfig::default();
        config.database.max_connections = 0;
        assert!(config.validate().is_err());
        
        // Reset and test invalid logging level
        config = AppConfig::default();
        config.logging.level = "invalid".to_string();
        assert!(config.validate().is_err());
        
        // Reset and test invalid monitoring interval
        config = AppConfig::default();
        config.monitoring.collection_interval_seconds = 0;
        assert!(config.validate().is_err());
        
        // Reset and test invalid workflow config
        config = AppConfig::default();
        config.workflow.max_concurrent_executions = 0;
        assert!(config.validate().is_err());
        
        // Reset and test invalid UI theme
        config = AppConfig::default();
        config.ui.theme = "invalid".to_string();
        assert!(config.validate().is_err());
        
        // Test with invalid AI provider
        config = AppConfig::default();
        let invalid_provider = AIProviderConfig {
            name: "".to_string(),
            api_key: None,
            api_url: None,
            model: "gpt-4".to_string(),
            max_tokens: Some(4000),
            temperature: Some(0.3),
            timeout_seconds: 30,
            rate_limit_per_minute: None,
            enabled: true,
        };
        config.ai_providers.push(invalid_provider);
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_custom_settings() {
        let mut config = AppConfig::default();
        
        let value = serde_json::json!({"test": "value", "number": 42});
        config.set_custom_setting("test_key".to_string(), value.clone());
        
        assert_eq!(config.get_custom_setting("test_key"), Some(&value));
        assert_eq!(config.custom_settings.len(), 1);
        
        // Test overwriting existing setting
        let new_value = serde_json::json!("simple_string");
        config.set_custom_setting("test_key".to_string(), new_value.clone());
        assert_eq!(config.get_custom_setting("test_key"), Some(&new_value));
        assert_eq!(config.custom_settings.len(), 1);
        
        config.remove_custom_setting("test_key");
        assert_eq!(config.get_custom_setting("test_key"), None);
        assert_eq!(config.custom_settings.len(), 0);
        
        // Test removing non-existent setting
        config.remove_custom_setting("non_existent");
        assert_eq!(config.custom_settings.len(), 0);
    }

    #[test]
    fn test_config_utility_methods() {
        let mut config = AppConfig::default();
        
        // Test database URL update
        config.update_database_url("sqlite://new_path.db".to_string());
        assert_eq!(config.database.url, "sqlite://new_path.db");
        
        // Test data directory update
        let new_path = PathBuf::from("/new/data/path");
        config.set_data_directory(new_path.clone());
        assert_eq!(config.data_directory, new_path);
        
        // Test monitoring enable/disable
        config.disable_monitoring();
        assert!(!config.monitoring.enabled);
        
        config.enable_monitoring();
        assert!(config.monitoring.enabled);
        
        // Test log level setting
        config.set_log_level("debug".to_string()).unwrap();
        assert_eq!(config.logging.level, "debug");
        
        // Test invalid log level
        let result = config.set_log_level("invalid".to_string());
        assert!(result.is_err());
        
        // Test UI theme setting
        config.set_ui_theme("light".to_string()).unwrap();
        assert_eq!(config.ui.theme, "light");
        
        // Test invalid UI theme
        let result = config.set_ui_theme("invalid".to_string());
        assert!(result.is_err());
    }

    #[test]
    fn test_config_serialization_deserialization() {
        let mut config = AppConfig::default();
        config.add_ai_provider(AIProviderConfig::openai("test-key".to_string())).unwrap();
        config.add_ai_provider(AIProviderConfig::anthropic("anthropic-key".to_string())).unwrap();
        config.set_custom_setting("feature_flags".to_string(), serde_json::json!({
            "experimental_features": true,
            "debug_mode": false
        }));
        
        // Test JSON serialization
        let json_str = serde_json::to_string(&config).unwrap();
        let deserialized_config: AppConfig = serde_json::from_str(&json_str).unwrap();
        
        assert_eq!(deserialized_config.version, config.version);
        assert_eq!(deserialized_config.ai_providers.len(), config.ai_providers.len());
        assert_eq!(deserialized_config.custom_settings.len(), config.custom_settings.len());
        
        // Test TOML serialization
        let toml_str = toml::to_string(&config).unwrap();
        let deserialized_toml: AppConfig = toml::from_str(&toml_str).unwrap();
        
        assert_eq!(deserialized_toml.version, config.version);
        assert_eq!(deserialized_toml.ai_providers.len(), config.ai_providers.len());
    }

    #[test]
    fn test_config_timestamps() {
        let config1 = AppConfig::default();
        std::thread::sleep(std::time::Duration::from_millis(10));
        let config2 = AppConfig::default();
        
        // Both should have the same created_at and updated_at initially
        assert_eq!(config1.created_at, config1.updated_at);
        assert_eq!(config2.created_at, config2.updated_at);
        
        // But different configs should have different timestamps
        assert!(config2.created_at > config1.created_at);
        
        // Test that operations update the timestamp
        let mut config = AppConfig::default();
        let original_updated = config.updated_at;
        
        std::thread::sleep(std::time::Duration::from_millis(10));
        config.add_ai_provider(AIProviderConfig::openai("key".to_string())).unwrap();
        assert!(config.updated_at > original_updated);
    }
}