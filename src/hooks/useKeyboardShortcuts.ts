import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      ctrlKey: true,
      action: () => navigate('/'),
      description: 'Go to Home'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => navigate('/create'),
      description: 'Create New Workspace'
    },
    {
      key: 'w',
      ctrlKey: true,
      action: () => navigate('/workspaces'),
      description: 'View Themed Workspaces'
    },
    {
      key: 'm',
      ctrlKey: true,
      action: () => navigate('/marketplace'),
      description: 'Open Marketplace'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => navigate('/ai-center'),
      description: 'Open AI Center'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => navigate('/scanner'),
      description: 'System Scanner'
    },
    {
      key: ',',
      ctrlKey: true,
      action: () => navigate('/settings'),
      description: 'Open Settings'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === (event.ctrlKey || event.metaKey) &&
        !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return shortcuts;
};