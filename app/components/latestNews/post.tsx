import { InstagramEmbed } from 'react-social-media-embed';

const instagramPosts = [
  'https://www.instagram.com/p/DG8HPZtM1pu',
  'https://www.instagram.com/p/DG7t_buhzC4', 
  'https://www.instagram.com/p/DGsGHttJHls',
];

function Post() {
  return (
    <div className="flex w-full bg-gradient-to-b py-12">
      <div className="container flex flex-col mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {instagramPosts.map((postUrl, index) => (
            <div key={index} className="flex w-full justify-center items-center">
              <InstagramEmbed 
                url={postUrl}
                width="100%"
                className="w-full"
                style={{ margin: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
