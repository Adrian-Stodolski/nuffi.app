import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const shortcuts = useKeyboardShortcuts();
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      firstElement?.focus();
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.metaKey) keys.push('Cmd');
    if (shortcut.shiftKey) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative glass-card max-w-md w-full max-h-[80vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 191, 255, 0.3)",
                      "0 0 30px rgba(0, 191, 255, 0.5)",
                      "0 0 20px rgba(0, 191, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Keyboard className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 id="shortcuts-title" className="text-xl font-bold text-text-primary">Keyboard Shortcuts</h2>
                  <p className="text-text-secondary text-sm">Navigate faster with these shortcuts</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-bg-quaternary rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close keyboard shortcuts"
              >
                <X className="w-5 h-5 text-text-muted" />
              </motion.button>
            </div>

            {/* Shortcuts List */}
            <div className="p-6 space-y-3">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-quaternary/30 hover:bg-bg-quaternary/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-text-secondary">{shortcut.description}</span>
                  <motion.div
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    {formatShortcut(shortcut).split(' + ').map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="px-2 py-1 text-xs font-mono bg-bg-tertiary border border-border rounded text-text-primary">
                          {key}
                        </kbd>
                        {keyIndex < formatShortcut(shortcut).split(' + ').length - 1 && (
                          <span className="text-text-muted text-xs">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <p className="text-text-muted text-sm text-center">
                Press <kbd className="px-2 py-1 text-xs font-mono bg-bg-tertiary border border-border rounded">?</kbd> to toggle this help
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};