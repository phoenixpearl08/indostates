import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextValue {
  showNotification: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newItem: NotificationItem = { id, type, title, message };
    setNotifications((prev) => [...prev, newItem]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 5500);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100% - 3rem)',
          pointerEvents: 'none'
        }}
      >
        {notifications.map((item) => (
          <div
            key={item.id}
            role="status"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              backgroundColor: '#ffffff',
              border: `1px solid ${
                item.type === 'success'
                  ? '#86efac'
                  : item.type === 'error'
                  ? '#fca5a5'
                  : '#93c5fd'
              }`,
              borderLeft: `5px solid ${
                item.type === 'success'
                  ? 'var(--color-success)'
                  : item.type === 'error'
                  ? 'var(--color-emergency)'
                  : 'var(--color-primary-light)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {item.type === 'success' && <CheckCircle2 size={20} color="var(--color-success)" />}
              {item.type === 'error' && <AlertCircle size={20} color="var(--color-emergency)" />}
              {item.type === 'info' && <Info size={20} color="var(--color-primary-light)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-main)',
                  marginBottom: '2px'
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {item.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(item.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                padding: '2px',
                lineHeight: 1
              }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
