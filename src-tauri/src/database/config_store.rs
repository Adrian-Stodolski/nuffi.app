use sqlx::{SqlitePool, Row};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde_json;

use crate::models::{
    Environment, EnvironmentConfig, EnvironmentStatus,
    Workflow, WorkflowExecution, WorkflowStatus,
    AnalysisRequest, AnalysisResult, AnalysisStatus, AIUsageStats,
    ConfigError, CoreError,
};
use crate::database::DatabaseMigrations;

#[derive(Clone)]
pub struct ConfigStore {
    pool: SqlitePool,
}

impl ConfigStore {
    pub async fn new(database_url: &str) -> Result<Self, ConfigError> {
        let pool = DatabaseMigrations::initialize_database(database_url).await?;
        Ok(Self { pool })
    }

    pub async fn close(&self) {
        self.pool.close().await;
    }

    // Environment CRUD operations
    pub async fn create_environment(&self, config: EnvironmentConfig) -> Result<Environment, CoreError> {
        config.validate()?;
        
        let env = Environment::from_config(config);
        
        // Check if environment with same name already exists
        let existing = self.get_environment_by_name(&env.name).await;
        if existing.is_ok() {
            return Err(CoreError::Environment(crate::models::EnvError::AlreadyExists(env.name)));
        }

        let dependencies_json = serde_json::to_string(&env.dependencies)?;
        let env_vars_json = serde_json::to_string(&env.environment_variables)?;
        let scripts_json = serde_json::to_string(&env.scripts)?;
        let ai_settings_json = serde_json::to_string(&env.ai_settings)?;
        let status_json = serde_json::to_string(&env.status)?;

        sqlx::query(
            r#"
            INSERT INTO environments (
                id, name, path, project_type, dependencies, environment_variables,
                scripts, ai_settings, description, status, created_at, updated_at, last_activated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&env.id)
        .bind(&env.name)
        .bind(env.path.to_string_lossy().as_ref())
        .bind(serde_json::to_string(&env.project_type)?)
        .bind(&dependencies_json)
        .bind(&env_vars_json)
        .bind(&scripts_json)
        .bind(&ai_settings_json)
        .bind(&env.description)
        .bind(&status_json)
        .bind(env.created_at.to_rfc3339())
        .bind(env.updated_at.to_rfc3339())
        .bind(env.last_activated.map(|dt| dt.to_rfc3339()))
        .execute(&self.pool)
        .await?;

        Ok(env)
    }

    pub async fn get_environment(&self, id: &str) -> Result<Environment, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM environments WHERE id = ?"
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|_| CoreError::Environment(crate::models::EnvError::NotFound(id.to_string())))?;

        self.environment_from_row(row).await
    }

    pub async fn get_environment_by_name(&self, name: &str) -> Result<Environment, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM environments WHERE name = ?"
        )
        .bind(name)
        .fetch_one(&self.pool)
        .await
        .map_err(|_| CoreError::Environment(crate::models::EnvError::NotFound(name.to_string())))?;

        self.environment_from_row(row).await
    }

    pub async fn list_environments(&self) -> Result<Vec<Environment>, CoreError> {
        let rows = sqlx::query(
            "SELECT * FROM environments ORDER BY name"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut environments = Vec::new();
        for row in rows {
            environments.push(self.environment_from_row(row).await?);
        }

        Ok(environments)
    }

    pub async fn update_environment(&self, env: &Environment) -> Result<(), CoreError> {
        let dependencies_json = serde_json::to_string(&env.dependencies)?;
        let env_vars_json = serde_json::to_string(&env.environment_variables)?;
        let scripts_json = serde_json::to_string(&env.scripts)?;
        let ai_settings_json = serde_json::to_string(&env.ai_settings)?;
        let status_json = serde_json::to_string(&env.status)?;

        sqlx::query(
            r#"
            UPDATE environments SET
                name = ?, path = ?, project_type = ?, dependencies = ?,
                environment_variables = ?, scripts = ?, ai_settings = ?,
                description = ?, status = ?, updated_at = ?, last_activated = ?
            WHERE id = ?
            "#,
        )
        .bind(&env.name)
        .bind(env.path.to_string_lossy().as_ref())
        .bind(serde_json::to_string(&env.project_type)?)
        .bind(&dependencies_json)
        .bind(&env_vars_json)
        .bind(&scripts_json)
        .bind(&ai_settings_json)
        .bind(&env.description)
        .bind(&status_json)
        .bind(env.updated_at.to_rfc3339())
        .bind(env.last_activated.map(|dt| dt.to_rfc3339()))
        .bind(&env.id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn delete_environment(&self, id: &str) -> Result<(), CoreError> {
        let result = sqlx::query(
            "DELETE FROM environments WHERE id = ?"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(CoreError::Environment(crate::models::EnvError::NotFound(id.to_string())));
        }

        Ok(())
    }

    pub async fn get_active_environment(&self) -> Result<Option<Environment>, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM environments WHERE json_extract(status, '$') = 'Active' LIMIT 1"
        )
        .fetch_optional(&self.pool)
        .await?;

        match row {
            Some(row) => Ok(Some(self.environment_from_row(row).await?)),
            None => Ok(None),
        }
    }

    // Workflow CRUD operations
    pub async fn create_workflow(&self, workflow: &Workflow) -> Result<(), CoreError> {
        workflow.validate()?;

        let triggers_json = serde_json::to_string(&workflow.triggers)?;
        let steps_json = serde_json::to_string(&workflow.steps)?;
        let status_json = serde_json::to_string(&workflow.status)?;

        sqlx::query(
            r#"
            INSERT INTO workflows (
                id, name, description, triggers, steps, environment_id,
                status, created_at, updated_at, last_executed, execution_count, enabled
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&workflow.id)
        .bind(&workflow.name)
        .bind(&workflow.description)
        .bind(&triggers_json)
        .bind(&steps_json)
        .bind(&workflow.environment_id)
        .bind(&status_json)
        .bind(workflow.created_at.to_rfc3339())
        .bind(workflow.updated_at.to_rfc3339())
        .bind(workflow.last_executed.map(|dt| dt.to_rfc3339()))
        .bind(workflow.execution_count as i64)
        .bind(workflow.enabled)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_workflow(&self, id: &str) -> Result<Workflow, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM workflows WHERE id = ?"
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|_| CoreError::Workflow(crate::models::WorkflowError::NotFound(id.to_string())))?;

        self.workflow_from_row(row).await
    }

    pub async fn list_workflows(&self) -> Result<Vec<Workflow>, CoreError> {
        let rows = sqlx::query(
            "SELECT * FROM workflows ORDER BY name"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut workflows = Vec::new();
        for row in rows {
            workflows.push(self.workflow_from_row(row).await?);
        }

        Ok(workflows)
    }

    pub async fn list_workflows_for_environment(&self, environment_id: &str) -> Result<Vec<Workflow>, CoreError> {
        let rows = sqlx::query(
            "SELECT * FROM workflows WHERE environment_id = ? ORDER BY name"
        )
        .bind(environment_id)
        .fetch_all(&self.pool)
        .await?;

        let mut workflows = Vec::new();
        for row in rows {
            workflows.push(self.workflow_from_row(row).await?);
        }

        Ok(workflows)
    }

    pub async fn update_workflow(&self, workflow: &Workflow) -> Result<(), CoreError> {
        workflow.validate()?;

        let triggers_json = serde_json::to_string(&workflow.triggers)?;
        let steps_json = serde_json::to_string(&workflow.steps)?;
        let status_json = serde_json::to_string(&workflow.status)?;

        sqlx::query(
            r#"
            UPDATE workflows SET
                name = ?, description = ?, triggers = ?, steps = ?,
                environment_id = ?, status = ?, updated_at = ?,
                last_executed = ?, execution_count = ?, enabled = ?
            WHERE id = ?
            "#,
        )
        .bind(&workflow.name)
        .bind(&workflow.description)
        .bind(&triggers_json)
        .bind(&steps_json)
        .bind(&workflow.environment_id)
        .bind(&status_json)
        .bind(workflow.updated_at.to_rfc3339())
        .bind(workflow.last_executed.map(|dt| dt.to_rfc3339()))
        .bind(workflow.execution_count as i64)
        .bind(workflow.enabled)
        .bind(&workflow.id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn delete_workflow(&self, id: &str) -> Result<(), CoreError> {
        let result = sqlx::query(
            "DELETE FROM workflows WHERE id = ?"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(CoreError::Workflow(crate::models::WorkflowError::NotFound(id.to_string())));
        }

        Ok(())
    }

    // Workflow execution operations
    pub async fn create_workflow_execution(&self, execution: &WorkflowExecution) -> Result<(), CoreError> {
        let step_results_json = serde_json::to_string(&execution.step_results)?;
        let logs_json = serde_json::to_string(&execution.logs)?;
        let status_json = serde_json::to_string(&execution.status)?;

        sqlx::query(
            r#"
            INSERT INTO workflow_executions (
                id, workflow_id, trigger_id, status, started_at,
                completed_at, step_results, error_message, logs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&execution.id)
        .bind(&execution.workflow_id)
        .bind(&execution.trigger_id)
        .bind(&status_json)
        .bind(execution.started_at.to_rfc3339())
        .bind(execution.completed_at.map(|dt| dt.to_rfc3339()))
        .bind(&step_results_json)
        .bind(&execution.error_message)
        .bind(&logs_json)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_workflow_execution(&self, id: &str) -> Result<WorkflowExecution, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM workflow_executions WHERE id = ?"
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|_| CoreError::Workflow(crate::models::WorkflowError::NotFound(id.to_string())))?;

        self.workflow_execution_from_row(row).await
    }

    pub async fn list_workflow_executions(&self, workflow_id: &str, limit: Option<i64>) -> Result<Vec<WorkflowExecution>, CoreError> {
        let limit = limit.unwrap_or(100);
        let rows = sqlx::query(
            "SELECT * FROM workflow_executions WHERE workflow_id = ? ORDER BY started_at DESC LIMIT ?"
        )
        .bind(workflow_id)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        let mut executions = Vec::new();
        for row in rows {
            executions.push(self.workflow_execution_from_row(row).await?);
        }

        Ok(executions)
    }

    pub async fn update_workflow_execution(&self, execution: &WorkflowExecution) -> Result<(), CoreError> {
        let step_results_json = serde_json::to_string(&execution.step_results)?;
        let logs_json = serde_json::to_string(&execution.logs)?;
        let status_json = serde_json::to_string(&execution.status)?;

        sqlx::query(
            r#"
            UPDATE workflow_executions SET
                status = ?, completed_at = ?, step_results = ?,
                error_message = ?, logs = ?
            WHERE id = ?
            "#,
        )
        .bind(&status_json)
        .bind(execution.completed_at.map(|dt| dt.to_rfc3339()))
        .bind(&step_results_json)
        .bind(&execution.error_message)
        .bind(&logs_json)
        .bind(&execution.id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // AI Analysis operations
    pub async fn create_analysis_request(&self, request: &AnalysisRequest) -> Result<(), CoreError> {
        request.validate()?;

        let context_json = serde_json::to_string(&request.context)?;
        let preferences_json = serde_json::to_string(&request.model_preferences)?;
        let analysis_type_json = serde_json::to_string(&request.analysis_type)?;

        sqlx::query(
            r#"
            INSERT INTO ai_analysis_requests (
                id, path, analysis_type, context, model_preferences, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&request.id)
        .bind(&request.path)
        .bind(&analysis_type_json)
        .bind(&context_json)
        .bind(&preferences_json)
        .bind(request.created_at.to_rfc3339())
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn create_analysis_result(&self, result: &AnalysisResult) -> Result<(), CoreError> {
        let insights_json = serde_json::to_string(&result.insights)?;
        let suggestions_json = serde_json::to_string(&result.suggestions)?;
        let metrics_json = serde_json::to_string(&result.metrics)?;
        let analysis_type_json = serde_json::to_string(&result.analysis_type)?;
        let status_json = serde_json::to_string(&result.status)?;

        sqlx::query(
            r#"
            INSERT INTO ai_analysis_results (
                id, request_id, timestamp, path, model_used, analysis_type,
                insights, suggestions, metrics, summary, status, error_message
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&result.id)
        .bind(&result.request_id)
        .bind(result.timestamp.to_rfc3339())
        .bind(&result.path)
        .bind(&result.model_used)
        .bind(&analysis_type_json)
        .bind(&insights_json)
        .bind(&suggestions_json)
        .bind(&metrics_json)
        .bind(&result.summary)
        .bind(&status_json)
        .bind(&result.error_message)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_analysis_result(&self, id: &str) -> Result<AnalysisResult, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM ai_analysis_results WHERE id = ?"
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|_| CoreError::AI(crate::models::AIError::AnalysisFailed(format!("Analysis result not found: {}", id))))?;

        self.analysis_result_from_row(row).await
    }

    pub async fn list_analysis_results(&self, limit: Option<i64>) -> Result<Vec<AnalysisResult>, CoreError> {
        let limit = limit.unwrap_or(100);
        let rows = sqlx::query(
            "SELECT * FROM ai_analysis_results ORDER BY timestamp DESC LIMIT ?"
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        let mut results = Vec::new();
        for row in rows {
            results.push(self.analysis_result_from_row(row).await?);
        }

        Ok(results)
    }

    // AI Usage Stats operations
    pub async fn get_ai_usage_stats(&self) -> Result<AIUsageStats, CoreError> {
        let row = sqlx::query(
            "SELECT * FROM ai_usage_stats ORDER BY id DESC LIMIT 1"
        )
        .fetch_one(&self.pool)
        .await?;

        let models_used_json: String = row.get("models_used");
        let analysis_types_json: String = row.get("analysis_types");

        let models_used: HashMap<String, u64> = serde_json::from_str(&models_used_json)?;
        let analysis_types: HashMap<crate::models::AnalysisType, u64> = serde_json::from_str(&analysis_types_json)?;

        Ok(AIUsageStats {
            total_requests: row.get::<i64, _>("total_requests") as u64,
            successful_requests: row.get::<i64, _>("successful_requests") as u64,
            failed_requests: row.get::<i64, _>("failed_requests") as u64,
            total_tokens_used: row.get::<i64, _>("total_tokens_used") as u64,
            average_response_time_ms: row.get("average_response_time_ms"),
            models_used,
            analysis_types,
        })
    }

    pub async fn update_ai_usage_stats(&self, stats: &AIUsageStats) -> Result<(), CoreError> {
        let models_used_json = serde_json::to_string(&stats.models_used)?;
        let analysis_types_json = serde_json::to_string(&stats.analysis_types)?;

        sqlx::query(
            r#"
            UPDATE ai_usage_stats SET
                total_requests = ?, successful_requests = ?, failed_requests = ?,
                total_tokens_used = ?, average_response_time_ms = ?,
                models_used = ?, analysis_types = ?, updated_at = ?
            WHERE id = (SELECT id FROM ai_usage_stats ORDER BY id DESC LIMIT 1)
            "#,
        )
        .bind(stats.total_requests as i64)
        .bind(stats.successful_requests as i64)
        .bind(stats.failed_requests as i64)
        .bind(stats.total_tokens_used as i64)
        .bind(stats.average_response_time_ms)
        .bind(&models_used_json)
        .bind(&analysis_types_json)
        .bind(Utc::now().to_rfc3339())
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // Monitoring data operations
    pub async fn store_monitoring_data(
        &self,
        environment_id: Option<&str>,
        metric_name: &str,
        metric_value: f64,
        metadata: Option<&HashMap<String, serde_json::Value>>,
    ) -> Result<(), CoreError> {
        let metadata_json = metadata.map(|m| serde_json::to_string(m)).transpose()?;

        sqlx::query(
            r#"
            INSERT INTO monitoring_data (environment_id, metric_name, metric_value, metadata, timestamp)
            VALUES (?, ?, ?, ?, ?)
            "#,
        )
        .bind(environment_id)
        .bind(metric_name)
        .bind(metric_value)
        .bind(metadata_json)
        .bind(Utc::now().to_rfc3339())
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_monitoring_data(
        &self,
        environment_id: Option<&str>,
        metric_name: Option<&str>,
        since: Option<DateTime<Utc>>,
        limit: Option<i64>,
    ) -> Result<Vec<(String, f64, Option<HashMap<String, serde_json::Value>>, DateTime<Utc>)>, CoreError> {
        let limit = limit.unwrap_or(1000);
        let since_str = since.map(|dt| dt.to_rfc3339());

        let mut query = "SELECT metric_name, metric_value, metadata, timestamp FROM monitoring_data WHERE 1=1".to_string();
        let mut bindings = Vec::new();

        if let Some(env_id) = environment_id {
            query.push_str(" AND environment_id = ?");
            bindings.push(env_id);
        }

        if let Some(metric) = metric_name {
            query.push_str(" AND metric_name = ?");
            bindings.push(metric);
        }

        if let Some(since_str) = &since_str {
            query.push_str(" AND timestamp >= ?");
            bindings.push(since_str.as_str());
        }

        query.push_str(" ORDER BY timestamp DESC LIMIT ?");

        let mut sqlx_query = sqlx::query(&query);
        for binding in bindings {
            sqlx_query = sqlx_query.bind(binding);
        }
        sqlx_query = sqlx_query.bind(limit);

        let rows = sqlx_query.fetch_all(&self.pool).await?;

        let mut results = Vec::new();
        for row in rows {
            let metric_name: String = row.get("metric_name");
            let metric_value: f64 = row.get("metric_value");
            let metadata_json: Option<String> = row.get("metadata");
            let timestamp_str: String = row.get("timestamp");

            let metadata = if let Some(json) = metadata_json {
                Some(serde_json::from_str(&json)?)
            } else {
                None
            };

            let timestamp = DateTime::parse_from_rfc3339(&timestamp_str)
                .map_err(|e| CoreError::Config(ConfigError::InvalidFormat(format!("Invalid timestamp: {}", e))))?
                .with_timezone(&Utc);

            results.push((metric_name, metric_value, metadata, timestamp));
        }

        Ok(results)
    }

    // Helper methods for converting database rows to structs
    async fn environment_from_row(&self, row: sqlx::sqlite::SqliteRow) -> Result<Environment, CoreError> {
        let dependencies_json: String = row.get("dependencies");
        let env_vars_json: String = row.get("environment_variables");
        let scripts_json: String = row.get("scripts");
        let ai_settings_json: String = row.get("ai_settings");
        let status_json: String = row.get("status");
        let project_type_json: String = row.get("project_type");

        let created_at_str: String = row.get("created_at");
        let updated_at_str: String = row.get("updated_at");
        let last_activated_str: Option<String> = row.get("last_activated");

        Ok(Environment {
            id: row.get("id"),
            name: row.get("name"),
            path: row.get::<String, _>("path").into(),
            project_type: serde_json::from_str(&project_type_json)?,
            dependencies: serde_json::from_str(&dependencies_json)?,
            environment_variables: serde_json::from_str(&env_vars_json)?,
            scripts: serde_json::from_str(&scripts_json)?,
            ai_settings: serde_json::from_str(&ai_settings_json)?,
            description: row.get("description"),
            status: serde_json::from_str(&status_json)?,
            created_at: DateTime::parse_from_rfc3339(&created_at_str)?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&updated_at_str)?.with_timezone(&Utc),
            last_activated: last_activated_str
                .map(|s| DateTime::parse_from_rfc3339(&s).map(|dt| dt.with_timezone(&Utc)))
                .transpose()?,
        })
    }

    async fn workflow_from_row(&self, row: sqlx::sqlite::SqliteRow) -> Result<Workflow, CoreError> {
        let triggers_json: String = row.get("triggers");
        let steps_json: String = row.get("steps");
        let status_json: String = row.get("status");
        let created_at_str: String = row.get("created_at");
        let updated_at_str: String = row.get("updated_at");
        let last_executed_str: Option<String> = row.get("last_executed");

        Ok(Workflow {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            triggers: serde_json::from_str(&triggers_json)?,
            steps: serde_json::from_str(&steps_json)?,
            environment_id: row.get("environment_id"),
            status: serde_json::from_str(&status_json)?,
            created_at: DateTime::parse_from_rfc3339(&created_at_str)?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&updated_at_str)?.with_timezone(&Utc),
            last_executed: last_executed_str
                .map(|s| DateTime::parse_from_rfc3339(&s).map(|dt| dt.with_timezone(&Utc)))
                .transpose()?,
            execution_count: row.get::<i64, _>("execution_count") as u64,
            enabled: row.get("enabled"),
        })
    }

    async fn workflow_execution_from_row(&self, row: sqlx::sqlite::SqliteRow) -> Result<WorkflowExecution, CoreError> {
        let step_results_json: String = row.get("step_results");
        let logs_json: String = row.get("logs");
        let status_json: String = row.get("status");
        let started_at_str: String = row.get("started_at");
        let completed_at_str: Option<String> = row.get("completed_at");

        Ok(WorkflowExecution {
            id: row.get("id"),
            workflow_id: row.get("workflow_id"),
            trigger_id: row.get("trigger_id"),
            status: serde_json::from_str(&status_json)?,
            started_at: DateTime::parse_from_rfc3339(&started_at_str)?.with_timezone(&Utc),
            completed_at: completed_at_str
                .map(|s| DateTime::parse_from_rfc3339(&s).map(|dt| dt.with_timezone(&Utc)))
                .transpose()?,
            step_results: serde_json::from_str(&step_results_json)?,
            error_message: row.get("error_message"),
            logs: serde_json::from_str(&logs_json)?,
        })
    }

    async fn analysis_result_from_row(&self, row: sqlx::sqlite::SqliteRow) -> Result<AnalysisResult, CoreError> {
        let insights_json: String = row.get("insights");
        let suggestions_json: String = row.get("suggestions");
        let metrics_json: String = row.get("metrics");
        let analysis_type_json: String = row.get("analysis_type");
        let status_json: String = row.get("status");
        let timestamp_str: String = row.get("timestamp");

        Ok(AnalysisResult {
            id: row.get("id"),
            request_id: row.get("request_id"),
            timestamp: DateTime::parse_from_rfc3339(&timestamp_str)?.with_timezone(&Utc),
            path: row.get("path"),
            model_used: row.get("model_used"),
            analysis_type: serde_json::from_str(&analysis_type_json)?,
            insights: serde_json::from_str(&insights_json)?,
            suggestions: serde_json::from_str(&suggestions_json)?,
            metrics: serde_json::from_str(&metrics_json)?,
            summary: row.get("summary"),
            status: serde_json::from_str(&status_json)?,
            error_message: row.get("error_message"),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::path::PathBuf;
    use crate::models::{ProjectType, DependencySpec, DependencyType, AISettings, AnalysisType};

    async fn create_test_store() -> ConfigStore {
        let temp_dir = tempdir().unwrap();
        let db_path = temp_dir.path().join("test.db");
        let database_url = format!("sqlite://{}", db_path.display());
        ConfigStore::new(&database_url).await.unwrap()
    }

    #[tokio::test]
    async fn test_environment_crud() {
        let store = create_test_store().await;

        // Create environment with a valid path
        let temp_dir = tempfile::tempdir().unwrap();
        let config = EnvironmentConfig {
            name: "test-env".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::NodeJS,
            dependencies: vec![DependencySpec {
                name: "react".to_string(),
                version: Some("18.0.0".to_string()),
                dependency_type: DependencyType::Runtime,
                install_command: Some("npm install react".to_string()),
                required: true,
            }],
            environment_variables: {
                let mut vars = HashMap::new();
                vars.insert("NODE_ENV".to_string(), "development".to_string());
                vars
            },
            scripts: {
                let mut scripts = HashMap::new();
                scripts.insert("start".to_string(), "npm start".to_string());
                scripts
            },
            ai_settings: AISettings::default(),
            description: Some("Test environment".to_string()),
        };

        let env = store.create_environment(config).await.unwrap();
        assert_eq!(env.name, "test-env");
        assert_eq!(env.project_type, ProjectType::NodeJS);
        assert_eq!(env.dependencies.len(), 1);
        assert_eq!(env.environment_variables.len(), 1);
        assert_eq!(env.scripts.len(), 1);

        // Test duplicate name prevention
        let duplicate_config = EnvironmentConfig {
            name: "test-env".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::Rust,
            dependencies: vec![],
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: None,
        };
        let duplicate_result = store.create_environment(duplicate_config).await;
        assert!(duplicate_result.is_err());

        // Get environment by ID
        let retrieved_env = store.get_environment(&env.id).await.unwrap();
        assert_eq!(retrieved_env.name, env.name);
        assert_eq!(retrieved_env.dependencies.len(), 1);
        assert_eq!(retrieved_env.dependencies[0].name, "react");

        // Get environment by name
        let retrieved_by_name = store.get_environment_by_name("test-env").await.unwrap();
        assert_eq!(retrieved_by_name.id, env.id);

        // Test non-existent environment
        let non_existent = store.get_environment("non-existent-id").await;
        assert!(non_existent.is_err());

        // List environments
        let environments = store.list_environments().await.unwrap();
        assert_eq!(environments.len(), 1);
        assert_eq!(environments[0].name, "test-env");

        // Update environment
        let mut updated_env = retrieved_env.clone();
        updated_env.description = Some("Updated description".to_string());
        updated_env.activate();
        store.update_environment(&updated_env).await.unwrap();

        let retrieved_updated = store.get_environment(&env.id).await.unwrap();
        assert_eq!(retrieved_updated.description, Some("Updated description".to_string()));
        assert!(retrieved_updated.is_active());

        // Test get active environment
        let active_env = store.get_active_environment().await.unwrap();
        assert!(active_env.is_some());
        assert_eq!(active_env.unwrap().id, env.id);

        // Delete environment
        store.delete_environment(&env.id).await.unwrap();
        let result = store.get_environment(&env.id).await;
        assert!(result.is_err());

        // Test deleting non-existent environment
        let delete_result = store.delete_environment("non-existent").await;
        assert!(delete_result.is_err());

        store.close().await;
    }

    #[tokio::test]
    async fn test_workflow_crud() {
        let store = create_test_store().await;

        // Create a test environment first
        let temp_dir = tempfile::tempdir().unwrap();
        let env_config = EnvironmentConfig {
            name: "workflow-test-env".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::NodeJS,
            dependencies: vec![],
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: None,
        };
        let env = store.create_environment(env_config).await.unwrap();

        // Create workflow
        let mut workflow = crate::models::Workflow::new(
            "Test Workflow".to_string(),
            "A test workflow for database testing".to_string(),
        );
        
        // Add trigger
        let trigger = crate::models::WorkflowTrigger::new(crate::models::WorkflowTriggerType::Manual);
        workflow.add_trigger(trigger).unwrap();
        
        // Add step
        let step = crate::models::WorkflowStep::new("Test Step".to_string(), crate::models::WorkflowStepType::Command)
            .with_command("echo 'test'".to_string());
        workflow.add_step(step).unwrap();
        
        workflow.set_environment(env.id.clone());

        // Store workflow
        store.create_workflow(&workflow).await.unwrap();

        // Retrieve workflow
        let retrieved_workflow = store.get_workflow(&workflow.id).await.unwrap();
        assert_eq!(retrieved_workflow.name, workflow.name);
        assert_eq!(retrieved_workflow.description, workflow.description);
        assert_eq!(retrieved_workflow.triggers.len(), 1);
        assert_eq!(retrieved_workflow.steps.len(), 1);
        assert_eq!(retrieved_workflow.environment_id, Some(env.id.clone()));

        // List all workflows
        let all_workflows = store.list_workflows().await.unwrap();
        assert_eq!(all_workflows.len(), 1);

        // List workflows for environment
        let env_workflows = store.list_workflows_for_environment(&env.id).await.unwrap();
        assert_eq!(env_workflows.len(), 1);
        assert_eq!(env_workflows[0].id, workflow.id);

        // Update workflow
        let mut updated_workflow = retrieved_workflow.clone();
        updated_workflow.description = "Updated description".to_string();
        updated_workflow.execution_count = 5;
        store.update_workflow(&updated_workflow).await.unwrap();

        let retrieved_updated = store.get_workflow(&workflow.id).await.unwrap();
        assert_eq!(retrieved_updated.description, "Updated description");
        assert_eq!(retrieved_updated.execution_count, 5);

        // Delete workflow
        store.delete_workflow(&workflow.id).await.unwrap();
        let result = store.get_workflow(&workflow.id).await;
        assert!(result.is_err());

        store.close().await;
    }

    #[tokio::test]
    async fn test_workflow_execution_crud() {
        let store = create_test_store().await;

        // Create workflow first
        let mut workflow = crate::models::Workflow::new(
            "Execution Test".to_string(),
            "Test workflow execution".to_string(),
        );
        let step = crate::models::WorkflowStep::new("Test Step".to_string(), crate::models::WorkflowStepType::Command)
            .with_command("echo 'test'".to_string());
        workflow.add_step(step).unwrap();
        store.create_workflow(&workflow).await.unwrap();

        // Create workflow execution
        let mut execution = crate::models::WorkflowExecution::new(workflow.id.clone(), None);
        
        // Add step result
        let step_result = crate::models::WorkflowStepResult {
            step_id: "step-1".to_string(),
            status: crate::models::WorkflowStepStatus::Completed,
            started_at: Utc::now(),
            completed_at: Some(Utc::now()),
            output: Some("Step completed".to_string()),
            error_message: None,
            exit_code: Some(0),
        };
        execution.add_step_result(step_result);
        
        // Add logs
        execution.add_log("info".to_string(), "Execution started".to_string(), None);
        execution.add_log("debug".to_string(), "Step completed".to_string(), Some("step-1".to_string()));
        
        execution.complete(crate::models::WorkflowStatus::Completed, None);

        // Store execution
        store.create_workflow_execution(&execution).await.unwrap();

        // Retrieve execution
        let retrieved_execution = store.get_workflow_execution(&execution.id).await.unwrap();
        assert_eq!(retrieved_execution.workflow_id, workflow.id);
        assert_eq!(retrieved_execution.status, crate::models::WorkflowStatus::Completed);
        assert_eq!(retrieved_execution.step_results.len(), 1);
        assert_eq!(retrieved_execution.logs.len(), 2);

        // List executions for workflow
        let executions = store.list_workflow_executions(&workflow.id, Some(10)).await.unwrap();
        assert_eq!(executions.len(), 1);
        assert_eq!(executions[0].id, execution.id);

        // Update execution
        let mut updated_execution = retrieved_execution.clone();
        updated_execution.add_log("info".to_string(), "Additional log".to_string(), None);
        store.update_workflow_execution(&updated_execution).await.unwrap();

        let retrieved_updated = store.get_workflow_execution(&execution.id).await.unwrap();
        assert_eq!(retrieved_updated.logs.len(), 3);

        store.close().await;
    }

    #[tokio::test]
    async fn test_ai_analysis_crud() {
        let store = create_test_store().await;

        // Create analysis request
        let request = crate::models::AnalysisRequest::new(
            "./src".to_string(),
            crate::models::AnalysisType::CodeQuality,
        );
        store.create_analysis_request(&request).await.unwrap();

        // Create analysis result
        let mut result = crate::models::AnalysisResult::new(
            request.id.clone(),
            "./src".to_string(),
            "gpt-4".to_string(),
            crate::models::AnalysisType::CodeQuality,
        );

        let insight = crate::models::CodeInsight::new(
            crate::models::InsightCategory::CodeSmell,
            crate::models::Severity::Medium,
            "Unused variable".to_string(),
            "Variable 'x' is declared but never used".to_string(),
        );
        result.add_insight(insight);

        let suggestion = crate::models::Suggestion::new(
            crate::models::SuggestionType::CodeImprovement,
            "Remove unused variable".to_string(),
            "Remove the unused variable to clean up the code".to_string(),
        );
        result.add_suggestion(suggestion);

        let metrics = crate::models::AnalysisMetrics {
            files_analyzed: 5,
            lines_of_code: 500,
            analysis_duration_ms: 2000,
            model_tokens_used: Some(1000),
            api_calls_made: 1,
            insights_found: 1,
            suggestions_generated: 1,
        };
        result.complete("Analysis completed successfully".to_string(), metrics);

        store.create_analysis_result(&result).await.unwrap();

        // Retrieve analysis result
        let retrieved_result = store.get_analysis_result(&result.id).await.unwrap();
        assert_eq!(retrieved_result.request_id, request.id);
        assert_eq!(retrieved_result.model_used, "gpt-4");
        assert_eq!(retrieved_result.insights.len(), 1);
        assert_eq!(retrieved_result.suggestions.len(), 1);
        assert_eq!(retrieved_result.status, crate::models::AnalysisStatus::Completed);

        // List analysis results
        let results = store.list_analysis_results(Some(10)).await.unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].id, result.id);

        store.close().await;
    }

    #[tokio::test]
    async fn test_ai_usage_stats() {
        let store = create_test_store().await;

        // Get initial stats (should be created by migrations)
        let mut stats = store.get_ai_usage_stats().await.unwrap();
        assert_eq!(stats.total_requests, 0);
        assert_eq!(stats.successful_requests, 0);
        assert_eq!(stats.failed_requests, 0);

        // Update stats
        stats.record_request("gpt-4", crate::models::AnalysisType::CodeQuality, true, 1000, 2000);
        stats.record_request("gpt-4", crate::models::AnalysisType::Security, false, 500, 1500);
        stats.record_request("claude-3", crate::models::AnalysisType::CodeQuality, true, 800, 1800);
        
        store.update_ai_usage_stats(&stats).await.unwrap();

        // Retrieve updated stats
        let updated_stats = store.get_ai_usage_stats().await.unwrap();
        assert_eq!(updated_stats.total_requests, 3);
        assert_eq!(updated_stats.successful_requests, 2);
        assert_eq!(updated_stats.failed_requests, 1);
        assert_eq!(updated_stats.total_tokens_used, 2300);
        assert_eq!(updated_stats.models_used.len(), 2);
        assert_eq!(updated_stats.analysis_types.len(), 2);

        store.close().await;
    }

    #[tokio::test]
    async fn test_monitoring_data() {
        let store = create_test_store().await;

        // Create environment for monitoring data
        let temp_dir = tempfile::tempdir().unwrap();
        let env_config = EnvironmentConfig {
            name: "monitoring-env".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::NodeJS,
            dependencies: vec![],
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: None,
        };
        let env = store.create_environment(env_config).await.unwrap();

        // Store monitoring data with environment
        let mut metadata = HashMap::new();
        metadata.insert("source".to_string(), serde_json::json!("system"));
        metadata.insert("unit".to_string(), serde_json::json!("percentage"));

        store.store_monitoring_data(
            Some(&env.id),
            "cpu_usage",
            75.5,
            Some(&metadata),
        ).await.unwrap();

        store.store_monitoring_data(
            Some(&env.id),
            "memory_usage",
            60.2,
            None,
        ).await.unwrap();

        // Store monitoring data without environment
        store.store_monitoring_data(
            None,
            "system_load",
            1.5,
            None,
        ).await.unwrap();

        // Retrieve all monitoring data
        let all_data = store.get_monitoring_data(None, None, None, Some(100)).await.unwrap();
        assert_eq!(all_data.len(), 3);

        // Retrieve data for specific environment
        let env_data = store.get_monitoring_data(Some(&env.id), None, None, Some(100)).await.unwrap();
        assert_eq!(env_data.len(), 2);

        // Retrieve specific metric
        let cpu_data = store.get_monitoring_data(Some(&env.id), Some("cpu_usage"), None, Some(100)).await.unwrap();
        assert_eq!(cpu_data.len(), 1);
        assert_eq!(cpu_data[0].0, "cpu_usage");
        assert_eq!(cpu_data[0].1, 75.5);
        assert!(cpu_data[0].2.is_some());

        // Test with time filter
        let recent_time = Utc::now() - chrono::Duration::minutes(1);
        let recent_data = store.get_monitoring_data(None, None, Some(recent_time), Some(100)).await.unwrap();
        assert_eq!(recent_data.len(), 3); // All data should be recent

        let old_time = Utc::now() + chrono::Duration::minutes(1);
        let old_data = store.get_monitoring_data(None, None, Some(old_time), Some(100)).await.unwrap();
        assert_eq!(old_data.len(), 0); // No data should be in the future

        store.close().await;
    }

    #[tokio::test]
    async fn test_database_error_handling() {
        let store = create_test_store().await;

        // Test invalid environment creation
        let invalid_config = EnvironmentConfig {
            name: "".to_string(), // Invalid empty name
            path: PathBuf::from("/non/existent/path"),
            project_type: ProjectType::NodeJS,
            dependencies: vec![],
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: None,
        };
        let result = store.create_environment(invalid_config).await;
        assert!(result.is_err());

        // Test invalid workflow creation
        let invalid_workflow = crate::models::Workflow::new("".to_string(), "Invalid".to_string());
        let result = store.create_workflow(&invalid_workflow).await;
        assert!(result.is_err());

        // Test invalid analysis request
        let mut invalid_request = crate::models::AnalysisRequest::new(
            "".to_string(), // Invalid empty path
            crate::models::AnalysisType::CodeQuality,
        );
        invalid_request.model_preferences.temperature = Some(5.0); // Invalid temperature
        let result = store.create_analysis_request(&invalid_request).await;
        assert!(result.is_err());

        store.close().await;
    }

    #[tokio::test]
    async fn test_database_transactions_and_consistency() {
        let store = create_test_store().await;

        // Create environment
        let temp_dir = tempfile::tempdir().unwrap();
        let env_config = EnvironmentConfig {
            name: "consistency-test".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::Rust,
            dependencies: vec![],
            environment_variables: HashMap::new(),
            scripts: HashMap::new(),
            ai_settings: AISettings::default(),
            description: Some("Consistency test environment".to_string()),
        };
        let env = store.create_environment(env_config).await.unwrap();

        // Create workflow linked to environment
        let mut workflow = crate::models::Workflow::new(
            "Consistency Workflow".to_string(),
            "Test workflow for consistency".to_string(),
        );
        let step = crate::models::WorkflowStep::new("Test Step".to_string(), crate::models::WorkflowStepType::Command)
            .with_command("echo 'consistency test'".to_string());
        workflow.add_step(step).unwrap();
        workflow.set_environment(env.id.clone());
        store.create_workflow(&workflow).await.unwrap();

        // Verify relationships
        let retrieved_env = store.get_environment(&env.id).await.unwrap();
        let env_workflows = store.list_workflows_for_environment(&env.id).await.unwrap();
        
        assert_eq!(retrieved_env.id, env.id);
        assert_eq!(env_workflows.len(), 1);
        assert_eq!(env_workflows[0].environment_id, Some(env.id.clone()));

        // Test sequential operations to verify consistency
        let mut updated_env = retrieved_env.clone();
        updated_env.description = Some("Updated by task 1".to_string());
        store.update_environment(&updated_env).await.unwrap();

        // Add some monitoring data
        store.store_monitoring_data(
            Some(&env.id),
            "test_metric",
            42.0,
            None,
        ).await.unwrap();

        // Verify final state
        let final_env = store.get_environment(&env.id).await.unwrap();
        let monitoring_data = store.get_monitoring_data(Some(&env.id), Some("test_metric"), None, Some(10)).await.unwrap();
        
        assert_eq!(final_env.description, Some("Updated by task 1".to_string()));
        assert_eq!(monitoring_data.len(), 1);
        assert_eq!(monitoring_data[0].1, 42.0);

        store.close().await;
    }

    #[tokio::test]
    async fn test_complex_data_serialization() {
        let store = create_test_store().await;

        // Create environment with complex data
        let temp_dir = tempfile::tempdir().unwrap();
        let env_config = EnvironmentConfig {
            name: "complex-serialization-test".to_string(),
            path: temp_dir.path().to_path_buf(),
            project_type: ProjectType::Mixed,
            dependencies: vec![
                DependencySpec {
                    name: "react".to_string(),
                    version: Some("18.2.0".to_string()),
                    dependency_type: DependencyType::Runtime,
                    install_command: Some("npm install react@18.2.0".to_string()),
                    required: true,
                },
                DependencySpec {
                    name: "typescript".to_string(),
                    version: Some("5.0.0".to_string()),
                    dependency_type: DependencyType::Development,
                    install_command: Some("npm install -D typescript@5.0.0".to_string()),
                    required: false,
                },
            ],
            environment_variables: {
                let mut vars = HashMap::new();
                vars.insert("NODE_ENV".to_string(), "production".to_string());
                vars.insert("API_URL".to_string(), "https://api.example.com".to_string());
                vars.insert("DEBUG".to_string(), "false".to_string());
                vars
            },
            scripts: {
                let mut scripts = HashMap::new();
                scripts.insert("build".to_string(), "npm run build && cargo build --release".to_string());
                scripts.insert("test".to_string(), "npm test && cargo test".to_string());
                scripts.insert("deploy".to_string(), "docker build -t app . && docker push app".to_string());
                scripts
            },
            ai_settings: AISettings {
                enabled: true,
                preferred_model: Some("gpt-4".to_string()),
                analysis_frequency: Some("on_commit".to_string()),
                auto_suggestions: false,
            },
            description: Some("Complex environment with mixed project types and extensive configuration".to_string()),
        };

        let env = store.create_environment(env_config).await.unwrap();

        // Retrieve and verify complex data
        let retrieved_env = store.get_environment(&env.id).await.unwrap();
        
        assert_eq!(retrieved_env.project_type, ProjectType::Mixed);
        assert_eq!(retrieved_env.dependencies.len(), 2);
        assert_eq!(retrieved_env.environment_variables.len(), 3);
        assert_eq!(retrieved_env.scripts.len(), 3);
        
        // Verify dependency details
        let react_dep = retrieved_env.dependencies.iter().find(|d| d.name == "react").unwrap();
        assert_eq!(react_dep.version, Some("18.2.0".to_string()));
        assert_eq!(react_dep.dependency_type, DependencyType::Runtime);
        assert!(react_dep.required);
        
        let ts_dep = retrieved_env.dependencies.iter().find(|d| d.name == "typescript").unwrap();
        assert_eq!(ts_dep.dependency_type, DependencyType::Development);
        assert!(!ts_dep.required);
        
        // Verify environment variables
        assert_eq!(retrieved_env.environment_variables.get("NODE_ENV"), Some(&"production".to_string()));
        assert_eq!(retrieved_env.environment_variables.get("API_URL"), Some(&"https://api.example.com".to_string()));
        
        // Verify scripts
        assert!(retrieved_env.scripts.get("build").unwrap().contains("npm run build"));
        assert!(retrieved_env.scripts.get("build").unwrap().contains("cargo build"));
        
        // Verify AI settings
        assert!(retrieved_env.ai_settings.enabled);
        assert_eq!(retrieved_env.ai_settings.preferred_model, Some("gpt-4".to_string()));
        assert_eq!(retrieved_env.ai_settings.analysis_frequency, Some("on_commit".to_string()));
        assert!(!retrieved_env.ai_settings.auto_suggestions);

        store.close().await;
    }
}