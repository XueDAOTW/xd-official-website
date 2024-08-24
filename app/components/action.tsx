import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Action() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/events-photo/1.webp",
    "/events-photo/2.webp",
    "/events-photo/3.webp",
    "/events-photo/4.webp",
    "/events-photo/5.webp",
    "/events-photo/6.webp",
    "/events-photo/7.webp",
    "/events-photo/8.webp",
    "/events-photo/9.webp",
    "/events-photo/10.webp",
  ];
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
        What we have done?
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Image
            src={images[currentImageIndex]}
            alt={`Global Network Image ${currentImageIndex + 1}`}
            width={600}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">We Hack!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We join hackathons together and win several prizes already
          </p>
          <h3 className="text-2xl font-bold">We Learn!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We host bi-weekly co-learning day which is open for everyone to
            join, also the study groups
          </p>
          <h3 className="text-2xl font-bold">We Connect!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We host side event during ETH Taipei, and Keynotes Speechs with
            professions from the industry
          </p>
        </div>
      </div>
    </div>
  );
}
export default Action;
