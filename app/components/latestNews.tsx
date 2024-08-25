import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Post from "@/app/components/latestNews/post";
import Colearning from "@/app/components/latestNews/colearning";
import Workshop from "@/app/components/latestNews/workshop";

export function LatestNews() {
    return (
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Latest News
            </h2>
            <Tabs defaultValue="ig" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ig">IG Post</TabsTrigger>
                <TabsTrigger value="learn">Co-learning Day</TabsTrigger>
                <TabsTrigger value="workshop">Workshop</TabsTrigger>
              </TabsList>
              <TabsContent value="ig">
                <Post />
              </TabsContent>
              <TabsContent value="learn">
                <Colearning />
              </TabsContent>
              <TabsContent value="workshop">
                <Workshop />
              </TabsContent>
            </Tabs>
          </div>
    );
}
export default LatestNews;