import Image from "next/image";
const university = [
  { id: 1, name: "ntu" },
  { id: 2, name: "nccu" },
  { id: 3, name: "ncku" },
  { id: 4, name: "ncu" },
  { id: 5, name: "nkust" },
  { id: 6, name: "nthu" },
  { id: 7, name: "ntnu" },
  { id: 8, name: "ntpu" },
  { id: 9, name: "ntut" },
];
export function About() {
  const chunkedUniversity = university.reduce(
    (resultArray: Array<Array<any>>, item, index) => {
      const chunkIndex = Math.floor(index / 5);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    []
  );
  return (
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
        What is XueDAO?
      </h2>
      <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
        XueDAO is the very first community in Taiwan focused on Student
        Developers led by Students!
      </p>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="border-l-4 border-xuedao_blue pl-8 space-y-4">
          <h3 className="text-2xl font-bold">Our Vision</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Build a ultimate blockchain learning hub for students, and show the
            world that Taiwanese Students Can BUILD!
          </p>
        </div>
        <div className="border-l-4 border-mission pl-8 space-y-4">
          <h3 className="text-2xl font-bold">Our Mission</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Empower students by hosting Study Groups, Networking Events and
            Hackathon to connect them with the industry and to the world!
          </p>
        </div>
      </div>
      <p className="text-xl text-gray-500 dark:text-gray-400 mt-8"></p>
      <div className="border-l-4 border-xuedao_yellow pl-8 space-y-4">
        <h3 className="text-2xl font-bold">Our Contributor</h3>
        <p className="text-gray-500 dark:text-gray-400">
          The Contributor Team of XueDAO is currently formed by students from 9
          universities in Taiwan:
        </p>
        <div className="container px-4 md:px-6">
          <div
            className="relative w-full overflow-hidden "
            aria-label="Partner logos"
          >
            <div
              className="flex space-x-8 animate-marquee mt-4"
              style={{
                width: `${university.length * 240}px`,
              }}
            >
              {[...university, ...university].map((uni, index) => (
                <div key={index} className="flex-shrink-0 w-[200px]">
                  <Image
                    src={`/university/${uni.name}.png`}
                    alt={uni.name}
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;
