import React from 'react';

type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
}

export function Alert({ type, title, children }: AlertProps) {
  return (
    <div className={`markdown-alert markdown-alert-${type}`}>
      <p className="markdown-alert-title">
        {title || type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
      {children}
    </div>
  );
}
