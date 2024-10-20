const valuesLIst = [
  {
    id: 1,
    title: "Community",
    description:
      "We connect over 5,000 Linux enthusiasts through collaboration and knowledge sharing. Our regular events allow members to demonstrate their skills, with prizes enhancing a spirit of friendly competition. Our lively VC community enables real-time connections and loads of fun.",
  },
  {
    id: 2,
    title: "Mutual Respect",
    description:
      "Mutual respect is key as outlined in our Code of Conduct, stressing the importance of treating everyone with kindness and consideration, free from discrimination. We promote open dialogue & offer a reporting system for any issues that may arise.",
  },
  {
    id: 3,
    title: "Inclusivity",
    description:
      "We are committed to creating an environment where all members, irrespective of their background, differences, or experience level, feel welcomed and empowered to engage in meaningful discussions. We actively promote diversity and encourage a wide range of perspectives.",
  },
  {
    id: 4,
    title: "Collaboration",
    description:
      "Our community thrives on collaboration, fostering creative teamwork and open-source contributions. We engage in collaborative projects, including our code of conduct, wiki, Discord bot, and self-hosted tools, all aimed at enhancing the community experience.",
  },
  {
    id: 5,
    title: "Support",
    description:
      "We offer a dedicated space for members to seek help and guidance, with experienced and committed users actively responding in our support forums. We aim to cultivate a culture of understanding, where everyone can find assistance and encouragement.",
  },
  {
    id: 6,
    title: "Education",
    description:
      "Learning and growth are our priorities. We encourage members to share their knowledge, resources, and insights, particularly in our support forums. We focus on educating new users to navigate the vast Linux landscape and develop their skills.",
  },
  {
    id: 7,
    title: "Integrity",
    description:
      "Accountability and honesty are essential to our community, with both staff and members encouraged to acknowledge and learn from their mistakes. Our commitment to integrity sets us apart and contributes to our exceptional growth.",
  },
  {
    id: 8,
    title: "Transparency",
    description:
      "Openness in community operations is vital, including accessible moderation logs, transparent spending, and regular community decision voting. We believe that transparency fosters trust and accountability and our relationships among all members.",
  },
];

export default function Values() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-6">
        <h2 className="text-5xl font-bold leading-10 text-center text-white">
          Our Values and Principles
        </h2>

        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-14">
            {valuesLIst.map((value) => (
              <div key={value.id}>
                <dt className="text-2xl font-semibold leading-8 text-white">
                  {value.title}
                </dt>
                <dd className="mt-2 text-base text-gray-300 text-pretty tracking-wide">
                  {value.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
