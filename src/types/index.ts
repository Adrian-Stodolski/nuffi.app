// NUFFI V4.0 - Complete Professional Dev Environment
// Industry-focused workspace system with comprehensive tooling

// ============================================================================
// CORE USER & PROFILE TYPES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: Badge[];
  streak?: number;
  rank?: number;
  created_at?: Date;
  preferences?: {
    theme: 'dark' | 'light' | 'auto';
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
    showActivity: boolean;
    autoSave?: boolean;
    compactMode?: boolean;
  };
}

export interface Profile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: string;
  xp_points: number;
  level: number;
  reputation_score: number;
  streak_days: number;
  last_activity_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: Date;
}

// ============================================================================
// WORKSPACE & ENVIRONMENT TYPES
// ============================================================================

export type WorkspaceType = 
  | 'data-science'     // Python, R, Jupyter, TensorFlow, PyTorch
  | 'blockchain'       // Solidity, Web3, Hardhat, Truffle
  | 'devops'          // Docker, Kubernetes, Terraform, Jenkins
  | 'cybersecurity'   // Kali tools, Wireshark, Metasploit, Burp
  | 'frontend'        // React, Vue, Angular, TypeScript
  | 'backend'         // Node.js, Python, Go, Java, databases
  | 'mobile'          // React Native, Flutter, Swift, Kotlin
  | 'ai-ml'           // TensorFlow, PyTorch, Hugging Face
  | 'cloud'           // AWS, Azure, GCP tools
  | 'gamedev'         // Unity, Unreal, Godot
  | 'embedded'        // Arduino, Raspberry Pi, IoT
  | 'fullstack'       // Full web development stack
  | 'custom';         // User-defined workspace

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  status: 'active' | 'inactive' | 'installing' | 'error';
  tools: InstalledTool[];
  config: WorkspaceConfig;
  resource_usage: ResourceUsage;
  created_at: Date;
  last_active: Date;
  user_id: string;
}

export interface Environment {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  env_type: string;
  version?: string;
  status: 'active' | 'inactive' | 'installing' | 'error' | 'archived';
  path?: string;
  port?: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  preset_id?: string;
  is_public: boolean;
  star_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface WorkspaceConfig {
  auto_start: boolean;
  port_mappings: PortMapping[];
  environment_variables: Record<string, string>;
  startup_commands: string[];
  cleanup_commands: string[];
  shell_config: ShellConfig;
  aliases: Record<string, string>;
  custom_paths: string[];
}

export interface ShellConfig {
  default_shell: 'bash' | 'zsh' | 'fish' | 'powershell' | 'cmd';
  available_shells: string[];
  shell_rc_files: Record<string, string>;
  custom_prompt?: string;
  plugins: string[];
}

export interface PortMapping {
  host_port: number;
  container_port: number;
  protocol: 'tcp' | 'udp';
}

export interface ResourceUsage {
  cpu: number; // percentage
  memory: number; // MB
  disk: number; // MB
  network_in: number; // MB/s
  network_out: number; // MB/s
}

export interface ResourceMetrics {
  id: string;
  environment_id: string;
  user_id: string;
  timestamp: Date;
  cpu_usage: number;        // 0-100%
  memory_usage: number;     // 0-100%
  disk_usage: number;       // bytes
  network_io: number;       // bytes/s
  active_processes: number;
  uptime_seconds: number;
}

export interface SystemIssue {
  id: string;
  type: 'conflict' | 'missing_dependency' | 'version_mismatch' | 'permission' | 'path' | 'service';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_tools: string[];
  suggested_fix: string;
  auto_fixable: boolean;
  detected_at: Date;
}

export interface SystemScanResult {
  id: string;
  scan_type: 'full' | 'quick' | 'targeted';
  started_at: Date;
  completed_at?: Date;
  status: 'running' | 'completed' | 'failed';
  issues_found: SystemIssue[];
  tools_detected: DetectedTool[];
  system_info: SystemInfo;
}

export interface DetectedTool {
  name: string;
  version: string;
  path: string;
  type: ToolType;
  status: 'working' | 'broken' | 'outdated' | 'conflicted';
  conflicts?: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  version?: string;
  status: 'installed' | 'not-installed' | 'outdated';
  path?: string;
  type: ToolType;
}

// ============================================================================
// TOOLS & INSTALLATION
// ============================================================================

export type ToolType = 
  | 'language'        // Programming languages
  | 'database'        // Database systems
  | 'ide'            // IDEs and editors
  | 'cli'            // Command line tools
  | 'gui'            // GUI applications
  | 'package'        // Package managers
  | 'service'        // Background services
  | 'container'      // Docker, Podman
  | 'cloud'          // Cloud CLI tools
  | 'security'       // Security tools
  | 'monitoring'     // System monitoring
  | 'testing'        // Testing frameworks
  | 'build'          // Build tools
  | 'deployment';    // Deployment tools

export interface InstalledTool {
  name: string;
  type: ToolType;
  version: string;
  path: string;
  size: number;
  status: 'installed' | 'installing' | 'failed' | 'updating';
  dependencies: string[];
  conflicts: string[];
}

export interface ToolRequirement {
  name: string;
  type: ToolType;
  version?: string;
  required: boolean;
  alternatives?: string[];
}

export interface InstallationJob {
  id: string;
  workspace_id: string;
  tool: ToolRequirement;
  status: 'queued' | 'installing' | 'completed' | 'failed';
  progress: number; // 0-100
  log: string[];
  started_at?: Date;
  completed_at?: Date;
  error?: string;
}

// ============================================================================
// AI & ANALYTICS
// ============================================================================

export interface AIRecommendation {
  id: string;
  user_id?: string;
  environment_id?: string;
  type: 'optimization' | 'cleanup' | 'upgrade' | 'security' | 'learning' | 'tool' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact?: string;
  action: string;
  estimated_savings?: {
    time?: number;      // minutes
    disk?: number;      // bytes
    memory?: number;    // MB
  };
  estimated_impact?: string;
  status: 'pending' | 'applied' | 'dismissed' | 'expired';
  applied_at?: Date;
  dismissed_at?: Date;
  expires_at?: Date;
  created_at: Date;
}

export interface LogAnalysis {
  total_logs: number;
  error_count: number;
  warning_count: number;
  common_errors: Array<{
    error: string;
    count: number;
    suggested_fix: string;
  }>;
}

// ============================================================================
// MARKETPLACE & PRESETS
// ============================================================================

export interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  type: WorkspaceType;
  tools: ToolRequirement[];
  config: WorkspaceConfig;
  downloads: number;
  rating: number;
  author_id: string;
  author_name: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
    reputation: number;
  };
  category: 'web' | 'mobile' | 'ml' | 'data' | 'devops' | 'gamedev' | 'blockchain' | 'other';
  tags: string[];
  env_type: string;
  thumbnail_url?: string;
  config_data: {
    language: string;
    version: string;
    tools: string[];
    packages: Record<string, string[]>;
    env_vars: Record<string, string>;
    scripts: Record<string, string>;
  };
  dependencies?: string[];
  compatibility: {
    os: ('macos' | 'windows' | 'linux')[];
    min_version: string;
  };
  download_count: number;
  star_count: number;
  rating_average: number;
  rating_count: number;
  is_featured: boolean;
  is_official: boolean;
  is_verified: boolean;
  is_public: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface PresetVersion {
  id: string;
  preset_id: string;
  version: string;
  config_data: Record<string, any>;
  changelog?: string;
  is_latest: boolean;
  download_count: number;
  release_date: Date;
  created_at: Date;
}

export interface PresetReview {
  id: string;
  preset_id: string;
  user_id: string;
  rating: number; // 1-5
  review_text?: string;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// CONFLICTS & SYSTEM ANALYSIS
// ============================================================================

export interface ToolConflict {
  tool_name: string;
  conflict_type: 'version' | 'path' | 'dependency';
  description: string;
  resolution: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Conflict {
  id: string;
  user_id: string;
  conflict_type: 'version' | 'port' | 'dependency' | 'config' | 'tool';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affected_tools: string[];
  suggested_resolution: {
    type: 'auto' | 'manual';
    action: string;
    description: string;
    implementation: string;
  };
  alternatives?: Array<{
    option: string;
    description: string;
    pros: string[];
    cons: string[];
    commands: string[];
  }>;
  status: 'detected' | 'resolving' | 'resolved' | 'ignored';
  resolution_applied?: string;
  resolved_at?: Date;
  created_at: Date;
}

export interface SystemScan {
  id: string;
  user_id: string;
  detected_tools: InstalledTool[];
  conflicts: ToolConflict[];
  suggestions: string[];
  scanned_at: Date;
  os_info: SystemInfo;
}

export interface SystemInfo {
  os: string;
  arch: string;
  cpu_count: number;
  memory_total: number;
  disk_total: number;
  platform_version: string;
  shell: string;
}

export interface RepositoryAnalysis {
  url: string;
  detected_languages: string[];
  frameworks: string[];
  databases: string[];
  services: string[];
  tools_needed: ToolRequirement[];
  estimated_setup_time: number; // minutes
  complexity_score: number; // 1-10
  suggested_workspace_type: WorkspaceType;
}

// ============================================================================
// TEAMS & COLLABORATION
// ============================================================================

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  invite_code: string;
  max_members: number;
  current_members: number;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  settings: {
    allow_public_templates: boolean;
    require_approval: boolean;
    enforce_standards: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: Date;
}

export interface DevProfile {
  id: string;
  user_id: string;
  name: string; // "Frontend", "Backend", "Mobile", "ML"
  description?: string;
  icon: string; // emoji
  workspaces: string[]; // workspace IDs
  tools: string[]; // tool IDs
  environment_ids: string[];
  custom_config: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// GAMIFICATION & SOCIAL
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  requirement: Record<string, any>;
  requirement_type: string;
  category?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface AchievementUnlocked {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: Date;
  notified: boolean;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'environment_created' | 'preset_shared' | 'achievement_unlocked' | 'level_up' | 'followed_user' | 'starred_preset';
  activity_data?: Record<string, any>;
  is_public: boolean;
  created_at: Date;
}

export interface UserActivity {
  id: string;
  user_id: string;
  type: 'workspace_created' | 'tool_installed' | 'template_shared' | 'badge_earned';
  description: string;
  xp_gained: number;
  created_at: Date;
}

export interface ProductivityMetrics {
  id: string;
  user_id: string;
  date: Date;
  setup_time_saved: number;
  environments_created: number;
  tools_installed: number;
  issues_resolved: number;
  learning_time: number;
  coding_time: number;
  ai_queries: number;
  presets_used: number;
  created_at: Date;
}

// ============================================================================
// COMMUNITY & SOCIAL
// ============================================================================

export interface CommunityPost {
  id: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  type: 'template_share' | 'question' | 'showcase' | 'tip' | 'template' | 'tutorial';
  title: string;
  content?: string;
  description?: string;
  workspace_template_id?: string;
  likes?: number;
  comments?: number;
  author?: {
    name: string;
    avatar: string;
    reputation: number;
    badges: string[];
  };
  stats?: {
    likes: number;
    comments: number;
    views: number;
    downloads?: number;
  };
  tags?: string[];
  createdAt?: Date;
  isLiked?: boolean;
  featured?: boolean;
  created_at: Date;
}

// ============================================================================
// API & REQUEST TYPES
// ============================================================================

export interface CreateWorkspaceRequest {
  name: string;
  workspace_type: WorkspaceType;
  tools: ToolRequirement[];
  config: WorkspaceConfig;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const XP_REWARDS = {
  environment_created: 10,
  tool_installed: 5,
  preset_shared: 20,
  preset_used_10x: 50,
  helped_user: 15,
  tutorial_completed: 30,
  learning_path_completed: 100,
  conflict_resolved: 25,
  bug_fixed: 40,
  streak_7days: 100,
} as const;

export const WORKSPACE_CATEGORIES = [
  'web', 'mobile', 'ml', 'data', 'devops', 'gamedev', 'blockchain', 'other'
] as const;

export const SUBSCRIPTION_TIERS = ['free', 'pro', 'enterprise'] as const;
export const CONFLICT_SEVERITIES = ['critical', 'warning', 'info'] as const;
export const RECOMMENDATION_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;
// ============================================================================
// ENHANCED TEAM MANAGEMENT & ONBOARDING
// ============================================================================

export interface TeamOnboarding {
  id: string;
  team_id: string;
  name: string;
  description: string;
  target_members: string[];
  workspace_templates: string[];
  deployment_config: {
    auto_install: boolean;
    install_schedule?: Date;
    target_machines: string[];
    notification_channels: ('email' | 'slack' | 'teams')[];
  };
  status: 'draft' | 'scheduled' | 'deploying' | 'completed' | 'failed';
  progress: {
    total_targets: number;
    completed: number;
    failed: number;
    in_progress: number;
  };
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
}

export interface RemoteDeployment {
  id: string;
  onboarding_id: string;
  target_machine: string;
  target_user: string;
  workspace_template: string;
  status: 'pending' | 'connecting' | 'installing' | 'configuring' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  error_message?: string;
  started_at?: Date;
  completed_at?: Date;
}

// ============================================================================
// SHELL & ENVIRONMENT MANAGEMENT
// ============================================================================

export interface ShellManager {
  current_shell: string;
  available_shells: string[];
  shell_configs: Record<string, ShellConfiguration>;
  aliases: Record<string, string>;
  environment_variables: Record<string, string>;
  custom_paths: string[];
}

export interface ShellConfiguration {
  name: string;
  executable_path: string;
  config_file: string;
  startup_file: string;
  plugins: string[];
  themes: string[];
  current_theme?: string;
}

export interface AliasManager {
  aliases: Record<string, string>;
  global_aliases: Record<string, string>;
  workspace_aliases: Record<string, Record<string, string>>;
}

export interface PathManager {
  system_paths: string[];
  user_paths: string[];
  workspace_paths: Record<string, string[]>;
  custom_paths: string[];
}

// ============================================================================
// COMPREHENSIVE TOOL CATALOG
// ============================================================================

export interface ToolCatalog {
  categories: ToolCategory[];
  tools: ComprehensiveTool[];
  last_updated: Date;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
  tool_count: number;
}

export interface ComprehensiveTool {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  type: 'cli' | 'gui' | 'service' | 'library' | 'framework';
  installation_methods: InstallationMethod[];
  supported_platforms: ('windows' | 'macos' | 'linux')[];
  dependencies: string[];
  conflicts_with: string[];
  alternatives: string[];
  popularity_score: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  official_website: string;
  documentation_url: string;
  github_url?: string;
  license: string;
  version_info: {
    latest: string;
    stable: string;
    lts?: string;
  };
}

export interface InstallationMethod {
  method: 'package_manager' | 'binary' | 'source' | 'container' | 'installer';
  platform: 'windows' | 'macos' | 'linux' | 'all';
  command: string;
  package_manager?: 'npm' | 'pip' | 'cargo' | 'brew' | 'apt' | 'yum' | 'chocolatey' | 'winget';
  notes?: string;
  requires_admin: boolean;
}