import { memo } from 'react';
import { Card } from '@/components/ui/card';
import {
  ArrowUpRight,
  FileText,
  GitFork,
  GraduationCap,
  Heart,
  LifeBuoy,
  Lock,
  Shield,
  Users,
  Users2,
} from 'lucide-react';
import Link from 'next/link';

const valuesList = [
  {
    id: 1,
    title: 'Community',
    description:
      'We connect over 20,000 Linux enthusiasts through collaboration and knowledge sharing. Our regular events allow members to demonstrate their skills, with prizes enhancing a spirit of friendly competition.',
    icon: Users,
  },
  {
    id: 2,
    title: 'Mutual Respect',
    description:
      'Mutual respect is key as outlined in our Code of Conduct, stressing the importance of treating everyone with kindness and consideration, free from discrimination.',
    icon: Heart,
  },
  {
    id: 3,
    title: 'Inclusivity',
    description:
      'We are committed to creating an environment where all members, irrespective of their background, differences, or skills, feel welcomed and empowered to engage in meaningful discussions.',
    icon: Users2,
  },
  {
    id: 4,
    title: 'Collaboration',
    description:
      'Our community thrives on collaboration, fostering creative teamwork and open-source contributions. We engage in collaborative projects including our wiki, Discord bot, and self-hosted tools.',
    icon: GitFork,
  },
  {
    id: 5,
    title: 'Support',
    description:
      'We offer a dedicated space for members to seek help and guidance, with experienced users actively responding in our support forums. We aim to cultivate a culture of understanding.',
    icon: LifeBuoy,
  },
  {
    id: 6,
    title: 'Education',
    description:
      'Learning and growth are our priorities. We encourage members to share their knowledge, resources, and insights, particularly in our support forums and educational channels.',
    icon: GraduationCap,
  },
  {
    id: 7,
    title: 'Integrity',
    description:
      'Accountability and honesty are essential to our community, with both staff and members encouraged to acknowledge and learn from their mistakes. Our commitment to integrity sets us apart.',
    icon: Shield,
  },
  {
    id: 8,
    title: 'Transparency',
    description:
      'Openness in community operations is vital, including accessible moderation logs, transparent spending, and regular community decision voting. We believe that transparency fosters trust.',
    icon: Lock,
  },
  {
    id: 9,
    title: 'Code of Conduct',
    description:
      'Our Code of Conduct outlines the standards for interaction in our community. Please read our guidelines to understand your role in upholding our community values.',
    icon: FileText,
    isHighlighted: true,
    link: '/code-of-conduct',
  },
];

const Values = memo(() => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
          Our Values
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground px-0 sm:px-4 md:px-6">
          The principles that guide our organization and community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {valuesList.map((value) => {
          const Icon = value.icon;
          const isHighlighted = value.isHighlighted;

          const cardContent = (
            <>
              <div
                className={`inline-flex items-center justify-center p-2 rounded-lg ${isHighlighted ? 'bg-primary/20' : 'bg-primary/10'} mb-3 sm:mb-4`}
              >
                <Icon
                  className={`size-5 sm:size-6 ${isHighlighted ? 'text-primary' : 'text-primary/80'}`}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 flex items-center gap-1">
                {value.title}
                {isHighlighted && value.link && (
                  <ArrowUpRight className="size-3.5 sm:size-4 inline-flex" />
                )}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {value.description}
              </p>
            </>
          );

          return isHighlighted && value.link ? (
            <Link
              key={value.id}
              href={value.link}
              className="block transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <Card
                className={`relative p-3 sm:p-4 md:p-5 h-full border ${isHighlighted ? 'border-primary/30 bg-card/50' : 'border-border/50'} hover:shadow-sm`}
              >
                {cardContent}
              </Card>
            </Link>
          ) : (
            <Card
              key={value.id}
              className={`relative p-3 sm:p-4 md:p-5 h-full border ${isHighlighted ? 'border-primary/30 bg-card/50' : 'border-border/50'}`}
            >
              {cardContent}
            </Card>
          );
        })}
      </div>
    </section>
  );
});

Values.displayName = 'Values';

export default Values;
