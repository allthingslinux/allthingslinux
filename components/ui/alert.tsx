import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Terminal,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps {
  children: React.ReactNode;
  title?: string;
  type?:
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'tip'
    | 'code'
    | 'important'
    | 'note'
    | 'caution';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

// Map legacy alert types to new types
const legacyTypeMap: Record<string, string> = {
  important: 'error',
  note: 'info',
  caution: 'warning',
};

export function Alert({
  children,
  title,
  type = 'info',
  dismissible = false,
  onDismiss,
  className,
  icon,
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  // Convert legacy type names to new type names
  const normalizedType = legacyTypeMap[type] || type;

  const typeClasses = {
    info: {
      container: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
      title: 'text-blue-700 dark:text-blue-300',
      content: 'text-blue-600 dark:text-blue-300/90',
      icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
    },
    warning: {
      container: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
      title: 'text-amber-700 dark:text-amber-300',
      content: 'text-amber-600 dark:text-amber-300/90',
      icon: (
        <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      ),
    },
    error: {
      container: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
      title: 'text-red-700 dark:text-red-300',
      content: 'text-red-600 dark:text-red-300/90',
      icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    },
    success: {
      container: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
      title: 'text-green-700 dark:text-green-300',
      content: 'text-green-600 dark:text-green-300/90',
      icon: (
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      ),
    },
    tip: {
      container: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
      title: 'text-purple-700 dark:text-purple-300',
      content: 'text-purple-600 dark:text-purple-300/90',
      icon: <Info className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
    },
    code: {
      container: 'border-l-gray-500 bg-gray-50/50 dark:bg-gray-800/40',
      title: 'text-gray-700 dark:text-gray-300',
      content: 'text-gray-600 dark:text-gray-300/90',
      icon: <Terminal className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
    },
  };

  // Get the correct type style or fall back to info if type is unknown
  const typeStyle =
    typeClasses[normalizedType as keyof typeof typeClasses] || typeClasses.info;

  return (
    <div
      className={cn(
        'relative mt-3 mb-2 rounded-sm border-l-2 border-transparent pt-3 pb-2 px-3 bg-opacity-50',
        typeStyle.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">{icon || typeStyle.icon}</div>

        <div className="flex-1 min-w-0">
          {title && (
            <div className={cn('text-sm font-medium mb-0.5', typeStyle.title)}>
              {title}
            </div>
          )}
          <div className={cn('text-sm', typeStyle.content)}>{children}</div>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-1 p-0.5 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
