const Stats = () => {
  return (
    <section className='py-32'>
      <div className='container'>
        <h1 className='text-center text-4xl font-semibold lg:text-6xl'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <div className='grid gap-10 pt-9 md:grid-cols-3 lg:gap-0 lg:pt-20'>
          <div className='text-center'>
            <p className='text-sm font-medium text-muted-foreground'>
              Reduce your time to hire by
            </p>
            <p className='pt-4 text-7xl font-semibold lg:pt-10'>5,000+</p>
            <p className='text-2xl font-semibold text-muted-foreground'>
              members and counting
            </p>
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium text-muted-foreground'>
              Clients have seen a decrease in
            </p>
            <p className='pt-4 text-7xl font-semibold lg:pt-10'>3.5M+</p>
            <p className='text-2xl font-semibold text-muted-foreground'>
              messages
            </p>
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium text-muted-foreground'>
              The average number of hires per
            </p>
            <p className='pt-4 text-7xl font-semibold lg:pt-10'>500+</p>
            <p className='text-2xl font-semibold text-muted-foreground'>
              support threads solved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
