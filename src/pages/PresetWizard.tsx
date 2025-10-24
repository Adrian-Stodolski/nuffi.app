import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  Database,
  Globe,
  Smartphone,
  Brain,
  Download
} from 'lucide-react';

const PresetWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const presets = [
    {
      id: 'fullstack',
      name: 'Full Stack Web App',
      description: 'Complete setup for modern web applications',
      icon: Globe,
      color: 'accent-blue',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      features: ['Authentication', 'API', 'Database', 'Deployment']
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      description: 'Cross-platform mobile app development',
      icon: Smartphone,
      color: 'accent-green',
      technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
      features: ['Navigation', 'Push Notifications', 'Analytics', 'Testing']
    },
    {
      id: 'ai-ml',
      name: 'AI/ML Workspace',
      description: 'Machine learning and AI development environment',
      icon: Brain,
      color: 'accent-purple',
      technologies: ['Python', 'TensorFlow', 'Jupyter', 'CUDA'],
      features: ['GPU Support', 'Data Processing', 'Model Training', 'Visualization']
    },
    {
      id: 'microservices',
      name: 'Microservices Architecture',
      description: 'Distributed systems and microservices setup',
      icon: Database,
      color: 'accent-orange',
      technologies: ['Docker', 'Kubernetes', 'Redis', 'MongoDB'],
      features: ['Service Mesh', 'Load Balancing', 'Monitoring', 'Logging']
    }
  ];

  const steps = [
    { title: 'Choose Preset', description: 'Select your development environment' },
    { title: 'Customize', description: 'Configure your preferences' },
    { title: 'Review', description: 'Review and confirm setup' },
    { title: 'Deploy', description: 'Create your workspace' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Choose Your Development Environment</h2>
              <p className="text-text-secondary">Select a preset that matches your project needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {presets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <motion.div
                    key={preset.id}
                    className={`glass-card cursor-pointer transition-all duration-300 ${
                      selectedPreset === preset.id 
                        ? `border-2 border-${preset.color} bg-${preset.color}/10` 
                        : 'hover:border-accent-blue/30'
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPreset(preset.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-${preset.color}/20 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${preset.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{preset.name}</h3>
                        <p className="text-text-secondary mb-4">{preset.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-text-primary mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {preset.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className={`px-2 py-1 text-xs rounded-full bg-${preset.color}/10 text-${preset.color} border border-${preset.color}/20`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-text-primary mb-2">Features</h4>
                            <div className="grid grid-cols-2 gap-1">
                              {preset.features.map((feature) => (
                                <div key={feature} className="flex items-center space-x-1">
                                  <Check className="w-3 h-3 text-accent-green" />
                                  <span className="text-xs text-text-secondary">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedPreset === preset.id && (
                      <motion.div
                        className="absolute top-4 right-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <div className={`w-6 h-6 rounded-full bg-${preset.color} flex items-center justify-center`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Customize Your Setup</h2>
              <p className="text-text-secondary">Fine-tune your development environment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div className="glass-card" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Project Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Project Name</label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      placeholder="my-awesome-project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      className="glass-input w-full h-20 resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div className="glass-card" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Development Tools</h3>
                <div className="space-y-3">
                  {['ESLint', 'Prettier', 'Husky', 'Jest', 'Storybook'].map((tool) => (
                    <div key={tool} className="flex items-center justify-between">
                      <span className="text-text-secondary">{tool}</span>
                      <motion.button
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 backdrop-blur-sm border bg-accent-blue/20 border-accent-blue/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                          animate={{ x: 24 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 2:
        const selectedPresetData = presets.find(p => p.id === selectedPreset);
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Review Your Configuration</h2>
              <p className="text-text-secondary">Confirm your setup before creating the workspace</p>
            </div>
            
            {selectedPresetData && (
              <motion.div className="glass-card" variants={itemVariants}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-${selectedPresetData.color}/20 flex items-center justify-center`}>
                    <selectedPresetData.icon className={`w-6 h-6 text-${selectedPresetData.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{selectedPresetData.name}</h3>
                    <p className="text-text-secondary">{selectedPresetData.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-text-primary mb-3">Included Technologies</h4>
                    <div className="space-y-2">
                      {selectedPresetData.technologies.map((tech) => (
                        <div key={tech} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-accent-green" />
                          <span className="text-text-secondary">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-text-primary mb-3">Features</h4>
                    <div className="space-y-2">
                      {selectedPresetData.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-accent-green" />
                          <span className="text-text-secondary">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            <motion.div
              className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-green to-accent-blue rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(76, 175, 80, 0.4)",
                  "0 0 50px rgba(76, 175, 80, 0.6)",
                  "0 0 30px rgba(76, 175, 80, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Creating Your Workspace</h2>
              <p className="text-text-secondary">Setting up your development environment...</p>
            </div>
            
            <motion.div className="glass-card max-w-md mx-auto">
              <div className="space-y-4">
                {['Installing dependencies', 'Configuring tools', 'Setting up database', 'Finalizing setup'].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.5 }}
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.5 + 0.2 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-text-secondary">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.4)",
                  "0 0 30px rgba(139, 92, 246, 0.6)",
                  "0 0 20px rgba(139, 92, 246, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wand2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">Preset Wizard</h1>
              <p className="text-text-secondary">Quick setup for your development workspace</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-accent-blue text-white' 
                      : 'bg-bg-quaternary text-text-muted'
                  }`}
                  animate={index === currentStep ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </motion.div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    index <= currentStep ? 'text-text-primary' : 'text-text-muted'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-text-muted">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                    index < currentStep ? 'bg-accent-blue' : 'bg-bg-quaternary'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between items-center mt-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={`ai-button-secondary flex items-center space-x-2 ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={prevStep}
            disabled={currentStep === 0}
            whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentStep ? 'bg-accent-blue' : 'bg-bg-quaternary'
                }`}
              />
            ))}
          </div>

          <motion.button
            className={`ai-button flex items-center space-x-2 ${
              currentStep === 0 && !selectedPreset ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={nextStep}
            disabled={currentStep === 0 && !selectedPreset}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            {currentStep === steps.length - 1 ? (
              <Download className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PresetWizard;