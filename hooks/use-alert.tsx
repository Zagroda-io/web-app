"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type AlertVariant = "default" | "destructive" | "success" | "info";

interface AlertOptions {
  title?: string;
  description: string;
  variant?: AlertVariant;
  duration?: number;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: (id: string) => void;
}

interface AlertInstance extends AlertOptions {
  id: string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const showAlert = useCallback(({ title, description, variant = "default", duration = 5000 }: AlertOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, title, description, variant, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        hideAlert(id);
      }, duration);
    }
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const getIcon = (variant: AlertVariant | undefined) => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle2 className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Terminal className="h-4 w-4" />
    }
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <Alert variant={alert.variant === "success" || alert.variant === "info" ? "default" : alert.variant}>
                {getIcon(alert.variant)}
                <div className="flex-1">
                  {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                  <AlertDescription>{alert.description}</AlertDescription>
                </div>
                <button
                  onClick={() => hideAlert(alert.id)}
                  className="absolute top-3 right-3 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
