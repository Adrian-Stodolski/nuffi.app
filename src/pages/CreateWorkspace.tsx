import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, Wand2, Zap, Check, Code, Database, Brain, Shield, Rocket } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { WorkspaceType } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NuffiLogo from '../components/NuffiLogo';

const CreateWorkspace: React.FC = () => {
  const { createWorkspace, loading } = useAppStore();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<'scan' | 'analyze' | 'architect' | 'build' | 'deploy'>('scan');
  const [aiThinking, setAiThinking] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [buildingProgress, setBuildingProgress] = useState(0);

  const phases = {
    scan: { title: 'Neural Scan', description: 'AI analyzing your development DNA...', icon: '🧠', color: 'from-purple-500 to-pink-500' },
    analyze: { title: 'Deep Analysis', description: 'Processing your coding patterns...', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
    architect: { title: 'AI Architect', description: 'Designing your perfect workspace...', icon: '🏗️', color: 'from-green-500 to-emerald-500' },
    build: { title: 'Quantum Build', description: 'Materializing your environment...', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    deploy: { title: 'Launch Sequence', description: 'Deploying to your reality...', icon: '🚀', color: 'from-red-500 to-pink-500' }
  };

  const techStack = [
    { id: 'react', name: 'React', icon: '⚛️', category: 'frontend', power: 95 },
    { id: 'vue', name: 'Vue.js', icon: '💚', category: 'frontend', power: 88 },
    { id: 'angular', name: 'Angular', icon: '🅰️', category: 'frontend', power: 85 },
    { id: 'nodejs', name: 'Node.js', icon: '💚', category: 'backend', power: 92 },
    { id: 'python', name: 'Python', icon: '🐍', category: 'backend', power: 90 },
    { id: 'docker', name: 'Docker', icon: '🐳', category: 'devops', power: 87 },
    { id: 'k8s', name: 'Kubernetes', icon: '☸️', category: 'devops', power: 95 },
    { id: 'ai', name: 'AI/ML', icon: '🤖', category: 'ai', power: 98 },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️', category: 'web3', power: 85 },
    { id: 'quantum', name: 'Quantum', icon: '🌌', category: 'future', power: 100 }
  ];

  // AI Brain Animation Component
  const AIBrain = ({ thinking = false }) => (
    <motion.div 
      className="relative w-32 h-32 mx-auto mb-8"
      animate={thinking ? {
        scale: [1, 1.2, 1],
        rotate: [0, 360]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
        animate={{
          background: [
            "linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4)",
            "linear-gradient(45deg, #06b6d4, #8b5cf6, #3b82f6)",
            "linear-gradient(45deg, #3b82f6, #06b6d4, #8b5cf6)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-bg-primary flex items-center justify-center"
        animate={{
          boxShadow: [
            "inset 0 0 20px rgba(139, 92, 246, 0.5)",
            "inset 0 0 40px rgba(59, 130, 246, 0.5)",
            "inset 0 0 20px rgba(6, 182, 212, 0.5)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={thinking ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <NuffiLogo size={60} animate={thinking} />
        </motion.div>
      </motion.div>
      
      {/* Neural network lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            height: '60px',
            top: '50%',
            left: '50%',
            transformOrigin: '0 0',
            transform: `rotate(${i * 45}deg)`
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  );

  // Holographic Tech Selector
  const TechSelector = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {techStack.map((tech, index) => (
        <motion.div
          key={tech.id}
          className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
            selectedTech.includes(tech.id)
              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400'
              : 'bg-bg-quaternary/30 border border-border hover:border-cyan-400/50'
          }`}
          initial={{ opacity: 0, y: 20, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            rotateY: 10,
            boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (selectedTech.includes(tech.id)) {
              setSelectedTech(selectedTech.filter(t => t !== tech.id));
            } else {
              setSelectedTech([...selectedTech, tech.id]);
            }
          }}
        >
          <motion.div 
            className="text-4xl mb-2 text-center"
            animate={selectedTech.includes(tech.id) ? {
              scale: [1, 1.3, 1],
              rotate: [0, 360]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {tech.icon}
          </motion.div>
          <div className="text-center">
            <div className="font-semibold text-text-primary text-sm">{tech.name}</div>
            <div className="text-xs text-text-secondary">{tech.category}</div>
            
            {/* Power level bar */}
            <div className="mt-2 h-1 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${tech.power}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              />
            </div>
            <div className="text-xs text-cyan-400 mt-1">Power: {tech.power}</div>
          </div>
          
          {selectedTech.includes(tech.id) && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const startAIAnalysis = async () => {
    if (selectedTech.length === 0) {
      toast.error('Select at least one technology!');
      return;
    }
    
    setAiThinking(true);
    setCurrentPhase('analyze');
    
    // Simulate AI analysis
    setTimeout(() => {
      setCurrentPhase('architect');
      // Generate AI recommendations
      const recommendations = selectedTech.map(techId => {
        const tech = techStack.find(t => t.id === techId);
        return {
          name: `${tech?.name} Workspace`,
          confidence: 85 + Math.random() * 15,
          tools: [`${tech?.name} IDE`, 'Docker', 'Git', 'Terminal'],
          estimatedTime: `${5 + Math.random() * 10} min`
        };
      });
      setAiRecommendations(recommendations);
      setAiThinking(false);
    }, 3000);
  };

  const buildWorkspace = async () => {
    setCurrentPhase('build');
    setBuildingProgress(0);
    
    // Simulate building process
    const interval = setInterval(() => {
      setBuildingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentPhase('deploy');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const deployWorkspace = async () => {
    try {
      const workspaceData = {
        name: workspaceName || 'AI Generated Workspace',
        workspace_type: 'custom' as WorkspaceType,
        tools: [],
        config: {
          auto_start: false,
          port_mappings: [],
          environment_variables: {},
          startup_commands: [],
          cleanup_commands: [],
          shell_config: {
            default_shell: 'bash' as const,
            available_shells: ['bash', 'zsh'],
            shell_rc_files: {},
            plugins: []
          },
          aliases: {},
          custom_paths: []
        }
      };

      await createWorkspace(workspaceData);
      toast.success('🚀 Workspace deployed to your reality!');
      navigate('/');
    } catch (error) {
      toast.error('Deployment failed - reality rejected the workspace');
    }
  };

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim() || !selectedWorkspace) {
      toast.error('Please complete all steps');
      return;
    }

    try {
      const workspaceData = {
        name: workspaceName,
        workspace_type: selectedWorkspace.type,
        tools: [],
        config: {
          auto_start: false,
          port_mappings: [],
          environment_variables: {},
          startup_commands: [],
          cleanup_commands: [],
          shell_config: {
            default_shell: 'bash' as const,
            available_shells: ['bash', 'zsh'],
            shell_rc_files: {},
            plugins: []
          },
          aliases: {},
          custom_paths: []
        }
      };

      await createWorkspace(workspaceData);
      toast.success(`Workspace "${workspaceName}" created successfully!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to create workspace');
      console.error('Create workspace error:', error);
    }
  };

  // Quantum Particles Background
  const QuantumField = () => (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
            x: [0, (Math.random() - 0.5) * 400],
            y: [0, (Math.random() - 0.5) * 400],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Floating Ghosts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ghost-${i}`}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, (Math.random() - 0.5) * 300, 0],
            rotate: [0, 360],
            scale: [0.3, 0.8, 0.3],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        >
          <NuffiLogo size={60 + Math.random() * 40} animate={false} />
        </motion.div>
      ))}
    </div>
  );

  // Epic Progress Bar with Multiple Ghosts
  const ProgressBar = () => {
    const progress = ((currentStep + 1) / steps.length) * 100;
    
    return (
      <div className="mb-12 relative">
        {/* Step indicators with epic styling */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center flex-1 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 relative ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white' 
                    : 'bg-bg-quaternary text-text-muted'
                }`}
                animate={index <= currentStep ? {
                  boxShadow: [
                    "0 0 20px rgba(0, 191, 255, 0.4)",
                    "0 0 30px rgba(0, 191, 255, 0.6)",
                    "0 0 20px rgba(0, 191, 255, 0.4)"
                  ],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <NuffiLogo size={24} animate={false} />
                  </motion.div>
                ) : (
                  index + 1
                )}
                
                {/* Connecting lines */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute left-full top-1/2 w-full h-0.5 -translate-y-1/2"
                    style={{
                      background: index < currentStep 
                        ? 'linear-gradient(90deg, rgba(0, 191, 255, 0.6), rgba(139, 92, 246, 0.6))' 
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index < currentStep ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                )}
              </motion.div>
              
              <motion.span 
                className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                  index <= currentStep ? 'text-text-primary' : 'text-text-muted'
                }`}
                animate={index === currentStep ? {
                  textShadow: [
                    "0 0 10px rgba(0, 191, 255, 0.3)",
                    "0 0 20px rgba(0, 191, 255, 0.5)",
                    "0 0 10px rgba(0, 191, 255, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {step.title}
              </motion.span>
              
              <motion.span 
                className="text-xs text-text-secondary mt-1"
                animate={index === currentStep ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {step.description}
              </motion.span>
            </motion.div>
          ))}
        </div>
        
        {/* Epic Progress Trail with Multiple Ghosts */}
        <div className="relative h-6 mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-bg-quaternary via-bg-tertiary to-bg-quaternary rounded-full opacity-50" />
          
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(90deg, 
                rgba(0, 191, 255, 0.3) 0%, 
                rgba(139, 92, 246, 0.4) 50%, 
                rgba(76, 175, 80, 0.3) 100%)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Multiple ghosts following the progress */}
          {[0, 1, 2].map((ghostIndex) => (
            <motion.div
              key={ghostIndex}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              initial={{ left: '0%' }}
              animate={{ left: `${Math.max(0, progress - ghostIndex * 15)}%` }}
              transition={{ 
                duration: 0.8 + ghostIndex * 0.2, 
                ease: "easeOut",
                delay: ghostIndex * 0.1 
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2 + ghostIndex * 0.5,
                  repeat: Infinity,
                  delay: ghostIndex * 0.3
                }}
                style={{ opacity: 0.7 - ghostIndex * 0.2 }}
              >
                <NuffiLogo size={20 + ghostIndex * 4} animate={false} />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Progress percentage with epic styling */}
        <motion.div 
          className="text-center"
          animate={{
            textShadow: [
              "0 0 10px rgba(0, 191, 255, 0.3)",
              "0 0 20px rgba(0, 191, 255, 0.5)",
              "0 0 10px rgba(0, 191, 255, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green bg-clip-text text-transparent">
            {Math.round(progress)}%
          </span>
          <span className="text-text-secondary ml-2">Complete</span>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto relative">
      <QuantumField />
      <div className="max-w-7xl mx-auto p-6 relative z-20">
        {/* Epic Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/" className="absolute top-0 left-0">
            <motion.div
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </motion.div>
          </Link>
          
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            AI Workspace Architect
          </motion.h1>
          <motion.p 
            className="text-xl text-text-secondary mb-8"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {phases[currentPhase].description}
          </motion.p>
          
          {/* Phase indicator */}
          <motion.div 
            className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${phases[currentPhase].color} bg-opacity-20 border border-cyan-400/30`}
            animate={{
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.3)",
                "0 0 40px rgba(6, 182, 212, 0.5)",
                "0 0 20px rgba(6, 182, 212, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">{phases[currentPhase].icon}</span>
            <span className="text-lg font-semibold text-white">{phases[currentPhase].title}</span>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Neural Scan - Tech Selection */}
          {currentPhase === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="mb-12"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Select Your Tech Stack</h2>
                <p className="text-text-secondary text-lg">Choose the technologies that make your developer heart sing</p>
              </motion.div>
              
              <TechSelector />
              
              <motion.button
                onClick={startAIAnalysis}
                disabled={selectedTech.length === 0}
                className="ai-button text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={selectedTech.length > 0 ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 40px rgba(6, 182, 212, 0.4)"
                } : {}}
                whileTap={selectedTech.length > 0 ? { scale: 0.95 } : {}}
              >
                🧠 Initiate AI Analysis ({selectedTech.length} selected)
              </motion.button>
            </motion.div>
          )}

          {/* Phase 2: AI Analysis */}
          {(currentPhase === 'analyze' || currentPhase === 'architect') && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <AIBrain thinking={aiThinking} />
              
              {currentPhase === 'analyze' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">AI is analyzing your preferences...</h2>
                  <div className="flex justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {currentPhase === 'architect' && aiRecommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-8">AI Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {aiRecommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className="glass-card p-6"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.02, rotateY: 5 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">{rec.name}</h3>
                        <div className="text-cyan-400 mb-4">Confidence: {rec.confidence.toFixed(1)}%</div>
                        <div className="space-y-2">
                          {rec.tools.map((tool: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-400" />
                              <span className="text-text-secondary">{tool}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-text-muted">
                          Estimated setup: {rec.estimatedTime}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="Name your workspace..."
                      className="glass-input text-center text-xl max-w-md mx-auto"
                    />
                    
                    <motion.button
                      onClick={buildWorkspace}
                      className="ai-button text-xl px-12 py-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🏗️ Build My Workspace
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Phase 3: Building */}
          {currentPhase === 'build' && (
            <motion.div
              key="build"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8"
              >
                <NuffiLogo size={120} animate={true} />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-8">Materializing Your Workspace</h2>
              
              {/* Epic progress bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative h-8 bg-bg-quaternary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${buildingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <div className="text-2xl font-bold text-cyan-400 mt-4">
                  {Math.round(buildingProgress)}% Complete
                </div>
              </div>
              
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-text-secondary"
              >
                Quantum processors are assembling your development reality...
              </motion.div>
            </motion.div>
          )}

          {/* Phase 4: Deploy */}
          {currentPhase === 'deploy' && (
            <motion.div
              key="deploy"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mb-8"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <NuffiLogo size={150} animate={true} />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold text-white mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.5)",
                    "0 0 40px rgba(6, 182, 212, 0.8)",
                    "0 0 20px rgba(6, 182, 212, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀 Ready for Launch!
              </motion.h2>
              
              <p className="text-xl text-text-secondary mb-8">
                Your workspace "{workspaceName || 'AI Generated Workspace'}" is ready to deploy to reality
              </p>
              
              <motion.button
                onClick={deployWorkspace}
                className="ai-button text-2xl px-16 py-6"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 20px 60px rgba(6, 182, 212, 0.4)"
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(6, 182, 212, 0.3)",
                    "0 0 50px rgba(6, 182, 212, 0.6)",
                    "0 0 30px rgba(6, 182, 212, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌌 Deploy to Reality
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateWorkspace;