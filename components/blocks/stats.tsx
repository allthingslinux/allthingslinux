const Stats = () => {
  return (
    <section className="py-32 bg-[#1A1B26]">
      <div className="container">
        <h1 className="text-center text-4xl font-semibold lg:text-6xl">
          Stats and Achievements
        </h1>
        <div className="grid gap-10 pt-9 md:grid-cols-3 lg:gap-0 lg:pt-20">
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">3.5M+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              messages
            </p>
          </div>
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">5K+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              members and counting
            </p>
          </div>
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">30K+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              voice hours
            </p>
          </div>
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">30+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              staff members trained
            </p>
          </div>
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">400+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              support threads solved
            </p>
          </div>
          <div className="text-center">
            <p className="pt-4 text-7xl font-semibold lg:pt-10">5+</p>
            <p className="text-2xl font-semibold text-muted-foreground">
              projects managed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
