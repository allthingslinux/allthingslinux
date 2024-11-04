// import { CircleArrowRight, Files, Settings } from 'lucide-react';

// const About = () => {
//   return (
//     <section className="py-32">
//       <div className="container flex flex-col gap-28">
//         <div className="flex flex-col gap-7">
//           <h1 className="text-4xl font-semibold lg:text-7xl">About Us</h1>
//           <p className="text-lg">
// All Things Linux is a dynamic and inclusive organization dedicated to
// championing the spirit and philosophy of Linux and open-source technology. We
// bring together a diverse community of over 5,000 enthusiasts who are united by
// their passion for technology and knowledge sharing. Our mission extends to
// developing tools, self-hosted projects, and creating a wealth of learning
// materials, enhancing the user experience and promoting a deeper understanding
// of the Linux ecosystem.
//           </p>
//           <p className="text-lg">
// We’re all about sticking to our core values and code of conduct, making sure
// everyone here (no matter their background or skill level) feels welcome to
// join in on cool discussions and projects. We’re big on diversity and love
// hearing all kinds of perspectives to keep things interesting. Plus, with our
// focus on learning and support, we’re here to help newcomers dive into the
// Linux world with confidence.
//           </p>
//           <p className="text-lg">
// As All Things Linux evolves into a 501(c)(3) nonprofit organization,
// transparency and accountability remain at the heart of our operations. Through
// accessible logs and metrics, open dialogue, and regular community
// decision-making, we build trust and cultivate strong, supportive relationships
// among our members. Our ongoing development includes collaborative initiatives
// like Discord bots, wikis, and self-hosted tools, creating a robust educational
// framework enhanced by our collective expertise. Join us on our journey as we
// continue to explore limitless possibilities and contribute to the future of
// open-source technology.
//           </p>
//         </div>

//         <div className="grid gap-10 md:grid-cols-2">
//           <div>
//             <p className="mb-10 text-sm font-medium text-muted-foreground">
//               JOIN OUR TEAM
//             </p>
//             <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
//               We&apos;re changing how software is made
//             </h2>
//           </div>
//           <div>
//             <img
//               src="https://www.shadcnblocks.com/images/block/placeholder.svg"
//               alt="placeholder"
//               className="mb-6 max-h-36 w-full rounded-xl object-cover"
//             />
//             <p className="text-muted-foreground">
//               And we&apos;re looking for the right people to help us do it. If you&apos;re
//               passionate about making change in the world, this might be the place for you
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default About;

const timeline = [
  {
    name: 'Founded company',
    description:
      'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
    date: 'Aug 2021',
    dateTime: '2021-08',
  },
  {
    name: 'Secured $65m in funding',
    description:
      'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
    date: 'Dec 2021',
    dateTime: '2021-12',
  },
  {
    name: 'Released beta',
    description:
      'Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.',
    date: 'Feb 2022',
    dateTime: '2022-02',
  },
  {
    name: 'Global launch of product',
    description:
      'Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.',
    date: 'Dec 2022',
    dateTime: '2022-12',
  },
];

export default function About() {
  return (
    <section className="py-32">
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-6">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <p className="text-base font-semibold leading-7">
              All Things Linux
            </p>
            <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
              About Our Organization
            </h1>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-14 text-base leading-7 lg:max-w-none lg:grid-cols-2">
              <div>
                <p className="text-balance">
                  We are a vibrant and inclusive organization dedicated to
                  promoting the spirit and growth of Linux. We are a diverse
                  community of over 5,000 enthusiasts, passionate about
                  advancing technology and sharing knowledge. Our mission is to
                  develop tools, create self-hosted projects, and curate
                  educational resources that enrich the Linux ecosystem and
                  enhance user experiences.
                </p>
                <p className="mt-8 text-balance">
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
                <p className="text-balance">
                  As we transition into a 501(c)(3) nonprofit organization,
                  transparency and accountability remain fundamental to our
                  operations. We build trust through accessible logs, metrics,
                  open dialogue, and regular community-driven decision-making
                  processes, fostering strong and supportive relationships among
                  our members.
                </p>
                <p className="mt-8 text-balance">
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
      </div>
    </section>
  );
}
