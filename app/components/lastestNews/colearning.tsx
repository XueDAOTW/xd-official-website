import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const colearning = [
    {
      title: "Solidity 100",
      date: "2024-05-23 20:00-21:30",
      link: "https://www.youtube.com/watch?v=1a2b3c4d5e",
    },
    {
      title: "Solidity 2",
      date: "2024-05-26 14:00-15:30",
      time: "14:00-15:30",
    },
    {
      title: "Solidity 3",
      date: "2024-05-30 20:00-21:30",
      time: "20:00-21:30",
    },
    {
      title: "Solidity 4",
      date: "2024-06-02 14:00-15:30",
      time: "14:00-15:30",
    },
    {
      title: "Olympic Track Workshop",
      date: "2024-06-15 19:00-21:00",
      time: "19:00-21:00",
    },
    {
      title: "Hackathon-focused Front-end Workshop",
      date: "2024-06-16 14:00-16:00",
      time: "14:00-16:00",
    },
    {
      title: "BGA & Aptos Track Workshop",
      date: "2024-06-17 19:00-21:00",
      time: "19:00-21:00",
    },
    {
      title: "SUI Track Workshop",
      date: "2024-06-26 18:50-20:30",
      time: "18:50-20:30",
    },
    {
      title: "Pitch Practice Workshop–AWS",
      date: "2024-06-28 14:00-16:00",
      time: "14:00-16:00",
    },
    {
      title: "Cathay Finance Track Workshop",
      date: "2024-06-28 16:00-18:00",
      time: "16:00-18:00",
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
            <p className="text-gray-500 dark:text-gray-400">{workshop.time}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default Colearning;
