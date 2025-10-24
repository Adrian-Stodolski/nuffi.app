use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use std::path::Path;

use crate::models::error::ConfigError;

pub struct DatabaseMigrations;

impl DatabaseMigrations {
    pub async fn initialize_database(database_url: &str) -> Result<SqlitePool, ConfigError> {
        // Extract the database file path from the URL
        let db_path = database_url.strip_prefix("sqlite://")
            .ok_or_else(|| ConfigError::DatabaseInit("Invalid SQLite URL format".to_string()))?;

        // Create parent directories if they don't exist
        if let Some(parent) = Path::new(db_path).parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create database directory: {}", e)))?;
        }

        // Create database if it doesn't exist
        if !Sqlite::database_exists(database_url).await.unwrap_or(false) {
            Sqlite::create_database(database_url).await
                .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create database: {}", e)))?;
        }

        // Connect to the database
        let pool = SqlitePool::connect(database_url).await
            .map_err(|e| ConfigError::DatabaseInit(format!("Failed to connect to database: {}", e)))?;

        // Run migrations
        Self::run_migrations(&pool).await?;

        Ok(pool)
    }

    pub async fn run_migrations(pool: &SqlitePool) -> Result<(), ConfigError> {
        // Create environments table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS environments (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                path TEXT NOT NULL,
                project_type TEXT NOT NULL,
                dependencies TEXT NOT NULL, -- JSON
                environment_variables TEXT NOT NULL, -- JSON
                scripts TEXT NOT NULL, -- JSON
                ai_settings TEXT NOT NULL, -- JSON
                description TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                last_activated TEXT
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create environments table: {}", e)))?;

        // Create workflows table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS workflows (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                triggers TEXT NOT NULL, -- JSON
                steps TEXT NOT NULL, -- JSON
                environment_id TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                last_executed TEXT,
                execution_count INTEGER NOT NULL DEFAULT 0,
                enabled BOOLEAN NOT NULL DEFAULT 1,
                FOREIGN KEY (environment_id) REFERENCES environments (id) ON DELETE SET NULL
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create workflows table: {}", e)))?;

        // Create workflow_executions table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS workflow_executions (
                id TEXT PRIMARY KEY,
                workflow_id TEXT NOT NULL,
                trigger_id TEXT,
                status TEXT NOT NULL,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                step_results TEXT NOT NULL, -- JSON
                error_message TEXT,
                logs TEXT NOT NULL, -- JSON
                FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create workflow_executions table: {}", e)))?;

        // Create ai_analysis_requests table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS ai_analysis_requests (
                id TEXT PRIMARY KEY,
                path TEXT NOT NULL,
                analysis_type TEXT NOT NULL,
                context TEXT NOT NULL, -- JSON
                model_preferences TEXT NOT NULL, -- JSON
                created_at TEXT NOT NULL
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create ai_analysis_requests table: {}", e)))?;

        // Create ai_analysis_results table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS ai_analysis_results (
                id TEXT PRIMARY KEY,
                request_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                path TEXT NOT NULL,
                model_used TEXT NOT NULL,
                analysis_type TEXT NOT NULL,
                insights TEXT NOT NULL, -- JSON
                suggestions TEXT NOT NULL, -- JSON
                metrics TEXT NOT NULL, -- JSON
                summary TEXT NOT NULL,
                status TEXT NOT NULL,
                error_message TEXT,
                FOREIGN KEY (request_id) REFERENCES ai_analysis_requests (id) ON DELETE CASCADE
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create ai_analysis_results table: {}", e)))?;

        // Create ai_usage_stats table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS ai_usage_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_requests INTEGER NOT NULL DEFAULT 0,
                successful_requests INTEGER NOT NULL DEFAULT 0,
                failed_requests INTEGER NOT NULL DEFAULT 0,
                total_tokens_used INTEGER NOT NULL DEFAULT 0,
                average_response_time_ms REAL NOT NULL DEFAULT 0.0,
                models_used TEXT NOT NULL DEFAULT '{}', -- JSON
                analysis_types TEXT NOT NULL DEFAULT '{}', -- JSON
                updated_at TEXT NOT NULL
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create ai_usage_stats table: {}", e)))?;

        // Create monitoring_data table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS monitoring_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                environment_id TEXT,
                metric_name TEXT NOT NULL,
                metric_value REAL NOT NULL,
                metadata TEXT, -- JSON
                timestamp TEXT NOT NULL,
                FOREIGN KEY (environment_id) REFERENCES environments (id) ON DELETE CASCADE
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create monitoring_data table: {}", e)))?;

        // Create application_logs table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS application_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT NOT NULL,
                message TEXT NOT NULL,
                module TEXT,
                file TEXT,
                line INTEGER,
                timestamp TEXT NOT NULL
            )
            "#,
        )
        .execute(pool)
        .await
        .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create application_logs table: {}", e)))?;

        // Initialize AI usage stats if not exists
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ai_usage_stats")
            .fetch_one(pool)
            .await
            .map_err(|e| ConfigError::DatabaseInit(format!("Failed to check ai_usage_stats: {}", e)))?;

        if count == 0 {
            sqlx::query(
                r#"
                INSERT INTO ai_usage_stats (updated_at) 
                VALUES (datetime('now'))
                "#,
            )
            .execute(pool)
            .await
            .map_err(|e| ConfigError::DatabaseInit(format!("Failed to initialize ai_usage_stats: {}", e)))?;
        }

        // Create indexes for better performance
        Self::create_indexes(pool).await?;

        Ok(())
    }

    async fn create_indexes(pool: &SqlitePool) -> Result<(), ConfigError> {
        let indexes = vec![
            "CREATE INDEX IF NOT EXISTS idx_environments_name ON environments (name)",
            "CREATE INDEX IF NOT EXISTS idx_environments_status ON environments (status)",
            "CREATE INDEX IF NOT EXISTS idx_workflows_environment_id ON workflows (environment_id)",
            "CREATE INDEX IF NOT EXISTS idx_workflows_enabled ON workflows (enabled)",
            "CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions (workflow_id)",
            "CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions (status)",
            "CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_request_id ON ai_analysis_results (request_id)",
            "CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_status ON ai_analysis_results (status)",
            "CREATE INDEX IF NOT EXISTS idx_monitoring_data_environment_id ON monitoring_data (environment_id)",
            "CREATE INDEX IF NOT EXISTS idx_monitoring_data_timestamp ON monitoring_data (timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_application_logs_level ON application_logs (level)",
            "CREATE INDEX IF NOT EXISTS idx_application_logs_timestamp ON application_logs (timestamp)",
        ];

        for index_sql in indexes {
            sqlx::query(index_sql)
                .execute(pool)
                .await
                .map_err(|e| ConfigError::DatabaseInit(format!("Failed to create index: {}", e)))?;
        }

        Ok(())
    }

    pub async fn drop_all_tables(pool: &SqlitePool) -> Result<(), ConfigError> {
        let tables = vec![
            "application_logs",
            "monitoring_data",
            "ai_usage_stats",
            "ai_analysis_results",
            "ai_analysis_requests",
            "workflow_executions",
            "workflows",
            "environments",
        ];

        for table in tables {
            sqlx::query(&format!("DROP TABLE IF EXISTS {}", table))
                .execute(pool)
                .await
                .map_err(|e| ConfigError::DatabaseInit(format!("Failed to drop table {}: {}", table, e)))?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_database_initialization() {
        let temp_dir = tempdir().unwrap();
        let db_path = temp_dir.path().join("test.db");
        let database_url = format!("sqlite://{}", db_path.display());

        let pool = DatabaseMigrations::initialize_database(&database_url).await.unwrap();
        
        // Verify tables exist
        let tables: Vec<String> = sqlx::query_scalar(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        )
        .fetch_all(&pool)
        .await
        .unwrap();

        let expected_tables = vec![
            "ai_analysis_requests",
            "ai_analysis_results", 
            "ai_usage_stats",
            "application_logs",
            "environments",
            "monitoring_data",
            "workflow_executions",
            "workflows",
        ];

        for table in expected_tables {
            assert!(tables.contains(&table.to_string()), "Table {} not found", table);
        }

        pool.close().await;
    }

    #[tokio::test]
    async fn test_drop_all_tables() {
        let temp_dir = tempdir().unwrap();
        let db_path = temp_dir.path().join("test_drop.db");
        let database_url = format!("sqlite://{}", db_path.display());

        let pool = DatabaseMigrations::initialize_database(&database_url).await.unwrap();
        
        // Drop all tables
        DatabaseMigrations::drop_all_tables(&pool).await.unwrap();
        
        // Verify no tables exist
        let tables: Vec<String> = sqlx::query_scalar(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
        .fetch_all(&pool)
        .await
        .unwrap();

        // Filter out sqlite_sequence which is automatically created by SQLite
        let user_tables: Vec<String> = tables.into_iter()
            .filter(|table| table != "sqlite_sequence")
            .collect();
        assert!(user_tables.is_empty(), "User tables still exist after drop: {:?}", user_tables);

        pool.close().await;
    }
}