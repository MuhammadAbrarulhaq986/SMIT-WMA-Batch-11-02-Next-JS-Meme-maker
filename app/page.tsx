import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Meme {
  id: string;
  name: string;
  url: string;
}

const MemeGrid = async () => {
  const data = await fetch("https://api.imgflip.com/get_memes");
  const response = await data.json();
  console.log(response.data.memes);
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold text-center mb-4">Meme Bazar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {response.data.memes.map((item: Meme) => {
          return (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded p-4 hover:shadow-xl"
            >
              <Image
                src={item.url}
                width={420} // Fixed width
                height={420} // Fixed height for uniformity
                alt="meme"
                className="rounded-t object-cover" // Added object-cover to maintain aspect ratio
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                  <Link
                    href={{
                      pathname: "creatememe",
                      query: {
                        url: item.url,
                        id: item.id,
                      },
                    }}
                  >
                    Generate Meme
                  </Link>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemeGrid;
