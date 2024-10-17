"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

const CreateMeme = ({
  searchParams,
}: {
  searchParams: { id: string; url: string };
}) => {
  const [meme, setMeme] = useState<string | null>(null);
  const text1 = useRef<HTMLInputElement>(null);
  const text2 = useRef<HTMLInputElement>(null);

  const createMeme = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(
      `https://api.imgflip.com/caption_image?template_id=${searchParams.id}&username=MuhammadAbrarUlHaq&password=abrarulhaq106&text0=${text1.current?.value}&text1=${text2.current?.value}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    console.log(data); // Log the response to see its structure

    if (data.success) {
      setMeme(data.data.url);
    } else {
      console.error("Error creating meme:", data.error_message);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold text-center mb-4">Create Meme</h1>
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center w-full md:w-1/2">
          <Image
            src={searchParams.url}
            width={320}
            height={320}
            alt="meme template"
            className="rounded object-cover mb-4"
          />
          <form onSubmit={createMeme} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter text 1"
              ref={text1}
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Enter text 2"
              ref={text2}
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Meme
            </button>
          </form>
        </div>

        {meme && (
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 ml-4">
            <Image
              src={meme}
              width={320}
              height={320}
              alt="created meme"
              className="rounded object-cover mb-4"
            />
            <a
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={(e) => {
                e.preventDefault();
                fetch(meme)
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "meme.jpg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  });
              }}
            >
              Download Meme
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeme;
