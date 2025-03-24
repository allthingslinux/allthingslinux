import React from 'react';
import {
  Alert as AlertUI,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';
import {
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
}

const alertTypeConfig: Record<
  AlertType,
  {
    icon: React.ReactNode;
    className: string;
  }
> = {
  note: {
    icon: <InfoIcon />,
    className:
      'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-200',
  },
  tip: {
    icon: <LightbulbIcon />,
    className:
      'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-900 dark:text-green-200',
  },
  important: {
    icon: <CheckCircleIcon />,
    className:
      'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/50 dark:border-purple-900 dark:text-purple-200',
  },
  warning: {
    icon: <AlertTriangleIcon />,
    className:
      'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-200',
  },
  caution: {
    icon: <AlertCircleIcon />,
    className:
      'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-900 dark:text-red-200',
  },
};

export function Alert({ type, title, children }: AlertProps) {
  const config = alertTypeConfig[type];

  return (
    <AlertUI className={cn('my-6', config.className)}>
      {config.icon}
      {title && (
        <AlertTitle>
          {title || type.charAt(0).toUpperCase() + type.slice(1)}
        </AlertTitle>
      )}
      <AlertDescription>{children}</AlertDescription>
    </AlertUI>
  );
}
