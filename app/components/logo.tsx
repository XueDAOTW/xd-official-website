import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    <Image
                      src="/XueDAO_logo.png"
                      alt="xuedao logo"
                      className="px-6 pt-4"
                      width={600}
                      height={300}
                      priority
                    />
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Show the world that Taiwanese Students can{" "}
                    <span className="font-bold">BUIDL</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="https://t.me/+0Rvawr400uNhNTY1"
                    target="_blank"
                    passHref
                  >
                    <Button className="inline-flex h-16 w-72 sm:w-96 items-center justify-center border-4 rounded-full hover:shadow-[-18px_25px_14px_-10px_rgba(204,204,204,0.82)] hover:bg-white bg-white px-12 text-lg sm:text-lg font-bold text-black shadow focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Join NOW
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <Image
                  src="/puzzle.png"
                  width={650}
                  height={80}
                  alt="puzzle"
                  priority
                />
              </div>
            </div>
          </div>
  );
}
export default Logo;