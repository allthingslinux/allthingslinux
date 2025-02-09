import { memo } from 'react';

const statsData = [
  { id: 1, value: '5M+', description: 'messages' },
  { id: 2, value: '7K+', description: 'members and counting' },
  { id: 3, value: '35K+', description: 'voice hours' },
  { id: 4, value: '30+', description: 'staff members trained' },
  { id: 5, value: '500+', description: 'support threads solved' },
  { id: 6, value: '6+', description: 'projects managed' },
];

const Stats = memo(() => {
  return (
    <section className="py-32 bg-catppuccin-mantle">
      <div className="">
        <h2 className="text-center text-3xl font-semibold lg:text-5xl">
          Stats and Achievements
        </h2>
        <div className="grid gap-10 pt-9 sm:grid-cols-2 md:grid-cols-3 lg:gap-0 lg:pt-15">
          {statsData.map((stat) => (
            <div className="text-center" key={stat.id}>
              <p className="pt-4 text-5xl font-semibold lg:pt-10 text-catppuccin-text">
                {stat.value}
              </p>
              <p className="text-xl font-semibold text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Stats.displayName = 'Stats';

export default Stats;
