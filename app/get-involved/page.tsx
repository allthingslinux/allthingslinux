import { ArrowDown, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridPattern } from '@/components/ui/grid-pattern';

const Opportunities = () => {
  const opportunities = [
    {
      category: 'Community & Moderation',
      openings: [
        {
          title: 'Moderator',
          description:
            'Moderators are responsible for enforcing our Code of Conduct and keeping the community safe and welcoming. They are the first line of defense and backbone of the community.',
          link: '/apply/mod',
        },
        {
          title: 'Senior Moderator',
          description:
            'Senior Moderators are responsible for overseeing Moderator actions, resolving complex disputes, and keeping the Moderator team running smoothly with wisdom and support.',
          link: '/apply/sr-mod',
        },
        {
          title: 'Assistant Administrator',
          description:
            'The Assistant Administrator is responsible for supporting Administrators in the day-to-day running of the community. They help with note taking, task management, and other administrative duties.',
          link: '/apply/admin-assistant ',
        },
        {
          title: 'Director of Moderation',
          description:
            'The Director of Moderation is responsible for overseeing the entire moderation team. They establish tone and culture for the team, develop policies and procedures, and onboard new moderators.',
          link: '/apply/mod-director',
        },
        {
          title: 'Administrator',
          description:
            'Administrators are responsible for the overall management of the community. They set the vision and direction for the community, make key decisions, and act as a liaison between community and staff.',
          link: '/apply/admin',
        },
      ],
    },
    {
      category: 'Systems & Development',
      openings: [
        {
          title: 'MediaWiki Administrator',
          description:
            'The MediaWiki Administrator is responsible for maintaining and improving our wiki. They manage user permissions, handle technical issues, and ensure that the wiki is up to date and running smoothly.',
          link: '/apply/wiki-admin',
        },
        {
          title: 'Web Developer',
          description:
            'Web Developers, whether frontend or backend, are responsible for rolling out any web-based projects. They work closely with the creative team and other system administrators to bring these projects to life.',
          link: '/apply/web-dev',
        },
        {
          title: 'Python Developer',
          description:
            'Python Developers are responsible for developing and maintaining our open source bot, Tux. They are responsible for adding new features, fixing bugs, and listening to community feedback.',
          link: '/apply/python-dev',
        },
      ],
    },
    {
      category: 'Creative Direction & Design',
      openings: [
        {
          title: 'Creative Director',
          description:
            'The Creative Director is responsible for developing and establishing our creative vision. They oversee all design, branding and marketing efforts, and ensure that we maintain a consistent visual identity.',
          link: '/apply/creative-director',
        },
        {
          title: 'Graphic Designer',
          description:
            'Graphic Designers are responsible for creating visual assets and branding. They work closely with the creative team to develop logos, emojis, banners, and other visual elements as needed.',
          link: '/apply/graphic-designer',
        },
      ],
    },
  ];

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="text-3xl font-bold md:text-5xl">How you can help</h1>
          <div className="mx-auto mt-14 flex flex-col gap-16">
            {opportunities.map((oppCategory) => (
              <div key={oppCategory.category}>
                <Badge variant="outline" className="px-2 mb-2">
                  {oppCategory.category}
                </Badge>
                <div>
                  {oppCategory.openings.map((opp) => (
                    <div key={opp.title} className="group block border-b py-7">
                      <h2 className="text-2xl font-semibold">{opp.title}</h2>
                      <p className="mt-1 font-medium text-muted-foreground">
                        {opp.description}
                      </p>
                      <div className="mt-6 flex justify-between gap-4">
                        <Button variant="outline">
                          Apply Now
                          <Link className="ml-2" href={opp.link}>
                            <ArrowRight />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const GetInvolvedHero = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <GridPattern className="absolute hidden opacity-25 [mask-image:linear-gradient(to_right,white,transparent,transparent,white)] lg:block" />

          <div className="z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
            <Badge variant="outline">
              Open Positions
              <ArrowDown className="ml-2 size-4" />
            </Badge>

            <div>
              <h1 className="mb-6 text-pretty text-4xl font-bold lg:text-7xl">
                Get Involved
              </h1>

              <p className="text-muted-foreground lg:text-xl">
                All Things Linux is a community-driven project so we are always
                looking for help with our mission. Whether you are a veteran developer
                or just starting out, there are plenty of ways to get involved and make a difference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GetInvolved = () => {
  return (
    <>
      <GetInvolvedHero />
      <Opportunities />
    </>
  );
};

export default GetInvolved;
