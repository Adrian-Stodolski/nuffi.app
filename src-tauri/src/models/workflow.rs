use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::error::WorkflowError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum WorkflowTriggerType {
    Manual,
    FileChange,
    Schedule,
    EnvironmentActivation,
    GitCommit,
    BuildComplete,
    TestComplete,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum WorkflowStepType {
    Command,
    Script,
    AIAnalysis,
    Notification,
    FileOperation,
    EnvironmentSetup,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum WorkflowStatus {
    Idle,
    Running,
    Completed,
    Failed,
    Cancelled,
    Paused,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum WorkflowStepStatus {
    Pending,
    Running,
    Completed,
    Failed,
    Skipped,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowTrigger {
    pub id: String,
    pub trigger_type: WorkflowTriggerType,
    pub conditions: HashMap<String, String>,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowStep {
    pub id: String,
    pub name: String,
    pub step_type: WorkflowStepType,
    pub command: Option<String>,
    pub script_path: Option<String>,
    pub parameters: HashMap<String, String>,
    pub timeout_seconds: Option<u64>,
    pub retry_count: u32,
    pub continue_on_error: bool,
    pub depends_on: Vec<String>,
    pub status: WorkflowStepStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workflow {
    pub id: String,
    pub name: String,
    pub description: String,
    pub triggers: Vec<WorkflowTrigger>,
    pub steps: Vec<WorkflowStep>,
    pub environment_id: Option<String>,
    pub status: WorkflowStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_executed: Option<DateTime<Utc>>,
    pub execution_count: u64,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowExecution {
    pub id: String,
    pub workflow_id: String,
    pub trigger_id: Option<String>,
    pub status: WorkflowStatus,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
    pub step_results: Vec<WorkflowStepResult>,
    pub error_message: Option<String>,
    pub logs: Vec<WorkflowLog>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowStepResult {
    pub step_id: String,
    pub status: WorkflowStepStatus,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
    pub output: Option<String>,
    pub error_message: Option<String>,
    pub exit_code: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowLog {
    pub timestamp: DateTime<Utc>,
    pub level: String,
    pub message: String,
    pub step_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowResult {
    pub execution_id: String,
    pub workflow_id: String,
    pub status: WorkflowStatus,
    pub duration_seconds: u64,
    pub steps_completed: u32,
    pub steps_failed: u32,
    pub error_message: Option<String>,
}

impl WorkflowTrigger {
    pub fn new(trigger_type: WorkflowTriggerType) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            trigger_type,
            conditions: HashMap::new(),
            enabled: true,
        }
    }

    pub fn with_condition(mut self, key: String, value: String) -> Self {
        self.conditions.insert(key, value);
        self
    }

    pub fn validate(&self) -> Result<(), WorkflowError> {
        match self.trigger_type {
            WorkflowTriggerType::FileChange => {
                if !self.conditions.contains_key("path") {
                    return Err(WorkflowError::ValidationFailed(
                        "FileChange trigger requires 'path' condition".to_string()
                    ));
                }
            }
            WorkflowTriggerType::Schedule => {
                if !self.conditions.contains_key("cron") {
                    return Err(WorkflowError::ValidationFailed(
                        "Schedule trigger requires 'cron' condition".to_string()
                    ));
                }
            }
            _ => {}
        }
        Ok(())
    }
}

impl WorkflowStep {
    pub fn new(name: String, step_type: WorkflowStepType) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            step_type,
            command: None,
            script_path: None,
            parameters: HashMap::new(),
            timeout_seconds: Some(300), // 5 minutes default
            retry_count: 0,
            continue_on_error: false,
            depends_on: Vec::new(),
            status: WorkflowStepStatus::Pending,
        }
    }

    pub fn with_command(mut self, command: String) -> Self {
        self.command = Some(command);
        self
    }

    pub fn with_script(mut self, script_path: String) -> Self {
        self.script_path = Some(script_path);
        self
    }

    pub fn with_parameter(mut self, key: String, value: String) -> Self {
        self.parameters.insert(key, value);
        self
    }

    pub fn with_timeout(mut self, seconds: u64) -> Self {
        self.timeout_seconds = Some(seconds);
        self
    }

    pub fn with_retry(mut self, count: u32) -> Self {
        self.retry_count = count;
        self
    }

    pub fn continue_on_error(mut self) -> Self {
        self.continue_on_error = true;
        self
    }

    pub fn depends_on_step(mut self, step_id: String) -> Self {
        self.depends_on.push(step_id);
        self
    }

    pub fn validate(&self) -> Result<(), WorkflowError> {
        match self.step_type {
            WorkflowStepType::Command => {
                if self.command.is_none() {
                    return Err(WorkflowError::ValidationFailed(
                        format!("Command step '{}' requires a command", self.name)
                    ));
                }
            }
            WorkflowStepType::Script => {
                if self.script_path.is_none() {
                    return Err(WorkflowError::ValidationFailed(
                        format!("Script step '{}' requires a script path", self.name)
                    ));
                }
            }
            _ => {}
        }
        Ok(())
    }

    pub fn is_ready_to_execute(&self, completed_steps: &[String]) -> bool {
        if self.status != WorkflowStepStatus::Pending {
            return false;
        }

        // Don't execute steps that are already completed
        if completed_steps.contains(&self.id) {
            return false;
        }

        // Check if all dependencies are completed
        for dep_id in &self.depends_on {
            if !completed_steps.contains(dep_id) {
                return false;
            }
        }

        true
    }
}

impl Workflow {
    pub fn new(name: String, description: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            triggers: Vec::new(),
            steps: Vec::new(),
            environment_id: None,
            status: WorkflowStatus::Idle,
            created_at: now,
            updated_at: now,
            last_executed: None,
            execution_count: 0,
            enabled: true,
        }
    }

    pub fn add_trigger(&mut self, trigger: WorkflowTrigger) -> Result<(), WorkflowError> {
        trigger.validate()?;
        self.triggers.push(trigger);
        self.updated_at = Utc::now();
        Ok(())
    }

    pub fn remove_trigger(&mut self, trigger_id: &str) {
        self.triggers.retain(|t| t.id != trigger_id);
        self.updated_at = Utc::now();
    }

    pub fn add_step(&mut self, step: WorkflowStep) -> Result<(), WorkflowError> {
        step.validate()?;
        self.steps.push(step);
        self.updated_at = Utc::now();
        Ok(())
    }

    pub fn remove_step(&mut self, step_id: &str) {
        self.steps.retain(|s| s.id != step_id);
        // Remove dependencies on this step from other steps
        for step in &mut self.steps {
            step.depends_on.retain(|dep| dep != step_id);
        }
        self.updated_at = Utc::now();
    }

    pub fn validate(&self) -> Result<(), WorkflowError> {
        if self.name.trim().is_empty() {
            return Err(WorkflowError::ValidationFailed("Workflow name cannot be empty".to_string()));
        }

        if self.steps.is_empty() {
            return Err(WorkflowError::ValidationFailed("Workflow must have at least one step".to_string()));
        }

        // Validate all triggers
        for trigger in &self.triggers {
            trigger.validate()?;
        }

        // Validate all steps
        for step in &self.steps {
            step.validate()?;
        }

        // Check for circular dependencies
        self.check_circular_dependencies()?;

        Ok(())
    }

    fn check_circular_dependencies(&self) -> Result<(), WorkflowError> {
        for step in &self.steps {
            if self.has_circular_dependency(&step.id, &step.depends_on, &mut Vec::new()) {
                return Err(WorkflowError::ValidationFailed(
                    format!("Circular dependency detected involving step '{}'", step.name)
                ));
            }
        }
        Ok(())
    }

    fn has_circular_dependency(&self, current_id: &str, dependencies: &[String], visited: &mut Vec<String>) -> bool {
        if visited.contains(&current_id.to_string()) {
            return true;
        }

        visited.push(current_id.to_string());

        for dep_id in dependencies {
            if let Some(dep_step) = self.steps.iter().find(|s| s.id == *dep_id) {
                if self.has_circular_dependency(dep_id, &dep_step.depends_on, visited) {
                    return true;
                }
            }
        }

        visited.pop();
        false
    }

    pub fn get_executable_steps(&self, completed_steps: &[String]) -> Vec<&WorkflowStep> {
        self.steps
            .iter()
            .filter(|step| step.is_ready_to_execute(completed_steps))
            .collect()
    }

    pub fn get_step(&self, step_id: &str) -> Option<&WorkflowStep> {
        self.steps.iter().find(|s| s.id == step_id)
    }

    pub fn get_step_mut(&mut self, step_id: &str) -> Option<&mut WorkflowStep> {
        self.steps.iter_mut().find(|s| s.id == step_id)
    }

    pub fn get_trigger(&self, trigger_id: &str) -> Option<&WorkflowTrigger> {
        self.triggers.iter().find(|t| t.id == trigger_id)
    }

    pub fn set_environment(&mut self, environment_id: String) {
        self.environment_id = Some(environment_id);
        self.updated_at = Utc::now();
    }

    pub fn enable(&mut self) {
        self.enabled = true;
        self.updated_at = Utc::now();
    }

    pub fn disable(&mut self) {
        self.enabled = false;
        self.updated_at = Utc::now();
    }

    pub fn is_enabled(&self) -> bool {
        self.enabled
    }

    pub fn can_execute(&self) -> bool {
        self.enabled && self.status == WorkflowStatus::Idle && !self.steps.is_empty()
    }
}

impl WorkflowExecution {
    pub fn new(workflow_id: String, trigger_id: Option<String>) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            workflow_id,
            trigger_id,
            status: WorkflowStatus::Running,
            started_at: Utc::now(),
            completed_at: None,
            step_results: Vec::new(),
            error_message: None,
            logs: Vec::new(),
        }
    }

    pub fn add_step_result(&mut self, result: WorkflowStepResult) {
        self.step_results.push(result);
    }

    pub fn add_log(&mut self, level: String, message: String, step_id: Option<String>) {
        self.logs.push(WorkflowLog {
            timestamp: Utc::now(),
            level,
            message,
            step_id,
        });
    }

    pub fn complete(&mut self, status: WorkflowStatus, error_message: Option<String>) {
        self.status = status;
        self.completed_at = Some(Utc::now());
        self.error_message = error_message;
    }

    pub fn duration(&self) -> Option<chrono::Duration> {
        self.completed_at.map(|end| end - self.started_at)
    }

    pub fn get_step_result(&self, step_id: &str) -> Option<&WorkflowStepResult> {
        self.step_results.iter().find(|r| r.step_id == step_id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_workflow_trigger_type_serialization() {
        let types = vec![
            WorkflowTriggerType::Manual,
            WorkflowTriggerType::FileChange,
            WorkflowTriggerType::Schedule,
            WorkflowTriggerType::EnvironmentActivation,
            WorkflowTriggerType::GitCommit,
            WorkflowTriggerType::BuildComplete,
            WorkflowTriggerType::TestComplete,
        ];
        
        for trigger_type in types {
            let json = serde_json::to_string(&trigger_type).unwrap();
            let deserialized: WorkflowTriggerType = serde_json::from_str(&json).unwrap();
            assert_eq!(trigger_type, deserialized);
        }
    }

    #[test]
    fn test_workflow_step_type_serialization() {
        let types = vec![
            WorkflowStepType::Command,
            WorkflowStepType::Script,
            WorkflowStepType::AIAnalysis,
            WorkflowStepType::Notification,
            WorkflowStepType::FileOperation,
            WorkflowStepType::EnvironmentSetup,
        ];
        
        for step_type in types {
            let json = serde_json::to_string(&step_type).unwrap();
            let deserialized: WorkflowStepType = serde_json::from_str(&json).unwrap();
            assert_eq!(step_type, deserialized);
        }
    }

    #[test]
    fn test_workflow_status_serialization() {
        let statuses = vec![
            WorkflowStatus::Idle,
            WorkflowStatus::Running,
            WorkflowStatus::Completed,
            WorkflowStatus::Failed,
            WorkflowStatus::Cancelled,
            WorkflowStatus::Paused,
        ];
        
        for status in statuses {
            let json = serde_json::to_string(&status).unwrap();
            let deserialized: WorkflowStatus = serde_json::from_str(&json).unwrap();
            assert_eq!(status, deserialized);
        }
    }

    #[test]
    fn test_workflow_step_status_serialization() {
        let statuses = vec![
            WorkflowStepStatus::Pending,
            WorkflowStepStatus::Running,
            WorkflowStepStatus::Completed,
            WorkflowStepStatus::Failed,
            WorkflowStepStatus::Skipped,
        ];
        
        for status in statuses {
            let json = serde_json::to_string(&status).unwrap();
            let deserialized: WorkflowStepStatus = serde_json::from_str(&json).unwrap();
            assert_eq!(status, deserialized);
        }
    }

    #[test]
    fn test_workflow_trigger_creation() {
        let trigger = WorkflowTrigger::new(WorkflowTriggerType::Manual);
        assert_eq!(trigger.trigger_type, WorkflowTriggerType::Manual);
        assert!(trigger.enabled);
        assert!(trigger.conditions.is_empty());
        assert!(!trigger.id.is_empty());
        
        // Test with conditions
        let file_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange)
            .with_condition("path".to_string(), "src/**/*.rs".to_string())
            .with_condition("action".to_string(), "modified".to_string());
        
        assert_eq!(file_trigger.conditions.len(), 2);
        assert_eq!(file_trigger.conditions.get("path"), Some(&"src/**/*.rs".to_string()));
        assert_eq!(file_trigger.conditions.get("action"), Some(&"modified".to_string()));
    }

    #[test]
    fn test_workflow_trigger_validation() {
        // Manual trigger should always be valid
        let manual_trigger = WorkflowTrigger::new(WorkflowTriggerType::Manual);
        assert!(manual_trigger.validate().is_ok());
        
        // FileChange trigger without path should fail
        let invalid_file_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange);
        assert!(invalid_file_trigger.validate().is_err());
        
        // FileChange trigger with path should be valid
        let valid_file_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange)
            .with_condition("path".to_string(), "src/**/*.rs".to_string());
        assert!(valid_file_trigger.validate().is_ok());
        
        // Schedule trigger without cron should fail
        let invalid_schedule_trigger = WorkflowTrigger::new(WorkflowTriggerType::Schedule);
        assert!(invalid_schedule_trigger.validate().is_err());
        
        // Schedule trigger with cron should be valid
        let valid_schedule_trigger = WorkflowTrigger::new(WorkflowTriggerType::Schedule)
            .with_condition("cron".to_string(), "0 0 * * *".to_string());
        assert!(valid_schedule_trigger.validate().is_ok());
        
        // Other trigger types should be valid without specific conditions
        let git_trigger = WorkflowTrigger::new(WorkflowTriggerType::GitCommit);
        assert!(git_trigger.validate().is_ok());
    }

    #[test]
    fn test_workflow_step_creation() {
        let step = WorkflowStep::new("Test Step".to_string(), WorkflowStepType::Command);
        assert_eq!(step.name, "Test Step");
        assert_eq!(step.step_type, WorkflowStepType::Command);
        assert_eq!(step.status, WorkflowStepStatus::Pending);
        assert_eq!(step.timeout_seconds, Some(300));
        assert_eq!(step.retry_count, 0);
        assert!(!step.continue_on_error);
        assert!(step.depends_on.is_empty());
        assert!(step.parameters.is_empty());
        assert!(!step.id.is_empty());
        
        // Test builder pattern
        let complex_step = WorkflowStep::new("Complex Step".to_string(), WorkflowStepType::Script)
            .with_script("/path/to/script.sh".to_string())
            .with_parameter("env".to_string(), "production".to_string())
            .with_parameter("verbose".to_string(), "true".to_string())
            .with_timeout(600)
            .with_retry(3)
            .continue_on_error()
            .depends_on_step("step-1".to_string())
            .depends_on_step("step-2".to_string());
        
        assert_eq!(complex_step.script_path, Some("/path/to/script.sh".to_string()));
        assert_eq!(complex_step.parameters.len(), 2);
        assert_eq!(complex_step.parameters.get("env"), Some(&"production".to_string()));
        assert_eq!(complex_step.timeout_seconds, Some(600));
        assert_eq!(complex_step.retry_count, 3);
        assert!(complex_step.continue_on_error);
        assert_eq!(complex_step.depends_on.len(), 2);
        assert!(complex_step.depends_on.contains(&"step-1".to_string()));
        assert!(complex_step.depends_on.contains(&"step-2".to_string()));
    }

    #[test]
    fn test_workflow_step_validation() {
        // Command step without command should fail
        let invalid_command_step = WorkflowStep::new("Invalid Command".to_string(), WorkflowStepType::Command);
        assert!(invalid_command_step.validate().is_err());
        
        // Command step with command should be valid
        let valid_command_step = WorkflowStep::new("Valid Command".to_string(), WorkflowStepType::Command)
            .with_command("echo 'hello'".to_string());
        assert!(valid_command_step.validate().is_ok());
        
        // Script step without script path should fail
        let invalid_script_step = WorkflowStep::new("Invalid Script".to_string(), WorkflowStepType::Script);
        assert!(invalid_script_step.validate().is_err());
        
        // Script step with script path should be valid
        let valid_script_step = WorkflowStep::new("Valid Script".to_string(), WorkflowStepType::Script)
            .with_script("/path/to/script.sh".to_string());
        assert!(valid_script_step.validate().is_ok());
        
        // Other step types should be valid without specific requirements
        let notification_step = WorkflowStep::new("Notification".to_string(), WorkflowStepType::Notification);
        assert!(notification_step.validate().is_ok());
    }

    #[test]
    fn test_workflow_step_execution_readiness() {
        let step1 = WorkflowStep::new("Step 1".to_string(), WorkflowStepType::Command)
            .with_command("echo 'step 1'".to_string());
        let step1_id = step1.id.clone();
        
        let step2 = WorkflowStep::new("Step 2".to_string(), WorkflowStepType::Command)
            .with_command("echo 'step 2'".to_string())
            .depends_on_step(step1_id.clone());
        let step2_id = step2.id.clone();
        
        let step3 = WorkflowStep::new("Step 3".to_string(), WorkflowStepType::Command)
            .with_command("echo 'step 3'".to_string())
            .depends_on_step(step1_id.clone())
            .depends_on_step(step2_id.clone());
        
        // Step 1 should be ready (no dependencies)
        assert!(step1.is_ready_to_execute(&[]));
        
        // Step 2 should not be ready without step 1 completed
        assert!(!step2.is_ready_to_execute(&[]));
        assert!(step2.is_ready_to_execute(&[step1_id.clone()]));
        
        // Step 3 should not be ready without both dependencies
        assert!(!step3.is_ready_to_execute(&[]));
        assert!(!step3.is_ready_to_execute(&[step1_id.clone()]));
        assert!(!step3.is_ready_to_execute(&[step2_id.clone()]));
        assert!(step3.is_ready_to_execute(&[step1_id.clone(), step2_id.clone()]));
        
        // Test with non-pending status
        let mut completed_step = step1.clone();
        completed_step.status = WorkflowStepStatus::Completed;
        assert!(!completed_step.is_ready_to_execute(&[])); // Not pending
        
        let mut running_step = step1.clone();
        running_step.status = WorkflowStepStatus::Running;
        assert!(!running_step.is_ready_to_execute(&[])); // Not pending
    }

    #[test]
    fn test_workflow_creation() {
        let workflow = Workflow::new("Test Workflow".to_string(), "A test workflow".to_string());
        assert_eq!(workflow.name, "Test Workflow");
        assert_eq!(workflow.description, "A test workflow");
        assert_eq!(workflow.status, WorkflowStatus::Idle);
        assert!(workflow.enabled);
        assert!(workflow.triggers.is_empty());
        assert!(workflow.steps.is_empty());
        assert_eq!(workflow.environment_id, None);
        assert_eq!(workflow.execution_count, 0);
        assert!(workflow.last_executed.is_none());
        assert!(!workflow.id.is_empty());
        assert!(!workflow.can_execute()); // Should be false because no steps
    }

    #[test]
    fn test_workflow_trigger_management() {
        let mut workflow = Workflow::new("Test".to_string(), "Test workflow".to_string());
        
        let trigger1 = WorkflowTrigger::new(WorkflowTriggerType::Manual);
        let trigger1_id = trigger1.id.clone();
        
        let trigger2 = WorkflowTrigger::new(WorkflowTriggerType::FileChange)
            .with_condition("path".to_string(), "src/**/*.rs".to_string());
        let trigger2_id = trigger2.id.clone();
        
        // Add triggers
        workflow.add_trigger(trigger1).unwrap();
        workflow.add_trigger(trigger2).unwrap();
        
        assert_eq!(workflow.triggers.len(), 2);
        assert!(workflow.get_trigger(&trigger1_id).is_some());
        assert!(workflow.get_trigger(&trigger2_id).is_some());
        
        // Remove trigger
        workflow.remove_trigger(&trigger1_id);
        assert_eq!(workflow.triggers.len(), 1);
        assert!(workflow.get_trigger(&trigger1_id).is_none());
        assert!(workflow.get_trigger(&trigger2_id).is_some());
        
        // Try to add invalid trigger
        let invalid_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange); // Missing path condition
        assert!(workflow.add_trigger(invalid_trigger).is_err());
        assert_eq!(workflow.triggers.len(), 1); // Should remain unchanged
    }

    #[test]
    fn test_workflow_step_management() {
        let mut workflow = Workflow::new("Test".to_string(), "Test workflow".to_string());
        
        let step1 = WorkflowStep::new("Step 1".to_string(), WorkflowStepType::Command)
            .with_command("echo 'step 1'".to_string());
        let step1_id = step1.id.clone();
        
        let step2 = WorkflowStep::new("Step 2".to_string(), WorkflowStepType::Command)
            .with_command("echo 'step 2'".to_string())
            .depends_on_step(step1_id.clone());
        let step2_id = step2.id.clone();
        
        // Add steps
        workflow.add_step(step1).unwrap();
        workflow.add_step(step2).unwrap();
        
        assert_eq!(workflow.steps.len(), 2);
        assert!(workflow.get_step(&step1_id).is_some());
        assert!(workflow.get_step(&step2_id).is_some());
        
        // Test getting executable steps
        let executable = workflow.get_executable_steps(&[]);
        assert_eq!(executable.len(), 1); // Only step1 should be executable
        assert_eq!(executable[0].id, step1_id);
        
        let executable_after_step1 = workflow.get_executable_steps(&[step1_id.clone()]);
        assert_eq!(executable_after_step1.len(), 1); // Now step2 should be executable
        assert_eq!(executable_after_step1[0].id, step2_id);
        
        // Test mutable access
        if let Some(step_mut) = workflow.get_step_mut(&step1_id) {
            step_mut.status = WorkflowStepStatus::Completed;
        }
        assert_eq!(workflow.get_step(&step1_id).unwrap().status, WorkflowStepStatus::Completed);
        
        // Remove step (should also remove dependencies)
        workflow.remove_step(&step1_id);
        assert_eq!(workflow.steps.len(), 1);
        assert!(workflow.get_step(&step1_id).is_none());
        
        // Check that step2's dependency was removed
        let step2 = workflow.get_step(&step2_id).unwrap();
        assert!(step2.depends_on.is_empty());
        
        // Try to add invalid step
        let invalid_step = WorkflowStep::new("Invalid".to_string(), WorkflowStepType::Command); // Missing command
        assert!(workflow.add_step(invalid_step).is_err());
        assert_eq!(workflow.steps.len(), 1); // Should remain unchanged
    }

    #[test]
    fn test_workflow_validation() {
        let mut workflow = Workflow::new("Test".to_string(), "Test".to_string());
        
        // Empty workflow should fail validation (no steps)
        assert!(workflow.validate().is_err());
        
        // Workflow with empty name should fail
        workflow.name = "".to_string();
        let step = WorkflowStep::new("Test Step".to_string(), WorkflowStepType::Command)
            .with_command("echo 'test'".to_string());
        workflow.add_step(step).unwrap();
        assert!(workflow.validate().is_err());
        
        // Fix name and it should be valid
        workflow.name = "Valid Name".to_string();
        assert!(workflow.validate().is_ok());
        
        // Add invalid trigger
        let invalid_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange); // Missing path
        workflow.triggers.push(invalid_trigger);
        assert!(workflow.validate().is_err());
        
        // Remove invalid trigger and add valid one
        workflow.triggers.clear();
        let valid_trigger = WorkflowTrigger::new(WorkflowTriggerType::Manual);
        workflow.add_trigger(valid_trigger).unwrap();
        assert!(workflow.validate().is_ok());
        
        // Add invalid step
        let invalid_step = WorkflowStep {
            id: "invalid".to_string(),
            name: "Invalid Step".to_string(),
            step_type: WorkflowStepType::Command,
            command: None, // Missing command
            script_path: None,
            parameters: HashMap::new(),
            timeout_seconds: Some(300),
            retry_count: 0,
            continue_on_error: false,
            depends_on: Vec::new(),
            status: WorkflowStepStatus::Pending,
        };
        workflow.steps.push(invalid_step);
        assert!(workflow.validate().is_err());
    }

    #[test]
    fn test_circular_dependency_detection() {
        let mut workflow = Workflow::new("Test".to_string(), "Test".to_string());
        
        let step1 = WorkflowStep::new("Step 1".to_string(), WorkflowStepType::Command)
            .with_command("echo '1'".to_string());
        let step1_id = step1.id.clone();
        
        let step2 = WorkflowStep::new("Step 2".to_string(), WorkflowStepType::Command)
            .with_command("echo '2'".to_string())
            .depends_on_step(step1_id.clone());
        let step2_id = step2.id.clone();
        
        let step3 = WorkflowStep::new("Step 3".to_string(), WorkflowStepType::Command)
            .with_command("echo '3'".to_string())
            .depends_on_step(step2_id.clone());
        let step3_id = step3.id.clone();
        
        workflow.add_step(step1).unwrap();
        workflow.add_step(step2).unwrap();
        workflow.add_step(step3).unwrap();
        
        // Valid linear dependency chain
        assert!(workflow.validate().is_ok());
        
        // Create circular dependency: step1 -> step2 -> step3 -> step1
        if let Some(step1) = workflow.get_step_mut(&step1_id) {
            step1.depends_on.push(step3_id);
        }
        
        // Should now fail validation
        assert!(workflow.validate().is_err());
        
        // Test direct circular dependency: step1 -> step2 -> step1
        workflow.steps.clear();
        let step1 = WorkflowStep::new("Step 1".to_string(), WorkflowStepType::Command)
            .with_command("echo '1'".to_string());
        let step1_id = step1.id.clone();
        
        let step2 = WorkflowStep::new("Step 2".to_string(), WorkflowStepType::Command)
            .with_command("echo '2'".to_string())
            .depends_on_step(step1_id.clone());
        let step2_id = step2.id.clone();
        
        workflow.add_step(step1).unwrap();
        workflow.add_step(step2).unwrap();
        
        // Valid so far
        assert!(workflow.validate().is_ok());
        
        // Create direct circular dependency
        if let Some(step1) = workflow.get_step_mut(&step1_id) {
            step1.depends_on.push(step2_id);
        }
        
        // Should fail validation
        assert!(workflow.validate().is_err());
    }

    #[test]
    fn test_workflow_utility_methods() {
        let mut workflow = Workflow::new("Test".to_string(), "Test workflow".to_string());
        
        // Test environment setting
        workflow.set_environment("env-123".to_string());
        assert_eq!(workflow.environment_id, Some("env-123".to_string()));
        
        // Test enable/disable
        assert!(workflow.is_enabled());
        workflow.disable();
        assert!(!workflow.is_enabled());
        workflow.enable();
        assert!(workflow.is_enabled());
        
        // Test can_execute
        assert!(!workflow.can_execute()); // No steps
        
        let step = WorkflowStep::new("Test Step".to_string(), WorkflowStepType::Command)
            .with_command("echo 'test'".to_string());
        workflow.add_step(step).unwrap();
        assert!(workflow.can_execute()); // Has steps and is enabled
        
        workflow.disable();
        assert!(!workflow.can_execute()); // Disabled
        
        workflow.enable();
        workflow.status = WorkflowStatus::Running;
        assert!(!workflow.can_execute()); // Not idle
    }

    #[test]
    fn test_workflow_execution() {
        let execution = WorkflowExecution::new("workflow-123".to_string(), Some("trigger-456".to_string()));
        
        assert_eq!(execution.workflow_id, "workflow-123");
        assert_eq!(execution.trigger_id, Some("trigger-456".to_string()));
        assert_eq!(execution.status, WorkflowStatus::Running);
        assert!(execution.completed_at.is_none());
        assert!(execution.step_results.is_empty());
        assert!(execution.logs.is_empty());
        assert!(execution.error_message.is_none());
        assert!(!execution.id.is_empty());
        
        // Test without trigger
        let manual_execution = WorkflowExecution::new("workflow-123".to_string(), None);
        assert_eq!(manual_execution.trigger_id, None);
    }

    #[test]
    fn test_workflow_execution_management() {
        let mut execution = WorkflowExecution::new("workflow-123".to_string(), None);
        
        // Add step result
        let step_result = WorkflowStepResult {
            step_id: "step-1".to_string(),
            status: WorkflowStepStatus::Completed,
            started_at: Utc::now(),
            completed_at: Some(Utc::now()),
            output: Some("Step completed successfully".to_string()),
            error_message: None,
            exit_code: Some(0),
        };
        
        execution.add_step_result(step_result.clone());
        assert_eq!(execution.step_results.len(), 1);
        assert_eq!(execution.get_step_result("step-1").unwrap().status, WorkflowStepStatus::Completed);
        assert!(execution.get_step_result("non-existent").is_none());
        
        // Add logs
        execution.add_log("info".to_string(), "Starting execution".to_string(), None);
        execution.add_log("debug".to_string(), "Step 1 started".to_string(), Some("step-1".to_string()));
        execution.add_log("info".to_string(), "Step 1 completed".to_string(), Some("step-1".to_string()));
        
        assert_eq!(execution.logs.len(), 3);
        assert_eq!(execution.logs[0].level, "info");
        assert_eq!(execution.logs[0].step_id, None);
        assert_eq!(execution.logs[1].step_id, Some("step-1".to_string()));
        
        // Complete execution
        execution.complete(WorkflowStatus::Completed, None);
        assert_eq!(execution.status, WorkflowStatus::Completed);
        assert!(execution.completed_at.is_some());
        assert!(execution.error_message.is_none());
        
        // Test duration calculation
        let duration = execution.duration();
        assert!(duration.is_some());
        assert!(duration.unwrap().num_milliseconds() >= 0);
        
        // Test failed execution
        let mut failed_execution = WorkflowExecution::new("workflow-456".to_string(), None);
        failed_execution.complete(WorkflowStatus::Failed, Some("Execution failed".to_string()));
        assert_eq!(failed_execution.status, WorkflowStatus::Failed);
        assert_eq!(failed_execution.error_message, Some("Execution failed".to_string()));
    }

    #[test]
    fn test_workflow_result() {
        let result = WorkflowResult {
            execution_id: "exec-123".to_string(),
            workflow_id: "workflow-456".to_string(),
            status: WorkflowStatus::Completed,
            duration_seconds: 120,
            steps_completed: 5,
            steps_failed: 0,
            error_message: None,
        };
        
        // Test serialization
        let json = serde_json::to_string(&result).unwrap();
        let deserialized: WorkflowResult = serde_json::from_str(&json).unwrap();
        
        assert_eq!(result.execution_id, deserialized.execution_id);
        assert_eq!(result.workflow_id, deserialized.workflow_id);
        assert_eq!(result.status, deserialized.status);
        assert_eq!(result.duration_seconds, deserialized.duration_seconds);
        assert_eq!(result.steps_completed, deserialized.steps_completed);
        assert_eq!(result.steps_failed, deserialized.steps_failed);
        assert_eq!(result.error_message, deserialized.error_message);
    }

    #[test]
    fn test_complex_workflow_serialization() {
        let mut workflow = Workflow::new("Complex Workflow".to_string(), "A complex test workflow".to_string());
        
        // Add triggers
        let manual_trigger = WorkflowTrigger::new(WorkflowTriggerType::Manual);
        let file_trigger = WorkflowTrigger::new(WorkflowTriggerType::FileChange)
            .with_condition("path".to_string(), "src/**/*.rs".to_string())
            .with_condition("action".to_string(), "modified".to_string());
        
        workflow.add_trigger(manual_trigger).unwrap();
        workflow.add_trigger(file_trigger).unwrap();
        
        // Add steps with dependencies
        let step1 = WorkflowStep::new("Build".to_string(), WorkflowStepType::Command)
            .with_command("cargo build".to_string())
            .with_timeout(600)
            .with_retry(2);
        let step1_id = step1.id.clone();
        
        let step2 = WorkflowStep::new("Test".to_string(), WorkflowStepType::Command)
            .with_command("cargo test".to_string())
            .depends_on_step(step1_id.clone())
            .with_parameter("verbose".to_string(), "true".to_string());
        
        let step3 = WorkflowStep::new("Deploy".to_string(), WorkflowStepType::Script)
            .with_script("/scripts/deploy.sh".to_string())
            .depends_on_step(step1_id.clone())
            .with_parameter("environment".to_string(), "staging".to_string())
            .continue_on_error();
        
        workflow.add_step(step1).unwrap();
        workflow.add_step(step2).unwrap();
        workflow.add_step(step3).unwrap();
        
        workflow.set_environment("env-123".to_string());
        
        // Test JSON serialization
        let json = serde_json::to_string_pretty(&workflow).unwrap();
        let deserialized: Workflow = serde_json::from_str(&json).unwrap();
        
        assert_eq!(workflow.id, deserialized.id);
        assert_eq!(workflow.name, deserialized.name);
        assert_eq!(workflow.description, deserialized.description);
        assert_eq!(workflow.triggers.len(), deserialized.triggers.len());
        assert_eq!(workflow.steps.len(), deserialized.steps.len());
        assert_eq!(workflow.environment_id, deserialized.environment_id);
        assert_eq!(workflow.status, deserialized.status);
        assert_eq!(workflow.enabled, deserialized.enabled);
        
        // Verify trigger details
        let original_file_trigger = workflow.triggers.iter().find(|t| t.trigger_type == WorkflowTriggerType::FileChange).unwrap();
        let deserialized_file_trigger = deserialized.triggers.iter().find(|t| t.trigger_type == WorkflowTriggerType::FileChange).unwrap();
        assert_eq!(original_file_trigger.conditions, deserialized_file_trigger.conditions);
        
        // Verify step details
        let original_build_step = workflow.steps.iter().find(|s| s.name == "Build").unwrap();
        let deserialized_build_step = deserialized.steps.iter().find(|s| s.name == "Build").unwrap();
        assert_eq!(original_build_step.command, deserialized_build_step.command);
        assert_eq!(original_build_step.timeout_seconds, deserialized_build_step.timeout_seconds);
        assert_eq!(original_build_step.retry_count, deserialized_build_step.retry_count);
        
        let original_deploy_step = workflow.steps.iter().find(|s| s.name == "Deploy").unwrap();
        let deserialized_deploy_step = deserialized.steps.iter().find(|s| s.name == "Deploy").unwrap();
        assert_eq!(original_deploy_step.script_path, deserialized_deploy_step.script_path);
        assert_eq!(original_deploy_step.parameters, deserialized_deploy_step.parameters);
        assert_eq!(original_deploy_step.continue_on_error, deserialized_deploy_step.continue_on_error);
        assert_eq!(original_deploy_step.depends_on, deserialized_deploy_step.depends_on);
    }
}