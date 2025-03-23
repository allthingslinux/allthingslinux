import { getPageMetadata } from '../metadata';
import Values from '@/components/pages/about/values';

export const metadata = getPageMetadata('about');

export const dynamic = 'force-static';

export default function About() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <section className="page-padding pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            About Our Organization
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-0 sm:px-4 md:px-6">
            Fostering a vibrant community of Linux enthusiasts through
            education, collaboration, and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90">
                Our Community
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                We are a diverse community of over 7,500 Linux enthusiasts,
                passionate about advancing technology and sharing knowledge. Our
                organization is dedicated to promoting the spirit and growth of
                Linux through collaboration and innovation.
              </p>
            </div>

            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                We develop tools, create self-hosted projects, and curate
                educational resources that enrich the Linux ecosystem. Through
                these efforts, we aim to enhance user experiences and make Linux
                more accessible to newcomers.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 mt-4 md:mt-0">
            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90">
                Our Values
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                At the core of All Things Linux is our commitment to inclusivity
                and diversity. Our code of conduct ensures everyone feels
                welcome, regardless of background or skill level. We value
                different perspectives and foster a supportive environment for
                learning and growth.
              </p>
            </div>

            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90">
                Our Future
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                As a 501(c)(3) nonprofit, we prioritize transparency and
                community-driven decisions. Our ongoing development includes
                Discord bots, wikis, and self-hosted tools. Join us as we
                explore possibilities and contribute to the future of
                open-source technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Values />
    </div>
  );
}
