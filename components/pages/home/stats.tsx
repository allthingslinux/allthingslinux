'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

// Stats data with minimal information
const statsData = [
  { id: 1, value: '5M+', description: 'messages' },
  { id: 2, value: '7K+', description: 'members' },
  { id: 3, value: '35K+', description: 'voice hours' },
  { id: 4, value: '30+', description: 'staff members' },
  { id: 5, value: '500+', description: 'support threads' },
  { id: 6, value: '6+', description: 'projects' },
];

// Stat card component
const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof statsData)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="p-6 border border-border/40 hover:border-primary/20 transition-colors bg-card backdrop-blur-sm">
        <div className="text-center">
          <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {stat.value}
          </p>
          <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
            {stat.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

const Stats = memo(() => {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Our community by the numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

Stats.displayName = 'Stats';

export default Stats;
