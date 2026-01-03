'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';

// Stats data with minimal information
const statsData = [
  { id: 1, value: '10M+', description: 'messages' },
  { id: 2, value: '18K+', description: 'members' },
  { id: 3, value: '68K+', description: 'voice hours' },
  { id: 4, value: '40+', description: 'volunteers and staff' },
  { id: 5, value: '2K+', description: 'solved support posts' },
  { id: 6, value: '10+', description: 'projects in development' },
];

// Stat card component
const StatCard = ({ stat }: { stat: (typeof statsData)[0] }) => {
  return (
    <Card className="p-8 border border-border/40 hover:border-primary/20">
      <div className="text-center">
        <p className="text-3xl font-bold mb-2">{stat.value}</p>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {stat.description}
        </p>
      </div>
    </Card>
  );
};

const Stats = memo(() => {
  return (
    <section className="py-4 md:py-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold text-center mb-12">
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
