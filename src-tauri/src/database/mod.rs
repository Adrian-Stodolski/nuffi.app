// NUFFI V2.0 - Database Module
// SQLite integration for local data persistence

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize)]
pub struct Environment {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub description: Option<String>,
    pub env_type: String,
    pub version: Option<String>,
    pub status: String,
    pub path: Option<String>,
    pub port: Option<i32>,
    pub cpu_usage: f64,
    pub memory_usage: f64,
    pub disk_usage: i64,
    pub preset_id: Option<String>,
    pub is_public: bool,
    pub star_count: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResourceMetrics {
    pub id: String,
    pub environment_id: String,
    pub user_id: String,
    pub timestamp: String,
    pub cpu_usage: f64,
    pub memory_usage: f64,
    pub disk_usage: i64,
    pub network_io: i64,
    pub active_processes: i32,
    pub uptime_seconds: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIRecommendation {
    pub id: String,
    pub user_id: String,
    pub environment_id: Option<String>,
    pub rec_type: String,
    pub priority: String,
    pub title: String,
    pub description: String,
    pub impact: Option<String>,
    pub action: String,
    pub estimated_savings: Option<String>, // JSON string
    pub status: String,
    pub applied_at: Option<String>,
    pub dismissed_at: Option<String>,
    pub expires_at: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Preset {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub long_description: Option<String>,
    pub category: String,
    pub tags: String, // JSON array as string
    pub env_type: String,
    pub thumbnail_url: Option<String>,
    pub config_data: String, // JSON string
    pub dependencies: Option<String>, // JSON string
    pub compatibility: String, // JSON string
    pub download_count: i32,
    pub star_count: i32,
    pub rating_average: f64,
    pub rating_count: i32,
    pub is_featured: bool,
    pub is_official: bool,
    pub is_verified: bool,
    pub is_public: bool,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");
        
        std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
        
        let db_path = app_dir.join("nuffi.db");
        let conn = Connection::open(db_path)?;
        
        let db = Database { conn };
        db.init_tables()?;
        Ok(db)
    }

    fn init_tables(&self) -> Result<()> {
        // Environments table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS environments (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                env_type TEXT NOT NULL,
                version TEXT,
                status TEXT DEFAULT 'inactive',
                path TEXT,
                port INTEGER,
                cpu_usage REAL DEFAULT 0,
                memory_usage REAL DEFAULT 0,
                disk_usage INTEGER DEFAULT 0,
                preset_id TEXT,
                is_public BOOLEAN DEFAULT 0,
                star_count INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Resource metrics table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS resource_metrics (
                id TEXT PRIMARY KEY,
                environment_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                cpu_usage REAL NOT NULL,
                memory_usage REAL NOT NULL,
                disk_usage INTEGER NOT NULL,
                network_io INTEGER DEFAULT 0,
                active_processes INTEGER DEFAULT 0,
                uptime_seconds INTEGER DEFAULT 0,
                FOREIGN KEY (environment_id) REFERENCES environments (id)
            )",
            [],
        )?;

        // AI recommendations table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS ai_recommendations (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                environment_id TEXT,
                rec_type TEXT NOT NULL,
                priority TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                impact TEXT,
                action TEXT NOT NULL,
                estimated_savings TEXT,
                status TEXT DEFAULT 'pending',
                applied_at TEXT,
                dismissed_at TEXT,
                expires_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Presets table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS presets (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                description TEXT,
                long_description TEXT,
                category TEXT NOT NULL,
                tags TEXT NOT NULL,
                env_type TEXT NOT NULL,
                thumbnail_url TEXT,
                config_data TEXT NOT NULL,
                dependencies TEXT,
                compatibility TEXT NOT NULL,
                download_count INTEGER DEFAULT 0,
                star_count INTEGER DEFAULT 0,
                rating_average REAL DEFAULT 0,
                rating_count INTEGER DEFAULT 0,
                is_featured BOOLEAN DEFAULT 0,
                is_official BOOLEAN DEFAULT 0,
                is_verified BOOLEAN DEFAULT 0,
                is_public BOOLEAN DEFAULT 1,
                status TEXT DEFAULT 'approved',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Installation jobs table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS installation_jobs (
                id TEXT PRIMARY KEY,
                workspace_id TEXT NOT NULL,
                tool_name TEXT NOT NULL,
                tool_type TEXT NOT NULL,
                tool_version TEXT,
                status TEXT DEFAULT 'queued',
                progress INTEGER DEFAULT 0,
                log TEXT DEFAULT '[]',
                started_at TEXT,
                completed_at TEXT,
                error TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Conflicts table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS conflicts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                conflict_type TEXT NOT NULL,
                severity TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                affected_tools TEXT NOT NULL,
                suggested_resolution TEXT NOT NULL,
                alternatives TEXT,
                status TEXT DEFAULT 'detected',
                resolution_applied TEXT,
                resolved_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Create indexes for better performance
        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_resource_metrics_timestamp 
             ON resource_metrics(timestamp DESC)",
            [],
        )?;

        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_resource_metrics_env_id 
             ON resource_metrics(environment_id)",
            [],
        )?;

        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user 
             ON ai_recommendations(user_id)",
            [],
        )?;

        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_presets_category 
             ON presets(category)",
            [],
        )?;

        Ok(())
    }

    // Environment operations
    pub fn create_environment(&self, env: &Environment) -> Result<()> {
        self.conn.execute(
            "INSERT INTO environments (
                id, user_id, name, description, env_type, version, status, 
                path, port, cpu_usage, memory_usage, disk_usage, preset_id, 
                is_public, star_count, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
            params![
                env.id, env.user_id, env.name, env.description, env.env_type,
                env.version, env.status, env.path, env.port, env.cpu_usage,
                env.memory_usage, env.disk_usage, env.preset_id, env.is_public,
                env.star_count, env.created_at, env.updated_at
            ],
        )?;
        Ok(())
    }

    pub fn get_environments(&self, user_id: &str) -> Result<Vec<Environment>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, name, description, env_type, version, status, 
                    path, port, cpu_usage, memory_usage, disk_usage, preset_id, 
                    is_public, star_count, created_at, updated_at 
             FROM environments WHERE user_id = ?1 ORDER BY updated_at DESC"
        )?;

        let env_iter = stmt.query_map([user_id], |row| {
            Ok(Environment {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                env_type: row.get(4)?,
                version: row.get(5)?,
                status: row.get(6)?,
                path: row.get(7)?,
                port: row.get(8)?,
                cpu_usage: row.get(9)?,
                memory_usage: row.get(10)?,
                disk_usage: row.get(11)?,
                preset_id: row.get(12)?,
                is_public: row.get(13)?,
                star_count: row.get(14)?,
                created_at: row.get(15)?,
                updated_at: row.get(16)?,
            })
        })?;

        let mut environments = Vec::new();
        for env in env_iter {
            environments.push(env?);
        }
        Ok(environments)
    }

    pub fn update_environment_status(&self, env_id: &str, status: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE environments SET status = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
            params![status, env_id],
        )?;
        Ok(())
    }

    // Resource metrics operations
    pub fn store_metrics(&self, metrics: &ResourceMetrics) -> Result<()> {
        self.conn.execute(
            "INSERT INTO resource_metrics (
                id, environment_id, user_id, timestamp, cpu_usage, 
                memory_usage, disk_usage, network_io, active_processes, uptime_seconds
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![
                metrics.id, metrics.environment_id, metrics.user_id, metrics.timestamp,
                metrics.cpu_usage, metrics.memory_usage, metrics.disk_usage,
                metrics.network_io, metrics.active_processes, metrics.uptime_seconds
            ],
        )?;
        Ok(())
    }

    pub fn get_recent_metrics(&self, environment_id: &str, limit: i32) -> Result<Vec<ResourceMetrics>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, environment_id, user_id, timestamp, cpu_usage, 
                    memory_usage, disk_usage, network_io, active_processes, uptime_seconds
             FROM resource_metrics 
             WHERE environment_id = ?1 
             ORDER BY timestamp DESC 
             LIMIT ?2"
        )?;

        let metrics_iter = stmt.query_map(params![environment_id, limit], |row| {
            Ok(ResourceMetrics {
                id: row.get(0)?,
                environment_id: row.get(1)?,
                user_id: row.get(2)?,
                timestamp: row.get(3)?,
                cpu_usage: row.get(4)?,
                memory_usage: row.get(5)?,
                disk_usage: row.get(6)?,
                network_io: row.get(7)?,
                active_processes: row.get(8)?,
                uptime_seconds: row.get(9)?,
            })
        })?;

        let mut metrics = Vec::new();
        for metric in metrics_iter {
            metrics.push(metric?);
        }
        Ok(metrics)
    }

    // AI recommendations operations
    pub fn create_recommendation(&self, rec: &AIRecommendation) -> Result<()> {
        self.conn.execute(
            "INSERT INTO ai_recommendations (
                id, user_id, environment_id, rec_type, priority, title, 
                description, impact, action, estimated_savings, status, 
                applied_at, dismissed_at, expires_at, created_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)",
            params![
                rec.id, rec.user_id, rec.environment_id, rec.rec_type, rec.priority,
                rec.title, rec.description, rec.impact, rec.action, rec.estimated_savings,
                rec.status, rec.applied_at, rec.dismissed_at, rec.expires_at, rec.created_at
            ],
        )?;
        Ok(())
    }

    pub fn get_recommendations(&self, user_id: &str) -> Result<Vec<AIRecommendation>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, environment_id, rec_type, priority, title, 
                    description, impact, action, estimated_savings, status, 
                    applied_at, dismissed_at, expires_at, created_at
             FROM ai_recommendations 
             WHERE user_id = ?1 AND status = 'pending'
             ORDER BY priority DESC, created_at DESC"
        )?;

        let rec_iter = stmt.query_map([user_id], |row| {
            Ok(AIRecommendation {
                id: row.get(0)?,
                user_id: row.get(1)?,
                environment_id: row.get(2)?,
                rec_type: row.get(3)?,
                priority: row.get(4)?,
                title: row.get(5)?,
                description: row.get(6)?,
                impact: row.get(7)?,
                action: row.get(8)?,
                estimated_savings: row.get(9)?,
                status: row.get(10)?,
                applied_at: row.get(11)?,
                dismissed_at: row.get(12)?,
                expires_at: row.get(13)?,
                created_at: row.get(14)?,
            })
        })?;

        let mut recommendations = Vec::new();
        for rec in rec_iter {
            recommendations.push(rec?);
        }
        Ok(recommendations)
    }

    // Preset operations
    pub fn create_preset(&self, preset: &Preset) -> Result<()> {
        self.conn.execute(
            "INSERT INTO presets (
                id, user_id, name, slug, description, long_description, category, 
                tags, env_type, thumbnail_url, config_data, dependencies, 
                compatibility, download_count, star_count, rating_average, 
                rating_count, is_featured, is_official, is_verified, is_public, 
                status, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24)",
            params![
                preset.id, preset.user_id, preset.name, preset.slug, preset.description,
                preset.long_description, preset.category, preset.tags, preset.env_type,
                preset.thumbnail_url, preset.config_data, preset.dependencies,
                preset.compatibility, preset.download_count, preset.star_count,
                preset.rating_average, preset.rating_count, preset.is_featured,
                preset.is_official, preset.is_verified, preset.is_public,
                preset.status, preset.created_at, preset.updated_at
            ],
        )?;
        Ok(())
    }

    pub fn get_presets(&self, category: Option<&str>, limit: i32) -> Result<Vec<Preset>> {
        let query = match category {
            Some(_) => "SELECT * FROM presets WHERE category = ?1 AND is_public = 1 AND status = 'approved' ORDER BY is_featured DESC, download_count DESC LIMIT ?2",
            None => "SELECT * FROM presets WHERE is_public = 1 AND status = 'approved' ORDER BY is_featured DESC, download_count DESC LIMIT ?1",
        };

        let mut stmt = self.conn.prepare(query)?;
        
        let row_mapper = |row: &rusqlite::Row| self.row_to_preset(row);
        
        let preset_iter = match category {
            Some(cat) => stmt.query_map(params![cat, limit], row_mapper)?,
            None => stmt.query_map([limit], row_mapper)?,
        };

        let mut presets = Vec::new();
        for preset in preset_iter {
            presets.push(preset?);
        }
        Ok(presets)
    }

    fn row_to_preset(&self, row: &rusqlite::Row) -> Result<Preset> {
        Ok(Preset {
            id: row.get(0)?,
            user_id: row.get(1)?,
            name: row.get(2)?,
            slug: row.get(3)?,
            description: row.get(4)?,
            long_description: row.get(5)?,
            category: row.get(6)?,
            tags: row.get(7)?,
            env_type: row.get(8)?,
            thumbnail_url: row.get(9)?,
            config_data: row.get(10)?,
            dependencies: row.get(11)?,
            compatibility: row.get(12)?,
            download_count: row.get(13)?,
            star_count: row.get(14)?,
            rating_average: row.get(15)?,
            rating_count: row.get(16)?,
            is_featured: row.get(17)?,
            is_official: row.get(18)?,
            is_verified: row.get(19)?,
            is_public: row.get(20)?,
            status: row.get(21)?,
            created_at: row.get(22)?,
            updated_at: row.get(23)?,
        })
    }
}