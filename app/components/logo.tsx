import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-8 lg:space-y-10">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              <Image
                src="/XueDAO_logo.webp"
                alt="xuedao logo"
                className="mx-auto pt-4"
                width={600}
                height={300}
                priority
              />
            </h1>
            <p className="text-center text-3xl max-w-[700px] mx-auto text-gray-500 dark:text-gray-400">
              Show the world that <br /> Taiwanese Students <br /> can{" "}
              <span className="font-bold text-black">BUIDL</span>
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href="https://t.me/+0Rvawr400uNhNTY1"
              target="_blank"
              passHref
            >
              <Button className="inline-flex h-14 sm:h-16 w-64 sm:w-72 lg:w-80 items-center justify-center border-4 rounded-full hover:shadow-lg hover:bg-gray-100 bg-white px-8 text-lg sm:text-xl font-bold text-black focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                Join NOW
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <Image
            src="/puzzle.png"
            width={1000}
            height={800}
            alt="puzzle"
            priority
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Logo;
