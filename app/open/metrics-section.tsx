import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number | null;
  description?: string;
  highlight?: 'primary' | 'success' | 'warning';
  comingSoon?: boolean;
}

function MetricCard({
  label,
  value,
  description,
  highlight,
  comingSoon = false,
}: MetricCardProps) {
  const highlightClasses = {
    primary: 'bg-primary/10 border-primary/20',
    success: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-orange-500/10 border-orange-500/20',
  };

  const valueClasses = {
    primary: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-orange-600 dark:text-orange-400',
  };

  const isComingSoon = comingSoon || value === null || value === 0;

  return (
    <Card
      className={`${
        highlight ? highlightClasses[highlight] : ''
      } transition-all hover:shadow-md ${
        isComingSoon ? 'opacity-75' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </div>
        {isComingSoon ? (
          <div className="text-2xl font-semibold text-muted-foreground/60">
            Coming soon
          </div>
        ) : (
          <div
            className={`text-3xl font-bold ${
              highlight ? valueClasses[highlight] : ''
            }`}
          >
            {value}
          </div>
        )}
        {description && (
          <div className="text-xs text-muted-foreground mt-2">{description}</div>
        )}
      </CardContent>
    </Card>
  );
}

export async function MetricsSection() {
  // Community and organization metrics - coming soon
  const metrics = [
    {
      label: 'Monthly Visitors',
      value: null,
      description: 'Website traffic',
      highlight: 'primary' as const,
      comingSoon: true,
    },
    {
      label: 'Active Contributors',
      value: null,
      description: 'Community members',
      highlight: 'success' as const,
      comingSoon: true,
    },
    {
      label: 'Open Projects',
      value: null,
      description: 'Active initiatives',
      comingSoon: true,
    },
    {
      label: 'Community Members',
      value: null,
      description: 'Discord & GitHub',
      highlight: 'primary' as const,
      comingSoon: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
