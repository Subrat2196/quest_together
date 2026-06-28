import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastData {
  id: string;
  icon: string;
  title: string;
  message: string;
  type?: 'success' | 'achievement' | 'levelup' | 'info';
}

interface Props {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-20 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 max-w-sm ml-auto">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const [, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const gradients: Record<string, string> = {
    achievement: 'from-primary/95 to-primary-dark/95',
    levelup: 'from-gold/95 to-fire-warm/95',
    success: 'from-success/95 to-success-light/90',
    info: 'from-bg-card/95 to-bg-elevated/95',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`bg-gradient-to-r ${gradients[toast.type || 'info']} backdrop-blur-xl rounded-2xl p-3.5 border border-white/10 shadow-2xl cursor-pointer`}
      onClick={() => onDismiss(toast.id)}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className="text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.5 }}
        >
          {toast.icon}
        </motion.span>
        <div>
          <div className="text-sm font-bold text-white">{toast.title}</div>
          <div className="text-xs text-white/80">{toast.message}</div>
        </div>
      </div>
    </motion.div>
  );
}
