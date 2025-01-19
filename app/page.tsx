import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Meme {
  id: string;
  name: string;
  url: string;
  box_count: number; // Make sure box_count is included in the meme data
}

const MemeGrid = async () => {
  const data = await fetch("https://api.imgflip.com/get_memes");
  const response = await data.json();

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Meme Bazar
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {response.data.memes.map((item: Meme) => {
          return (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <Image
                src={item.url}
                width={320}
                height={620}
                alt="meme"
                className="rounded-t object-cover w-full h-96"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {item.name}
                </h2>
                <Link
                  href={{
                    pathname: "creatememe",
                    query: {
                      url: item.url,
                      id: item.id,
                      box_count: item.box_count.toString(), // Ensure box_count is passed
                    },
                  }}
                >
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
                    Generate Meme
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemeGrid;
