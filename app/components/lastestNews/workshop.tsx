import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const workshops = [
    {
      title: "Solidity 1",
      date: "2024-05-23",
      time: "20:00-21:30",
    },
    {
      title: "Solidity 2",
      date: "2024-05-26",
      time: "14:00-15:30",
    },
    {
      title: "Solidity 3",
      date: "2024-05-30",
      time: "20:00-21:30",
    },
    {
      title: "Solidity 4",
      date: "2024-06-02",
      time: "14:00-15:30",
    },
    {
      title: "Olympic Track Workshop",
      date: "2024-06-15",
      time: "19:00-21:00",
    },
    {
      title: "Hackathon-focused Front-end Workshop",
      date: "2024-06-16",
      time: "14:00-16:00",
    },
    {
      title: "BGA & Aptos Track Workshop",
      date: "2024-06-17",
      time: "19:00-21:00",
    },
    {
      title: "SUI Track Workshop",
      date: "2024-06-26",
      time: "18:50-20:30",
    },
    {
      title: "Pitch Practice Workshop–AWS",
      date: "2024-06-28",
      time: "14:00-16:00",
    },
    {
      title: "Cathay Finance Track Workshop",
      date: "2024-06-28",
      time: "16:00-18:00",
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
            <p className="text-gray-500 dark:text-gray-400">{workshop.time}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default Workshop;
