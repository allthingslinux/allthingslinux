import Values from '@/components/blocks/values';

export default function About() {
  return (
    <>
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-6">
          <div className="mx-auto max-w-4xl lg:mx-0 lg:max-w-none">
            <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
              About Our Organization
            </h1>
            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-14 text-base leading-7 lg:max-w-none lg:grid-cols-2">
              <div>
                <p className="text-justify">
                  We are a vibrant and inclusive organization dedicated to
                  promoting the spirit and growth of Linux. We are a diverse
                  community of over 5,000 enthusiasts, passionate about
                  advancing technology and sharing knowledge. Our mission is to
                  develop tools, create self-hosted projects, and curate
                  educational resources that enrich the Linux ecosystem and
                  enhance user experiences.
                </p>
                <p className="mt-8 text-justify">
                  At the core of All Things Linux is our unwavering values and
                  code of conduct, ensuring that everyone—regardless of their
                  background or skill level—feels welcome to engage in
                  meaningful discussions and exciting projects. We celebrate
                  diversity, valuing various perspectives that keep our
                  community dynamic and engaging. Our focus on learning and
                  support empowers newcomers to confidently explore the vast
                  world of Linux.
                </p>
              </div>
              <div>
                <p className="text-justify">
                  As we transition into a 501(c)(3) nonprofit organization,
                  transparency and accountability remain fundamental to our
                  operations. We build trust through accessible logs, metrics,
                  open dialogue, and regular community-driven decision-making
                  processes, fostering strong and supportive relationships among
                  our members.
                </p>
                <p className="mt-8 text-justify">
                  Our ongoing development includes collaborative initiatives
                  such as Discord bots, wikis, and self-hosted tools, forming a
                  comprehensive educational framework enriched by our collective
                  expertise. Join us on our journey as we continue to explore
                  limitless possibilities and contribute to the future of
                  open-source technology.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Values />
      </section>
    </>
  );
}
