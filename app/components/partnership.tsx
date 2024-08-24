import Image from "next/image";

export function Partnership() {
  return (
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
        We bridge students with the Industry
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
          <Image
            src={"/partner/partner1.png"}
            width={800}
            height={500}
            alt="HackathonInfo"
            priority
          />
        </div>
        <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
          <Image
            src={"/partner/partner2.png"}
            width={800}
            height={500}
            alt="HackathonInfo"
            priority
          />
        </div>
      </div>
      <div className="relative w-full max-w-xl mx-auto lg:max-w-none mt-8 flex justify-center">
        <Image
          src={"/partner/partner3.png"}
          width={800}
          height={500}
          alt="HackathonInfo"
          priority
        />
      </div>
    </div>
  );
}

export default Partnership;
