import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
  isDark: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: "rgba(40, 167, 69, 0.8)",
  error: "rgba(220, 53, 69, 0.8)",
  info: "rgba(0, 123, 255, 0.8)",
  warning: "rgba(255, 193, 7, 0.8)",
};

const CustomToast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  isDark,
}) => {
  const Icon = iconMap[type];
  const backgroundColor = colorMap[type];

  const glassBackground = isDark
    ? `linear-gradient(135deg, ${backgroundColor.replace('0.8', '0.2')}, ${backgroundColor.replace('0.8', '0.1')})`
    : `linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))`;

  const glassBorder = isDark
    ? `1px solid ${backgroundColor.replace('0.8', '0.4')}`
    : `1px solid rgba(255, 255, 255, 0.8)`;

  const textColor = isDark ? 'white' : '#333';
  const textShadow = isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center space-x-3"
      style={{
        background: glassBackground,
        backdropFilter: "blur(15px) saturate(180%)",
        WebkitBackdropFilter: "blur(15px) saturate(180%)",
        border: glassBorder,
        color: textColor,
      }}
    >
      <Icon size={24} className="flex-shrink-0" style={{ color: textColor }} />
      <span className="font-medium text-lg" style={{ textShadow: textShadow }}>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        style={{ color: textColor }}
      >
        <XCircle size={18} />
      </button>
    </motion.div>
  );
};

export default CustomToast;

interface ToastState {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning",
      duration?: number
    ) => {
      const id = Math.random().toString(36).substring(2, 9); // Simple unique ID
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, message, type, duration },
      ]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};
