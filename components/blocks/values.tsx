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
      'We connect over 5,000 Linux enthusiasts through collaboration and knowledge sharing. Our regular events allow members to demonstrate their skills, with prizes enhancing a spirit of friendly competition. Our lively VC community enables real-time connections and loads of fun.',
    icon: Users,
  },
  {
    id: 2,
    title: 'Mutual Respect',
    description:
      'Mutual respect is key as outlined in our Code of Conduct, stressing the importance of treating everyone with kindness and consideration, free from discrimination. We promote open dialogue & offer a reporting system for any issues that may arise.',
    icon: Heart,
  },
  {
    id: 3,
    title: 'Inclusivity',
    description:
      'We are committed to creating an environment where all members, irrespective of their background, differences, or skills, feel welcomed and empowered to engage in meaningful discussions. We actively promote diversity and encourage a wide range of perspectives.',
    icon: Users2,
  },
  {
    id: 4,
    title: 'Collaboration',
    description:
      'Our community thrives on collaboration, fostering creative teamwork and open-source contributions. We engage in collaborative projects, including our code of conduct, wiki, Discord bot, and self-hosted tools, all aimed at enhancing the community experience.',
    icon: GitFork,
  },
  {
    id: 9,
    title: 'Code of Conduct',
    description:
      'Our Code of Conduct outlines the standards for interaction in our community. Please read our guidelines to understand your role in upholding our community values.',
    icon: FileText,
  },
  {
    id: 5,
    title: 'Support',
    description:
      'We offer a dedicated space for members to seek help and guidance, with experienced and committed users actively responding in our support forums. We aim to cultivate a culture of understanding, where everyone can find assistance and encouragement.',
    icon: LifeBuoy,
  },
  {
    id: 6,
    title: 'Education',
    description:
      'Learning and growth are our priorities. We encourage members to share their knowledge, resources, and insights, particularly in our support forums. We focus on educating new users to navigate the vast Linux landscape and develop their skills.',
    icon: GraduationCap,
  },
  {
    id: 7,
    title: 'Integrity',
    description:
      'Accountability and honesty are essential to our community, with both staff and members encouraged to acknowledge and learn from their mistakes. Our commitment to integrity sets us apart and contributes to our exceptional growth.',
    icon: Shield,
  },
  {
    id: 8,
    title: 'Transparency',
    description:
      'Openness in community operations is vital, including accessible moderation logs, transparent spending, and regular community decision voting. We believe that transparency fosters trust and accountability and our relationships among all members.',
    icon: Lock,
  },
];

export default function Values() {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-16 mx-auto max-w-full">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Our Values
          </h2>
          <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed">
            The principles that guide our organization and community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valuesList.map((value) => {
            const Icon = value.icon;
            const isCodeOfConduct = value.id === 9;

            return (
              <Card
                key={value.id}
                className={`relative rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 ${
                  isCodeOfConduct
                    ? 'bg-blue-900/50 text-white border-cyan-300'
                    : 'bg-slate-900 border-slate-800'
                } hover:shadow-xl hover:translate-y-2`}>
                {isCodeOfConduct ? (
                  <Link href="/code-of-conduct" passHref>
                    <div className="relative p-6 space-y-4 rounded-lg z-10 block">
                      <div
                        className={`inline-flex items-center justify-center p-2 rounded-lg bg-blue-500/50`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">
                        {value.title}{' '}
                        <ArrowUpRight className="w-4 h-4 inline-block" />
                      </h3>
                      <p className="text-slate-300">{value.description}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="relative p-6 space-y-4 rounded-lg z-10 block">
                    <div
                      className={`inline-flex items-center justify-center p-2 rounded-lg bg-blue-900/50`}>
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-cyan-400">
                      {value.title}
                    </h3>
                    <p className="text-slate-300">{value.description}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
