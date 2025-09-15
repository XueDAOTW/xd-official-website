import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const workshops = [
  {
    title: "Solidity 1 (Connect Hackathon)",
    date: "2024-05-23 20:00-21:30",
    tag: [
      { label: "YouTube", link: "https://youtu.be/0dw5T414ySA" },
      { label: "Luma", link: "https://lu.ma/v7k0rw5m" }
    ],
  },
  {
    title: "Solidity 2 (Connect Hackathon)",
    date: "2024-05-26 14:00-15:30",
    tag: [
      { label: "YouTube", link: "https://youtu.be/0CkaKsuWUnk" },
      { label: "Luma", link: "https://lu.ma/v7k0rw5m" }
    ],
  },
  {
    title: "Solidity 3 (Connect Hackathon)",
    date: "2024-05-30 20:00-21:30",
    tag: [
      { label: "YouTube", link: "https://youtu.be/Pb8AhaeAwpc" },
      { label: "Luma", link: "https://lu.ma/v7k0rw5m" }
    ],
  },
  {
    title: "Solidity 4 (Connect Hackathon)",
    date: "2024-06-02 14:00-15:30",
    tag: [
      { label: "YouTube", link: "https://www.youtube.com/live/R3_-aur9Njg" },
      { label: "Luma", link: "https://lu.ma/v7k0rw5m" }
    ],
  },
  {
    title: "Olympic Track Workshop (Connect Hackathon)",
    date: "2024-06-15 19:00-21:00",
    tag: [
      { label: "YouTube", link: "https://www.youtube.com/live/-fH9T42SCq8" },
      { label: "Luma", link: "https://lu.ma/a5td172k" }
    ],
  },
  {
    title: "Hackathon-focused Front-end Workshop (Connect Hackathon)",
    date: "2024-06-16 14:00-16:00",
    tag: [
      { label: "YouTube", link: "https://www.youtube.com/live/wt25IqxS22M" },
      { label: "Luma", link: "https://lu.ma/y54dpfci" }
    ],
  },
  {
    title: "BGA & Aptos Track Workshop (Connect Hackathon)",
    date: "2024-06-17 19:00-21:00",
    tag: [
      { label: "YouTube", link: "https://youtu.be/3ySuXTb7V4w" },
      { label: "Luma", link: "https://lu.ma/w4a25t9l" }
    ],
  },
  {
    title: "SUI Track Workshop (Connect Hackathon)",
    date: "2024-06-26 18:50-20:30",
    tag: [
      { label: "Luma", link: "https://lu.ma/vpro2oqm" }
    ],
  },
  {
    title: "Pitch Practice Workshop–AWS (Connect Hackathon)",
    date: "2024-06-28 14:00-16:00",
    tag: [
      { label: "YouTube", link: "https://www.YouTube.com/watch?v=1a2b3c4d5e" },
      { label: "Luma", link: "https://lu.ma/gt21ak9a" }
    ],
  },
  {
    title: "Cathay Finance Track Workshop (Connect Hackathon)",
    date: "2024-06-28 16:00-18:00",
    tag: [
      { label: "YouTube", link: "https://www.youtube.com/live/rx_JidVgWcM" },
      { label: "Luma", link: "https://lu.ma/mtsjaqag" }
    ],
  },
];

export function Workshop() {
  return (
    <div className="grid gap-6 mt-8">
      {workshops.map((workshop, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{workshop.title}</CardTitle>
            <CardDescription>{workshop.date}</CardDescription>
            <div className="flex gap-2 mt-2">
              {workshop.tag.map((tag, tagIndex) => {
                // Determine the color based on the label
                let colorClass = "";
                if (tag.label === "Luma") {
                  colorClass = "bg-xuedao_blue";
                } else if (tag.label === "YouTube") {
                  colorClass = "bg-xuedao_pink";
                } else {
                  colorClass = "bg-xuedao_yellow";
                }

                return (
                  <Link key={tagIndex} href={tag.link}>
                    <span className={`px-2 py-1 rounded text-white ${colorClass}`}>
                      {tag.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default Workshop;
