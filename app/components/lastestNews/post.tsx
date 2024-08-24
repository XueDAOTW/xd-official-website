import React, { useEffect, useState, useRef } from "react";

const instagramPosts = [
  "https://www.instagram.com/p/C-2cjw9yCM8",
  "https://www.instagram.com/p/C99Jrf3SKH0",
  "https://www.instagram.com/p/C91UmXCiV0N",
];

export function Post() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load the Instagram embed script only once
    const loadInstagramScript = () => {
      if (!scriptRef.current) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "//www.instagram.com/embed.js";
        script.onload = () => {
          setScriptLoaded(true);
        };

        document.body.appendChild(script);
        scriptRef.current = script;
      } else {
        setScriptLoaded(true);
      }
    };

    loadInstagramScript();

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }, [scriptLoaded]);

  return (
    <div className="flex w-full bg-gradient-to-b py-12">
      <div className="container flex flex-col mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {instagramPosts.map((postUrl, index) => (
            <div key={index} className="flex justify-center items-center">
              <blockquote
                className="instagram-media w-full max-w-xs md:max-w-sm lg:max-w-md"
                data-instgrm-permalink={postUrl}
                data-instgrm-version="14"
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
