const Stats = () => {
  const statsData = [
    { id: 1, value: '3.5M+', description: 'messages' },
    { id: 2, value: '5K+', description: 'members and counting' },
    { id: 3, value: '30K+', description: 'voice hours' },
    { id: 4, value: '30+', description: 'staff members trained' },
    { id: 5, value: '400+', description: 'support threads solved' },
    { id: 6, value: '5+', description: 'projects managed' }
  ];

  return (
    <section className="py-32 bg-catppuccin-mantle">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold lg:text-5xl">
          Stats and Achievements
        </h2>
        <div className="grid gap-10 pt-9 md:grid-cols-3 lg:gap-0 lg:pt-15">
          {statsData.map((stat) => (
            <div className="text-center" key={stat.id}>
              <p className="pt-4 text-6xl font-semibold lg:pt-10">{stat.value}</p>
              <p className="text-xl font-semibold text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;