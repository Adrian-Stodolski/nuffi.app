import React from 'react';

export interface ThemedWorkspace {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  tools: string[];
  setupTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  downloads?: number;
  rating?: number;
  features?: string[];
  requirements?: {
    os: string[];
    diskSpace: string;
    ram: string;
  };
}

export interface InstallationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  logs: string[];
}