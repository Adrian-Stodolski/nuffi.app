use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::error::AIError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum AnalysisType {
    CodeQuality,
    Security,
    Performance,
    Dependencies,
    Architecture,
    Documentation,
    Testing,
    Full,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum InsightCategory {
    CodeSmell,
    SecurityVulnerability,
    PerformanceIssue,
    BestPractice,
    Documentation,
    Testing,
    Architecture,
    Dependency,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SuggestionType {
    CodeImprovement,
    Refactoring,
    SecurityFix,
    PerformanceOptimization,
    Documentation,
    Testing,
    DependencyUpdate,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CodeLocation {
    pub file_path: String,
    pub line_start: u32,
    pub line_end: Option<u32>,
    pub column_start: Option<u32>,
    pub column_end: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisContext {
    pub project_path: String,
    pub file_patterns: Vec<String>,
    pub exclude_patterns: Vec<String>,
    pub language: Option<String>,
    pub framework: Option<String>,
    pub additional_context: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelPreferences {
    pub preferred_model: Option<String>,
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
    pub analysis_depth: Option<String>, // "shallow", "medium", "deep"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisRequest {
    pub id: String,
    pub path: String,
    pub analysis_type: AnalysisType,
    pub context: AnalysisContext,
    pub model_preferences: ModelPreferences,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeInsight {
    pub id: String,
    pub category: InsightCategory,
    pub severity: Severity,
    pub title: String,
    pub message: String,
    pub location: Option<CodeLocation>,
    pub suggested_fix: Option<String>,
    pub confidence: f32, // 0.0 to 1.0
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Suggestion {
    pub id: String,
    pub suggestion_type: SuggestionType,
    pub title: String,
    pub description: String,
    pub code_before: Option<String>,
    pub code_after: Option<String>,
    pub location: Option<CodeLocation>,
    pub impact: String,
    pub effort: String, // "low", "medium", "high"
    pub priority: u32, // 1-10
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisMetrics {
    pub files_analyzed: u32,
    pub lines_of_code: u32,
    pub analysis_duration_ms: u64,
    pub model_tokens_used: Option<u32>,
    pub api_calls_made: u32,
    pub insights_found: u32,
    pub suggestions_generated: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub id: String,
    pub request_id: String,
    pub timestamp: DateTime<Utc>,
    pub path: String,
    pub model_used: String,
    pub analysis_type: AnalysisType,
    pub insights: Vec<CodeInsight>,
    pub suggestions: Vec<Suggestion>,
    pub metrics: AnalysisMetrics,
    pub summary: String,
    pub status: AnalysisStatus,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AnalysisStatus {
    Pending,
    InProgress,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub name: String,
    pub provider: String,
    pub version: Option<String>,
    pub capabilities: Vec<String>,
    pub max_tokens: Option<u32>,
    pub supports_streaming: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIUsageStats {
    pub total_requests: u64,
    pub successful_requests: u64,
    pub failed_requests: u64,
    pub total_tokens_used: u64,
    pub average_response_time_ms: f64,
    pub models_used: HashMap<String, u64>,
    pub analysis_types: HashMap<AnalysisType, u64>,
}

impl Default for AnalysisContext {
    fn default() -> Self {
        Self {
            project_path: ".".to_string(),
            file_patterns: vec!["**/*.rs".to_string(), "**/*.js".to_string(), "**/*.ts".to_string()],
            exclude_patterns: vec!["**/node_modules/**".to_string(), "**/target/**".to_string()],
            language: None,
            framework: None,
            additional_context: HashMap::new(),
        }
    }
}

impl Default for ModelPreferences {
    fn default() -> Self {
        Self {
            preferred_model: None,
            temperature: Some(0.3),
            max_tokens: Some(4000),
            analysis_depth: Some("medium".to_string()),
        }
    }
}

impl AnalysisRequest {
    pub fn new(path: String, analysis_type: AnalysisType) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            path,
            analysis_type,
            context: AnalysisContext::default(),
            model_preferences: ModelPreferences::default(),
            created_at: Utc::now(),
        }
    }

    pub fn with_context(mut self, context: AnalysisContext) -> Self {
        self.context = context;
        self
    }

    pub fn with_model_preferences(mut self, preferences: ModelPreferences) -> Self {
        self.model_preferences = preferences;
        self
    }

    pub fn validate(&self) -> Result<(), AIError> {
        if self.path.trim().is_empty() {
            return Err(AIError::AnalysisFailed("Analysis path cannot be empty".to_string()));
        }

        if let Some(temp) = self.model_preferences.temperature {
            if temp < 0.0 || temp > 2.0 {
                return Err(AIError::AnalysisFailed("Temperature must be between 0.0 and 2.0".to_string()));
            }
        }

        if let Some(max_tokens) = self.model_preferences.max_tokens {
            if max_tokens == 0 {
                return Err(AIError::AnalysisFailed("Max tokens must be greater than 0".to_string()));
            }
        }

        Ok(())
    }
}

impl CodeInsight {
    pub fn new(
        category: InsightCategory,
        severity: Severity,
        title: String,
        message: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            category,
            severity,
            title,
            message,
            location: None,
            suggested_fix: None,
            confidence: 1.0,
            tags: Vec::new(),
        }
    }

    pub fn with_location(mut self, location: CodeLocation) -> Self {
        self.location = Some(location);
        self
    }

    pub fn with_suggested_fix(mut self, fix: String) -> Self {
        self.suggested_fix = Some(fix);
        self
    }

    pub fn with_confidence(mut self, confidence: f32) -> Self {
        self.confidence = confidence.clamp(0.0, 1.0);
        self
    }

    pub fn with_tags(mut self, tags: Vec<String>) -> Self {
        self.tags = tags;
        self
    }

    pub fn is_actionable(&self) -> bool {
        self.suggested_fix.is_some() && self.confidence > 0.5
    }

    pub fn severity_score(&self) -> u32 {
        match self.severity {
            Severity::Low => 1,
            Severity::Medium => 2,
            Severity::High => 3,
            Severity::Critical => 4,
        }
    }
}

impl Suggestion {
    pub fn new(
        suggestion_type: SuggestionType,
        title: String,
        description: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            suggestion_type,
            title,
            description,
            code_before: None,
            code_after: None,
            location: None,
            impact: "medium".to_string(),
            effort: "medium".to_string(),
            priority: 5,
            tags: Vec::new(),
        }
    }

    pub fn with_code_change(mut self, before: String, after: String) -> Self {
        self.code_before = Some(before);
        self.code_after = Some(after);
        self
    }

    pub fn with_location(mut self, location: CodeLocation) -> Self {
        self.location = Some(location);
        self
    }

    pub fn with_impact(mut self, impact: String) -> Self {
        self.impact = impact;
        self
    }

    pub fn with_effort(mut self, effort: String) -> Self {
        self.effort = effort;
        self
    }

    pub fn with_priority(mut self, priority: u32) -> Self {
        self.priority = priority.clamp(1, 10);
        self
    }

    pub fn with_tags(mut self, tags: Vec<String>) -> Self {
        self.tags = tags;
        self
    }

    pub fn is_high_priority(&self) -> bool {
        self.priority >= 7
    }

    pub fn has_code_example(&self) -> bool {
        self.code_before.is_some() && self.code_after.is_some()
    }
}

impl AnalysisResult {
    pub fn new(
        request_id: String,
        path: String,
        model_used: String,
        analysis_type: AnalysisType,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            request_id,
            timestamp: Utc::now(),
            path,
            model_used,
            analysis_type,
            insights: Vec::new(),
            suggestions: Vec::new(),
            metrics: AnalysisMetrics::default(),
            summary: String::new(),
            status: AnalysisStatus::Pending,
            error_message: None,
        }
    }

    pub fn add_insight(&mut self, insight: CodeInsight) {
        self.insights.push(insight);
    }

    pub fn add_suggestion(&mut self, suggestion: Suggestion) {
        self.suggestions.push(suggestion);
    }

    pub fn set_status(&mut self, status: AnalysisStatus) {
        self.status = status;
    }

    pub fn set_error(&mut self, error: String) {
        self.status = AnalysisStatus::Failed;
        self.error_message = Some(error);
    }

    pub fn complete(&mut self, summary: String, metrics: AnalysisMetrics) {
        self.status = AnalysisStatus::Completed;
        self.summary = summary;
        self.metrics = metrics;
    }

    pub fn get_insights_by_severity(&self, severity: Severity) -> Vec<&CodeInsight> {
        self.insights.iter().filter(|i| i.severity == severity).collect()
    }

    pub fn get_suggestions_by_type(&self, suggestion_type: SuggestionType) -> Vec<&Suggestion> {
        self.suggestions.iter().filter(|s| s.suggestion_type == suggestion_type).collect()
    }

    pub fn get_high_priority_suggestions(&self) -> Vec<&Suggestion> {
        self.suggestions.iter().filter(|s| s.is_high_priority()).collect()
    }

    pub fn get_actionable_insights(&self) -> Vec<&CodeInsight> {
        self.insights.iter().filter(|i| i.is_actionable()).collect()
    }

    pub fn has_critical_issues(&self) -> bool {
        self.insights.iter().any(|i| i.severity == Severity::Critical)
    }

    pub fn total_issues(&self) -> usize {
        self.insights.len()
    }

    pub fn total_suggestions(&self) -> usize {
        self.suggestions.len()
    }
}

impl Default for AnalysisMetrics {
    fn default() -> Self {
        Self {
            files_analyzed: 0,
            lines_of_code: 0,
            analysis_duration_ms: 0,
            model_tokens_used: None,
            api_calls_made: 0,
            insights_found: 0,
            suggestions_generated: 0,
        }
    }
}

impl ModelInfo {
    pub fn new(name: String, provider: String) -> Self {
        Self {
            name,
            provider,
            version: None,
            capabilities: Vec::new(),
            max_tokens: None,
            supports_streaming: false,
        }
    }

    pub fn with_version(mut self, version: String) -> Self {
        self.version = Some(version);
        self
    }

    pub fn with_capabilities(mut self, capabilities: Vec<String>) -> Self {
        self.capabilities = capabilities;
        self
    }

    pub fn with_max_tokens(mut self, max_tokens: u32) -> Self {
        self.max_tokens = Some(max_tokens);
        self
    }

    pub fn with_streaming(mut self, supports_streaming: bool) -> Self {
        self.supports_streaming = supports_streaming;
        self
    }

    pub fn supports_capability(&self, capability: &str) -> bool {
        self.capabilities.iter().any(|c| c == capability)
    }
}

impl Default for AIUsageStats {
    fn default() -> Self {
        Self {
            total_requests: 0,
            successful_requests: 0,
            failed_requests: 0,
            total_tokens_used: 0,
            average_response_time_ms: 0.0,
            models_used: HashMap::new(),
            analysis_types: HashMap::new(),
        }
    }
}

impl AIUsageStats {
    pub fn record_request(&mut self, model: &str, analysis_type: AnalysisType, success: bool, tokens: u32, response_time_ms: u64) {
        self.total_requests += 1;
        if success {
            self.successful_requests += 1;
        } else {
            self.failed_requests += 1;
        }
        
        self.total_tokens_used += tokens as u64;
        
        // Update average response time
        let total_time = self.average_response_time_ms * (self.total_requests - 1) as f64 + response_time_ms as f64;
        self.average_response_time_ms = total_time / self.total_requests as f64;
        
        // Update model usage
        *self.models_used.entry(model.to_string()).or_insert(0) += 1;
        
        // Update analysis type usage
        *self.analysis_types.entry(analysis_type).or_insert(0) += 1;
    }

    pub fn success_rate(&self) -> f64 {
        if self.total_requests == 0 {
            0.0
        } else {
            self.successful_requests as f64 / self.total_requests as f64
        }
    }

    pub fn most_used_model(&self) -> Option<String> {
        self.models_used
            .iter()
            .max_by_key(|(_, count)| *count)
            .map(|(model, _)| model.clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_analysis_type_serialization() {
        let types = vec![
            AnalysisType::CodeQuality,
            AnalysisType::Security,
            AnalysisType::Performance,
            AnalysisType::Dependencies,
            AnalysisType::Architecture,
            AnalysisType::Documentation,
            AnalysisType::Testing,
            AnalysisType::Full,
        ];
        
        for analysis_type in types {
            let json = serde_json::to_string(&analysis_type).unwrap();
            let deserialized: AnalysisType = serde_json::from_str(&json).unwrap();
            assert_eq!(analysis_type, deserialized);
        }
    }

    #[test]
    fn test_insight_category_serialization() {
        let categories = vec![
            InsightCategory::CodeSmell,
            InsightCategory::SecurityVulnerability,
            InsightCategory::PerformanceIssue,
            InsightCategory::BestPractice,
            InsightCategory::Documentation,
            InsightCategory::Testing,
            InsightCategory::Architecture,
            InsightCategory::Dependency,
        ];
        
        for category in categories {
            let json = serde_json::to_string(&category).unwrap();
            let deserialized: InsightCategory = serde_json::from_str(&json).unwrap();
            assert_eq!(category, deserialized);
        }
    }

    #[test]
    fn test_severity_serialization() {
        let severities = vec![
            Severity::Low,
            Severity::Medium,
            Severity::High,
            Severity::Critical,
        ];
        
        for severity in severities {
            let json = serde_json::to_string(&severity).unwrap();
            let deserialized: Severity = serde_json::from_str(&json).unwrap();
            assert_eq!(severity, deserialized);
        }
    }

    #[test]
    fn test_suggestion_type_serialization() {
        let types = vec![
            SuggestionType::CodeImprovement,
            SuggestionType::Refactoring,
            SuggestionType::SecurityFix,
            SuggestionType::PerformanceOptimization,
            SuggestionType::Documentation,
            SuggestionType::Testing,
            SuggestionType::DependencyUpdate,
        ];
        
        for suggestion_type in types {
            let json = serde_json::to_string(&suggestion_type).unwrap();
            let deserialized: SuggestionType = serde_json::from_str(&json).unwrap();
            assert_eq!(suggestion_type, deserialized);
        }
    }

    #[test]
    fn test_analysis_status_serialization() {
        let statuses = vec![
            AnalysisStatus::Pending,
            AnalysisStatus::InProgress,
            AnalysisStatus::Completed,
            AnalysisStatus::Failed,
            AnalysisStatus::Cancelled,
        ];
        
        for status in statuses {
            let json = serde_json::to_string(&status).unwrap();
            let deserialized: AnalysisStatus = serde_json::from_str(&json).unwrap();
            assert_eq!(status, deserialized);
        }
    }

    #[test]
    fn test_analysis_context_default() {
        let context = AnalysisContext::default();
        assert_eq!(context.project_path, ".");
        assert_eq!(context.file_patterns.len(), 3);
        assert!(context.file_patterns.contains(&"**/*.rs".to_string()));
        assert!(context.file_patterns.contains(&"**/*.js".to_string()));
        assert!(context.file_patterns.contains(&"**/*.ts".to_string()));
        assert_eq!(context.exclude_patterns.len(), 2);
        assert!(context.exclude_patterns.contains(&"**/node_modules/**".to_string()));
        assert!(context.exclude_patterns.contains(&"**/target/**".to_string()));
        assert_eq!(context.language, None);
        assert_eq!(context.framework, None);
        assert!(context.additional_context.is_empty());
    }

    #[test]
    fn test_model_preferences_default() {
        let preferences = ModelPreferences::default();
        assert_eq!(preferences.preferred_model, None);
        assert_eq!(preferences.temperature, Some(0.3));
        assert_eq!(preferences.max_tokens, Some(4000));
        assert_eq!(preferences.analysis_depth, Some("medium".to_string()));
    }

    #[test]
    fn test_analysis_request_creation() {
        let request = AnalysisRequest::new("./src".to_string(), AnalysisType::CodeQuality);
        assert_eq!(request.path, "./src");
        assert_eq!(request.analysis_type, AnalysisType::CodeQuality);
        assert!(!request.id.is_empty());
        assert!(request.validate().is_ok());
        
        // Test with custom context and preferences
        let mut context = AnalysisContext::default();
        context.language = Some("rust".to_string());
        context.framework = Some("tauri".to_string());
        context.additional_context.insert("version".to_string(), "1.0.0".to_string());
        
        let mut preferences = ModelPreferences::default();
        preferences.preferred_model = Some("gpt-4".to_string());
        preferences.temperature = Some(0.7);
        preferences.analysis_depth = Some("deep".to_string());
        
        let custom_request = AnalysisRequest::new("./custom".to_string(), AnalysisType::Security)
            .with_context(context.clone())
            .with_model_preferences(preferences.clone());
        
        assert_eq!(custom_request.context.language, Some("rust".to_string()));
        assert_eq!(custom_request.context.framework, Some("tauri".to_string()));
        assert_eq!(custom_request.model_preferences.preferred_model, Some("gpt-4".to_string()));
        assert_eq!(custom_request.model_preferences.temperature, Some(0.7));
    }

    #[test]
    fn test_analysis_request_validation() {
        let mut request = AnalysisRequest::new("./src".to_string(), AnalysisType::CodeQuality);
        assert!(request.validate().is_ok());
        
        // Test empty path
        request.path = "".to_string();
        assert!(request.validate().is_err());
        
        // Test whitespace-only path
        request.path = "   ".to_string();
        assert!(request.validate().is_err());
        
        // Reset path and test invalid temperature
        request.path = "./src".to_string();
        request.model_preferences.temperature = Some(3.0);
        assert!(request.validate().is_err());
        
        // Test negative temperature
        request.model_preferences.temperature = Some(-0.1);
        assert!(request.validate().is_err());
        
        // Reset temperature and test zero max tokens
        request.model_preferences.temperature = Some(0.3);
        request.model_preferences.max_tokens = Some(0);
        assert!(request.validate().is_err());
    }

    #[test]
    fn test_code_location() {
        let location = CodeLocation {
            file_path: "src/main.rs".to_string(),
            line_start: 10,
            line_end: Some(15),
            column_start: Some(5),
            column_end: Some(20),
        };
        
        // Test serialization
        let json = serde_json::to_string(&location).unwrap();
        let deserialized: CodeLocation = serde_json::from_str(&json).unwrap();
        
        assert_eq!(location.file_path, deserialized.file_path);
        assert_eq!(location.line_start, deserialized.line_start);
        assert_eq!(location.line_end, deserialized.line_end);
        assert_eq!(location.column_start, deserialized.column_start);
        assert_eq!(location.column_end, deserialized.column_end);
    }

    #[test]
    fn test_code_insight_creation() {
        let insight = CodeInsight::new(
            InsightCategory::CodeSmell,
            Severity::Medium,
            "Unused variable".to_string(),
            "Variable 'x' is declared but never used".to_string(),
        );
        
        assert_eq!(insight.category, InsightCategory::CodeSmell);
        assert_eq!(insight.severity, Severity::Medium);
        assert_eq!(insight.title, "Unused variable");
        assert_eq!(insight.message, "Variable 'x' is declared but never used");
        assert_eq!(insight.confidence, 1.0);
        assert!(insight.tags.is_empty());
        assert!(insight.location.is_none());
        assert!(insight.suggested_fix.is_none());
        assert!(!insight.id.is_empty());
        
        // Test builder pattern
        let location = CodeLocation {
            file_path: "src/main.rs".to_string(),
            line_start: 10,
            line_end: None,
            column_start: Some(5),
            column_end: Some(10),
        };
        
        let enhanced_insight = CodeInsight::new(
            InsightCategory::SecurityVulnerability,
            Severity::High,
            "SQL Injection".to_string(),
            "Potential SQL injection vulnerability".to_string(),
        )
        .with_location(location.clone())
        .with_suggested_fix("Use parameterized queries".to_string())
        .with_confidence(0.8)
        .with_tags(vec!["security".to_string(), "database".to_string()]);
        
        assert_eq!(enhanced_insight.location, Some(location));
        assert_eq!(enhanced_insight.suggested_fix, Some("Use parameterized queries".to_string()));
        assert_eq!(enhanced_insight.confidence, 0.8);
        assert_eq!(enhanced_insight.tags, vec!["security".to_string(), "database".to_string()]);
        assert!(enhanced_insight.is_actionable());
    }

    #[test]
    fn test_code_insight_severity_score() {
        let low = CodeInsight::new(InsightCategory::CodeSmell, Severity::Low, "".to_string(), "".to_string());
        let medium = CodeInsight::new(InsightCategory::CodeSmell, Severity::Medium, "".to_string(), "".to_string());
        let high = CodeInsight::new(InsightCategory::CodeSmell, Severity::High, "".to_string(), "".to_string());
        let critical = CodeInsight::new(InsightCategory::CodeSmell, Severity::Critical, "".to_string(), "".to_string());
        
        assert_eq!(low.severity_score(), 1);
        assert_eq!(medium.severity_score(), 2);
        assert_eq!(high.severity_score(), 3);
        assert_eq!(critical.severity_score(), 4);
    }

    #[test]
    fn test_code_insight_actionable() {
        let mut insight = CodeInsight::new(
            InsightCategory::CodeSmell,
            Severity::Medium,
            "Test".to_string(),
            "Test message".to_string(),
        );
        
        // Not actionable without suggested fix
        assert!(!insight.is_actionable());
        
        // Still not actionable with low confidence
        insight = insight.with_confidence(0.3).with_suggested_fix("Fix it".to_string());
        assert!(!insight.is_actionable());
        
        // Actionable with high confidence and suggested fix
        insight = insight.with_confidence(0.8);
        assert!(insight.is_actionable());
    }

    #[test]
    fn test_suggestion_creation() {
        let suggestion = Suggestion::new(
            SuggestionType::CodeImprovement,
            "Improve function".to_string(),
            "This function can be optimized".to_string(),
        );
        
        assert_eq!(suggestion.suggestion_type, SuggestionType::CodeImprovement);
        assert_eq!(suggestion.title, "Improve function");
        assert_eq!(suggestion.description, "This function can be optimized");
        assert_eq!(suggestion.impact, "medium");
        assert_eq!(suggestion.effort, "medium");
        assert_eq!(suggestion.priority, 5);
        assert!(suggestion.tags.is_empty());
        assert!(suggestion.code_before.is_none());
        assert!(suggestion.code_after.is_none());
        assert!(suggestion.location.is_none());
        assert!(!suggestion.id.is_empty());
        
        // Test builder pattern
        let location = CodeLocation {
            file_path: "src/lib.rs".to_string(),
            line_start: 20,
            line_end: Some(25),
            column_start: None,
            column_end: None,
        };
        
        let enhanced_suggestion = Suggestion::new(
            SuggestionType::Refactoring,
            "Extract method".to_string(),
            "Extract this code into a separate method".to_string(),
        )
        .with_code_change(
            "fn long_function() { /* lots of code */ }".to_string(),
            "fn long_function() { helper_method(); } fn helper_method() { /* extracted code */ }".to_string(),
        )
        .with_location(location.clone())
        .with_impact("high".to_string())
        .with_effort("low".to_string())
        .with_priority(8)
        .with_tags(vec!["refactoring".to_string(), "maintainability".to_string()]);
        
        assert!(enhanced_suggestion.has_code_example());
        assert_eq!(enhanced_suggestion.location, Some(location));
        assert_eq!(enhanced_suggestion.impact, "high");
        assert_eq!(enhanced_suggestion.effort, "low");
        assert_eq!(enhanced_suggestion.priority, 8);
        assert!(enhanced_suggestion.is_high_priority());
        assert_eq!(enhanced_suggestion.tags, vec!["refactoring".to_string(), "maintainability".to_string()]);
    }

    #[test]
    fn test_suggestion_priority() {
        let mut suggestion = Suggestion::new(
            SuggestionType::CodeImprovement,
            "Test".to_string(),
            "Test description".to_string(),
        );
        
        // Test priority clamping
        suggestion = suggestion.with_priority(15); // Should clamp to 10
        assert_eq!(suggestion.priority, 10);
        
        suggestion = suggestion.with_priority(0); // Should clamp to 1
        assert_eq!(suggestion.priority, 1);
        
        // Test high priority detection
        suggestion = suggestion.with_priority(7);
        assert!(suggestion.is_high_priority());
        
        suggestion = suggestion.with_priority(6);
        assert!(!suggestion.is_high_priority());
    }

    #[test]
    fn test_analysis_metrics_default() {
        let metrics = AnalysisMetrics::default();
        assert_eq!(metrics.files_analyzed, 0);
        assert_eq!(metrics.lines_of_code, 0);
        assert_eq!(metrics.analysis_duration_ms, 0);
        assert_eq!(metrics.model_tokens_used, None);
        assert_eq!(metrics.api_calls_made, 0);
        assert_eq!(metrics.insights_found, 0);
        assert_eq!(metrics.suggestions_generated, 0);
    }

    #[test]
    fn test_analysis_result_creation() {
        let result = AnalysisResult::new(
            "req-123".to_string(),
            "./src".to_string(),
            "gpt-4".to_string(),
            AnalysisType::Full,
        );
        
        assert_eq!(result.request_id, "req-123");
        assert_eq!(result.path, "./src");
        assert_eq!(result.model_used, "gpt-4");
        assert_eq!(result.analysis_type, AnalysisType::Full);
        assert_eq!(result.status, AnalysisStatus::Pending);
        assert!(result.insights.is_empty());
        assert!(result.suggestions.is_empty());
        assert!(result.summary.is_empty());
        assert!(result.error_message.is_none());
        assert!(!result.id.is_empty());
    }

    #[test]
    fn test_analysis_result_management() {
        let mut result = AnalysisResult::new(
            "req-1".to_string(),
            "./src".to_string(),
            "gpt-4".to_string(),
            AnalysisType::Full,
        );
        
        // Add insights
        let critical_insight = CodeInsight::new(
            InsightCategory::SecurityVulnerability,
            Severity::Critical,
            "SQL Injection".to_string(),
            "Potential SQL injection vulnerability".to_string(),
        );
        
        let low_insight = CodeInsight::new(
            InsightCategory::CodeSmell,
            Severity::Low,
            "Minor issue".to_string(),
            "Minor code smell detected".to_string(),
        );
        
        result.add_insight(critical_insight);
        result.add_insight(low_insight);
        
        // Add suggestions
        let high_priority_suggestion = Suggestion::new(
            SuggestionType::SecurityFix,
            "Fix security issue".to_string(),
            "Address the security vulnerability".to_string(),
        ).with_priority(9);
        
        let low_priority_suggestion = Suggestion::new(
            SuggestionType::CodeImprovement,
            "Minor improvement".to_string(),
            "Small code improvement".to_string(),
        ).with_priority(3);
        
        result.add_suggestion(high_priority_suggestion);
        result.add_suggestion(low_priority_suggestion);
        
        // Test filtering methods
        assert!(result.has_critical_issues());
        assert_eq!(result.get_insights_by_severity(Severity::Critical).len(), 1);
        assert_eq!(result.get_insights_by_severity(Severity::Low).len(), 1);
        assert_eq!(result.get_insights_by_severity(Severity::Medium).len(), 0);
        
        assert_eq!(result.get_suggestions_by_type(SuggestionType::SecurityFix).len(), 1);
        assert_eq!(result.get_suggestions_by_type(SuggestionType::CodeImprovement).len(), 1);
        assert_eq!(result.get_suggestions_by_type(SuggestionType::Refactoring).len(), 0);
        
        assert_eq!(result.get_high_priority_suggestions().len(), 1);
        assert_eq!(result.total_issues(), 2);
        assert_eq!(result.total_suggestions(), 2);
        
        // Test status management
        result.set_status(AnalysisStatus::InProgress);
        assert_eq!(result.status, AnalysisStatus::InProgress);
        
        result.set_error("Analysis failed".to_string());
        assert_eq!(result.status, AnalysisStatus::Failed);
        assert_eq!(result.error_message, Some("Analysis failed".to_string()));
        
        let metrics = AnalysisMetrics {
            files_analyzed: 10,
            lines_of_code: 1000,
            analysis_duration_ms: 5000,
            model_tokens_used: Some(2000),
            api_calls_made: 3,
            insights_found: 2,
            suggestions_generated: 2,
        };
        
        result.complete("Analysis completed successfully".to_string(), metrics.clone());
        assert_eq!(result.status, AnalysisStatus::Completed);
        assert_eq!(result.summary, "Analysis completed successfully");
        assert_eq!(result.metrics.files_analyzed, metrics.files_analyzed);
    }

    #[test]
    fn test_model_info() {
        let model = ModelInfo::new("gpt-4".to_string(), "openai".to_string())
            .with_version("2024-01-01".to_string())
            .with_capabilities(vec!["code_analysis".to_string(), "text_generation".to_string()])
            .with_max_tokens(8000)
            .with_streaming(true);
        
        assert_eq!(model.name, "gpt-4");
        assert_eq!(model.provider, "openai");
        assert_eq!(model.version, Some("2024-01-01".to_string()));
        assert_eq!(model.capabilities.len(), 2);
        assert_eq!(model.max_tokens, Some(8000));
        assert!(model.supports_streaming);
        
        assert!(model.supports_capability("code_analysis"));
        assert!(!model.supports_capability("image_analysis"));
    }

    #[test]
    fn test_ai_usage_stats() {
        let mut stats = AIUsageStats::default();
        assert_eq!(stats.total_requests, 0);
        assert_eq!(stats.successful_requests, 0);
        assert_eq!(stats.failed_requests, 0);
        assert_eq!(stats.total_tokens_used, 0);
        assert_eq!(stats.average_response_time_ms, 0.0);
        assert!(stats.models_used.is_empty());
        assert!(stats.analysis_types.is_empty());
        assert_eq!(stats.success_rate(), 0.0);
        assert_eq!(stats.most_used_model(), None);
        
        // Record some requests
        stats.record_request("gpt-4", AnalysisType::CodeQuality, true, 1000, 2000);
        stats.record_request("gpt-4", AnalysisType::Security, false, 500, 1500);
        stats.record_request("claude-3", AnalysisType::CodeQuality, true, 800, 1800);
        
        assert_eq!(stats.total_requests, 3);
        assert_eq!(stats.successful_requests, 2);
        assert_eq!(stats.failed_requests, 1);
        assert_eq!(stats.total_tokens_used, 2300);
        assert_eq!(stats.success_rate(), 2.0 / 3.0);
        assert_eq!(stats.most_used_model(), Some("gpt-4".to_string()));
        
        // Check model usage
        assert_eq!(stats.models_used.get("gpt-4"), Some(&2));
        assert_eq!(stats.models_used.get("claude-3"), Some(&1));
        
        // Check analysis type usage
        assert_eq!(stats.analysis_types.get(&AnalysisType::CodeQuality), Some(&2));
        assert_eq!(stats.analysis_types.get(&AnalysisType::Security), Some(&1));
        
        // Test average response time calculation
        let expected_avg = (2000.0 + 1500.0 + 1800.0) / 3.0;
        assert!((stats.average_response_time_ms - expected_avg).abs() < 0.001);
    }

    #[test]
    fn test_complex_serialization() {
        // Create a complex analysis result with all fields populated
        let mut result = AnalysisResult::new(
            "req-complex".to_string(),
            "./complex/src".to_string(),
            "gpt-4-turbo".to_string(),
            AnalysisType::Full,
        );
        
        let location = CodeLocation {
            file_path: "src/complex.rs".to_string(),
            line_start: 42,
            line_end: Some(45),
            column_start: Some(10),
            column_end: Some(25),
        };
        
        let insight = CodeInsight::new(
            InsightCategory::PerformanceIssue,
            Severity::High,
            "Inefficient algorithm".to_string(),
            "This algorithm has O(n²) complexity".to_string(),
        )
        .with_location(location.clone())
        .with_suggested_fix("Use a hash map for O(1) lookups".to_string())
        .with_confidence(0.95)
        .with_tags(vec!["performance".to_string(), "algorithm".to_string()]);
        
        let suggestion = Suggestion::new(
            SuggestionType::PerformanceOptimization,
            "Optimize lookup".to_string(),
            "Replace linear search with hash map lookup".to_string(),
        )
        .with_code_change(
            "for item in items { if item.id == target_id { return item; } }".to_string(),
            "items_map.get(&target_id)".to_string(),
        )
        .with_location(location.clone())
        .with_impact("high".to_string())
        .with_effort("medium".to_string())
        .with_priority(8)
        .with_tags(vec!["performance".to_string(), "optimization".to_string()]);
        
        result.add_insight(insight);
        result.add_suggestion(suggestion);
        
        let metrics = AnalysisMetrics {
            files_analyzed: 25,
            lines_of_code: 5000,
            analysis_duration_ms: 15000,
            model_tokens_used: Some(3500),
            api_calls_made: 5,
            insights_found: 1,
            suggestions_generated: 1,
        };
        
        result.complete("Complex analysis completed".to_string(), metrics);
        
        // Test JSON serialization and deserialization
        let json_str = serde_json::to_string_pretty(&result).unwrap();
        let deserialized: AnalysisResult = serde_json::from_str(&json_str).unwrap();
        
        assert_eq!(result.id, deserialized.id);
        assert_eq!(result.request_id, deserialized.request_id);
        assert_eq!(result.path, deserialized.path);
        assert_eq!(result.model_used, deserialized.model_used);
        assert_eq!(result.analysis_type, deserialized.analysis_type);
        assert_eq!(result.status, deserialized.status);
        assert_eq!(result.summary, deserialized.summary);
        assert_eq!(result.insights.len(), deserialized.insights.len());
        assert_eq!(result.suggestions.len(), deserialized.suggestions.len());
        
        // Verify insight details
        let original_insight = &result.insights[0];
        let deserialized_insight = &deserialized.insights[0];
        assert_eq!(original_insight.category, deserialized_insight.category);
        assert_eq!(original_insight.severity, deserialized_insight.severity);
        assert_eq!(original_insight.confidence, deserialized_insight.confidence);
        assert_eq!(original_insight.tags, deserialized_insight.tags);
        
        // Verify suggestion details
        let original_suggestion = &result.suggestions[0];
        let deserialized_suggestion = &deserialized.suggestions[0];
        assert_eq!(original_suggestion.suggestion_type, deserialized_suggestion.suggestion_type);
        assert_eq!(original_suggestion.priority, deserialized_suggestion.priority);
        assert_eq!(original_suggestion.code_before, deserialized_suggestion.code_before);
        assert_eq!(original_suggestion.code_after, deserialized_suggestion.code_after);
        assert_eq!(original_suggestion.tags, deserialized_suggestion.tags);
    }
}