'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';

// Stats data with minimal information
const statsData = [
  { id: 1, value: '5.5M+', description: 'messages' },
  { id: 2, value: '7.5K+', description: 'members' },
  { id: 3, value: '40K+', description: 'voice hours' },
  { id: 4, value: '30+', description: 'staff members' },
  { id: 5, value: '600+', description: 'support threads' },
  { id: 6, value: '6+', description: 'projects' },
];

// Stat card component
const StatCard = ({ stat }: { stat: (typeof statsData)[0] }) => {
  return (
    <Card className="p-8 border border-border/40 hover:border-primary/20">
      <div className="text-center">
        <p className="text-4xl font-bold mb-2">{stat.value}</p>
        <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
          {stat.description}
        </p>
      </div>
    </Card>
  );
};

const Stats = memo(() => {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16">
          Our community by the numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
});

Stats.displayName = 'Stats';

export default Stats;
