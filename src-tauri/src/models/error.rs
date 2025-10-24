use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Environment error: {0}")]
    Environment(#[from] EnvError),
    #[error("AI analysis error: {0}")]
    AI(#[from] AIError),
    #[error("Workflow error: {0}")]
    Workflow(#[from] WorkflowError),
    #[error("Configuration error: {0}")]
    Config(#[from] ConfigError),
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    #[error("Date parsing error: {0}")]
    DateParse(#[from] chrono::ParseError),
}

#[derive(Debug, Error)]
pub enum EnvError {
    #[error("Environment not found: {0}")]
    NotFound(String),
    #[error("Environment already exists: {0}")]
    AlreadyExists(String),
    #[error("Invalid environment configuration: {0}")]
    InvalidConfig(String),
    #[error("Dependency error: {0}")]
    Dependency(String),
    #[error("Path error: {0}")]
    Path(String),
}

#[derive(Debug, Error)]
pub enum AIError {
    #[error("AI provider not found: {0}")]
    ProviderNotFound(String),
    #[error("AI analysis failed: {0}")]
    AnalysisFailed(String),
    #[error("Invalid AI model: {0}")]
    InvalidModel(String),
    #[error("API error: {0}")]
    ApiError(String),
    #[error("Rate limit exceeded")]
    RateLimitExceeded,
}

#[derive(Debug, Error)]
pub enum WorkflowError {
    #[error("Workflow not found: {0}")]
    NotFound(String),
    #[error("Workflow execution failed: {0}")]
    ExecutionFailed(String),
    #[error("Invalid workflow step: {0}")]
    InvalidStep(String),
    #[error("Workflow validation failed: {0}")]
    ValidationFailed(String),
}

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("Configuration file not found: {0}")]
    FileNotFound(String),
    #[error("Invalid configuration format: {0}")]
    InvalidFormat(String),
    #[error("Configuration validation failed: {0}")]
    ValidationFailed(String),
    #[error("Database initialization failed: {0}")]
    DatabaseInit(String),
}