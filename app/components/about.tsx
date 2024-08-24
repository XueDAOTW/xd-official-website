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
      <p className="text-xl text-gray-500 dark:text-gray-400 mt-8">
        The Contributor Team of XueDAO is currently formed by students from 9
        universities in Taiwan:
      </p>
      <div className="w-full border-l-4 border-xuedao_yellow mt-8 sm:w-auto sm:pl-8 sm:ml-4 sm:py-2">
        {chunkedUniversity.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap xl:ml-5">
            {row.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6"
              >
                <Image
                  src={`/university/${item.name}.png`}
                  alt={item.name}
                  width={500}
                  height={200}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default About;
