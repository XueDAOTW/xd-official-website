import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const colearning = [
    {
      title: "Co-learning Session 1",
      date: "2024-02-01",
      description: "Cancun Upgrade, RISC-0, Fractional NFTs, Roll-up",
      tag: [
        { label: "YouTube", link: "https://youtu.be/DEFsmnKsY0s" },
      ],
    },
    {
      title: "Co-learning Session 2",
      date: "2024-02-18",
      description: "Farcaster frames, ERC-404",
      tag: [
        { label: "YouTube", link: "https://youtu.be/Bim0HF-9mJc" },
      ],
    },
    {
      title: "Co-learning Session 3",
      date: "2024-03-02",
      description: "Money & Tokenomic, Uniswap V1-V4",
      tag: [
        { label: "YouTube", link: "https://youtu.be/J2vg97Yb7WM" },
      ],
    },
    {
      title: "Co-learning Session 4",
      date: "2024-03-10",
      description: "Quantum Resistant Blockchain, Tea Protocol",
      tag: [
        { label: "YouTube", link: "https://youtu.be/aUgTlP8iVFo" },
      ],
    },
    {
      title: "Co-learning Session 5",
      date: "2024-03-17",
      description: "Scallup Protocol, Puffer Finance",
      tag: [
        { label: "YouTube", link: "https://youtu.be/J2vg97Yb7WM" },
      ],
    },
    {
      title: "Co-learning Session 6",
      date: "2024-04-06",
      description: "ZK Intro, Security & Smart Contract Auditing ",
      tag: [
        { label: "YouTube", link: "https://youtu.be/aUgTlP8iVFo" },
      ],
    },
    {
      title: "Co-learning Session 7",
      date: "2024-04-27",
      description: "ZK Project, Uniswap V3/V4/X",
      tag: [
        { label: "YouTube", link: "https://youtu.be/J2vg97Yb7WM" },
      ],
    },
    {
      title: "Co-learning Session 8",
      date: "2024-05-18",
      description: "Reproduce Attack Incident with PoCs, FriendTech V1/V2",
      tag: [
        { label: "YouTube", link: "https://youtu.be/aUgTlP8iVFo" },
      ],
    },
    {
      title: "Co-learning Session 9",
      date: "2024-08-02",
      description: "Ordinal Protocol to Token on BTC, <UMA Oracle>",
      tag: [
        { label: "YouTube", link: "https://youtu.be/J2vg97Yb7WM" },
      ],
    },
    {
      title: "Co-learning Session 10",
      date: "2024-08-24",
      description: "Ephemeral Rollups + Based Rollups, Galadriel Intro",
      tag: [
        { label: "YouTube", link: "https://youtu.be/aUgTlP8iVFo" },
      ],
    },
  ];

export function Colearning() {
  return (
    <div className="grid gap-6 mt-8">
      {colearning.map((workshop, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{workshop.title}</CardTitle>
            <CardDescription>{workshop.date}</CardDescription>
            <p className="text-gray-500 dark:text-gray-400">{workshop.description}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default Colearning;
