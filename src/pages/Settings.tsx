import React, { useState } from 'react';
import { Save, RefreshCw, Trash2, Bell, Folder, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General
    autoScanOnStartup: false,
    showNotifications: true,
    autoSave: true,
    checkUpdates: true,

    // Workspace
    defaultWorkspaceLocation: '~/workspaces',
    autoActivateWorkspace: 'last-used',
    maxRecentWorkspaces: 10,
    autoCleanupWorkspaces: false,

    // Appearance
    theme: 'dark',
    compactMode: false,
    animationsEnabled: true,
    particleEffects: true,
    glassEffects: true,

    // Performance
    enableHardwareAcceleration: true,
    maxConcurrentScans: 3,
    cacheResults: true,
    preloadWorkspaces: true,

    // Developer
    developerMode: false,
    showDebugInfo: false,
    enableExperimentalFeatures: false,
    verboseLogging: false,

    // AI Features
    enableAIRecommendations: true,
    aiScanFrequency: 'daily',
    autoApplyLowRiskFixes: false,
    aiLearningMode: true,

    // Security
    enableSecurityScans: true,
    quarantineThreats: true,
    allowRemoteConnections: false,
    encryptWorkspaceData: true,

    // Integrations
    enableGitIntegration: true,
    enableDockerIntegration: true,
    enableCloudSync: false,
    cloudProvider: 'none'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      // General
      autoScanOnStartup: false,
      showNotifications: true,
      autoSave: true,
      checkUpdates: true,

      // Workspace
      defaultWorkspaceLocation: '~/workspaces',
      autoActivateWorkspace: 'last-used',
      maxRecentWorkspaces: 10,
      autoCleanupWorkspaces: false,

      // Appearance
      theme: 'dark',
      compactMode: false,
      animationsEnabled: true,
      particleEffects: true,
      glassEffects: true,

      // Performance
      enableHardwareAcceleration: true,
      maxConcurrentScans: 3,
      cacheResults: true,
      preloadWorkspaces: true,

      // Developer
      developerMode: false,
      showDebugInfo: false,
      enableExperimentalFeatures: false,
      verboseLogging: false,

      // AI Features
      enableAIRecommendations: true,
      aiScanFrequency: 'daily',
      autoApplyLowRiskFixes: false,
      aiLearningMode: true,

      // Security
      enableSecurityScans: true,
      quarantineThreats: true,
      allowRemoteConnections: false,
      encryptWorkspaceData: true,

      // Integrations
      enableGitIntegration: true,
      enableDockerIntegration: true,
      enableCloudSync: false,
      cloudProvider: 'none'
    });
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <motion.button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 backdrop-blur-sm border ${checked
        ? 'bg-gradient-to-r from-accent-blue to-accent-green border-accent-blue/30 shadow-lg shadow-accent-blue/25'
        : 'bg-bg-quaternary/50 border-border hover:border-accent-blue/30'
        }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg ${checked ? 'shadow-accent-blue/30' : 'shadow-black/20'
          }`}
        animate={{
          x: checked ? 24 : 4,
          boxShadow: checked
            ? "0 2px 8px rgba(0, 191, 255, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.2)"
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gradient-ai mb-2">Settings</h1>
          <p className="text-text-secondary">
            Configure your NUFFI preferences and system settings.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* General Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">General</h2>
                <p className="text-text-muted text-sm">Basic application preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Auto-scan on startup</h3>
                  <p className="text-sm text-text-muted">
                    Automatically scan for development tools when NUFFI starts
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.autoScanOnStartup}
                  onChange={(checked) => handleSettingChange('autoScanOnStartup', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Show notifications</h3>
                  <p className="text-sm text-text-muted">
                    Display system notifications for important events
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.showNotifications}
                  onChange={(checked) => handleSettingChange('showNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Auto-save changes</h3>
                  <p className="text-sm text-text-muted">Save configurations automatically</p>
                </div>
                <ToggleSwitch
                  checked={settings.autoSave}
                  onChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Check for updates</h3>
                  <p className="text-sm text-text-muted">Automatically check for app updates</p>
                </div>
                <ToggleSwitch
                  checked={settings.checkUpdates}
                  onChange={(checked) => handleSettingChange('checkUpdates', checked)}
                />
              </div>
            </div>
          </motion.div>

          {/* Workspace Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center">
                <Folder className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Workspaces</h2>
                <p className="text-text-muted text-sm">Workspace management preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="form-label">
                  Default workspace location
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={settings.defaultWorkspaceLocation}
                    onChange={(e) => handleSettingChange('defaultWorkspaceLocation', e.target.value)}
                    className="glass-input flex-1"
                  />
                  <motion.button
                    className="ai-button-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="form-label">Auto-activate workspace</label>
                <select
                  value={settings.autoActivateWorkspace}
                  onChange={(e) => handleSettingChange('autoActivateWorkspace', e.target.value)}
                  className="glass-select"
                >
                  <option value="last-used">Last used workspace</option>
                  <option value="always-ask">Always ask</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div>
                <label className="form-label">Max recent workspaces</label>
                <select
                  value={settings.maxRecentWorkspaces}
                  onChange={(e) => handleSettingChange('maxRecentWorkspaces', Number(e.target.value))}
                  className="glass-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Auto cleanup workspaces</h3>
                  <p className="text-sm text-text-muted">Remove unused workspaces automatically</p>
                </div>
                <ToggleSwitch
                  checked={settings.autoCleanupWorkspaces}
                  onChange={(checked) => handleSettingChange('autoCleanupWorkspaces', checked)}
                />
              </div>
            </div>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-purple/10 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
                <p className="text-text-muted text-sm">Customize the look and feel</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="form-label">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="glass-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Compact mode</h3>
                  <p className="text-sm text-text-muted">Use smaller spacing and components</p>
                </div>
                <ToggleSwitch
                  checked={settings.compactMode}
                  onChange={(checked) => handleSettingChange('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Animations</h3>
                  <p className="text-sm text-text-muted">Enable smooth animations</p>
                </div>
                <ToggleSwitch
                  checked={settings.animationsEnabled}
                  onChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Particle effects</h3>
                  <p className="text-sm text-text-muted">Show floating particles background</p>
                </div>
                <ToggleSwitch
                  checked={settings.particleEffects}
                  onChange={(checked) => handleSettingChange('particleEffects', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Glass effects</h3>
                  <p className="text-sm text-text-muted">Enable glassmorphism design</p>
                </div>
                <ToggleSwitch
                  checked={settings.glassEffects}
                  onChange={(checked) => handleSettingChange('glassEffects', checked)}
                />
              </div>
            </div>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-orange/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-orange" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Advanced</h2>
                <p className="text-text-muted text-sm">Developer and advanced options</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Developer mode</h3>
                  <p className="text-sm text-text-muted">
                    Enable advanced features and debugging options
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.developerMode}
                  onChange={(checked) => handleSettingChange('developerMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Show debug info</h3>
                  <p className="text-sm text-text-muted">Display debug information in UI</p>
                </div>
                <ToggleSwitch
                  checked={settings.showDebugInfo}
                  onChange={(checked) => handleSettingChange('showDebugInfo', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Experimental features</h3>
                  <p className="text-sm text-text-muted">Enable beta features (may be unstable)</p>
                </div>
                <ToggleSwitch
                  checked={settings.enableExperimentalFeatures}
                  onChange={(checked) => handleSettingChange('enableExperimentalFeatures', checked)}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={handleReset}
                    className="flex items-center space-x-2 bg-status-error/10 text-status-error hover:bg-status-error/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-status-error/20"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Reset All Settings</span>
                  </motion.button>
                  <p className="text-sm text-text-muted">
                    This will reset all settings to their default values.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Performance</h2>
                <p className="text-text-muted text-sm">Optimize application performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Hardware acceleration</h3>
                  <p className="text-sm text-text-muted">Use GPU for better performance</p>
                </div>
                <ToggleSwitch
                  checked={settings.enableHardwareAcceleration}
                  onChange={(checked) => handleSettingChange('enableHardwareAcceleration', checked)}
                />
              </div>

              <div>
                <label className="form-label">Max concurrent scans</label>
                <select
                  value={settings.maxConcurrentScans}
                  onChange={(e) => handleSettingChange('maxConcurrentScans', Number(e.target.value))}
                  className="glass-select"
                >
                  <option value={1}>1 (Slow)</option>
                  <option value={2}>2 (Balanced)</option>
                  <option value={3}>3 (Fast)</option>
                  <option value={4}>4 (Very Fast)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Cache results</h3>
                  <p className="text-sm text-text-muted">Cache scan results for faster loading</p>
                </div>
                <ToggleSwitch
                  checked={settings.cacheResults}
                  onChange={(checked) => handleSettingChange('cacheResults', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Preload workspaces</h3>
                  <p className="text-sm text-text-muted">Load workspace data in background</p>
                </div>
                <ToggleSwitch
                  checked={settings.preloadWorkspaces}
                  onChange={(checked) => handleSettingChange('preloadWorkspaces', checked)}
                />
              </div>
            </div>
          </motion.div>

          {/* AI Features Settings */}
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent-purple/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">AI Features</h2>
                <p className="text-text-muted text-sm">Configure AI-powered features</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">AI recommendations</h3>
                  <p className="text-sm text-text-muted">Get intelligent suggestions</p>
                </div>
                <ToggleSwitch
                  checked={settings.enableAIRecommendations}
                  onChange={(checked) => handleSettingChange('enableAIRecommendations', checked)}
                />
              </div>

              <div>
                <label className="form-label">AI scan frequency</label>
                <select
                  value={settings.aiScanFrequency}
                  onChange={(e) => handleSettingChange('aiScanFrequency', e.target.value)}
                  className="glass-select"
                >
                  <option value="never">Never</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">Auto-apply low risk fixes</h3>
                  <p className="text-sm text-text-muted">Automatically apply safe improvements</p>
                </div>
                <ToggleSwitch
                  checked={settings.autoApplyLowRiskFixes}
                  onChange={(checked) => handleSettingChange('autoApplyLowRiskFixes', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">AI learning mode</h3>
                  <p className="text-sm text-text-muted">Help improve AI suggestions</p>
                </div>
                <ToggleSwitch
                  checked={settings.aiLearningMode}
                  onChange={(checked) => handleSettingChange('aiLearningMode', checked)}
                />
              </div>
            </div>
          </motion.div>

          {/* Save Actions */}
          <motion.div
            className="flex justify-end space-x-4 pt-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleReset}
              className="ai-button-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="ai-button"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;