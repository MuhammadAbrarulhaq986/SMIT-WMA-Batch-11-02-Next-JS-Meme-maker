"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const CreateMeme = ({
  searchParams,
}: {
  searchParams: { id: string; url: string; box_count: string };
}) => {
  const [meme, setMeme] = useState<string | null>(null);
  const [texts, setTexts] = useState<string[]>([]);

  useEffect(() => {
    // Parse box_count and set default value to 2 if invalid
    const count = parseInt(searchParams.box_count, 10);

    // Log box_count and parsed count
    console.log("Received box_count:", searchParams.box_count);
    console.log("Parsed count:", count);

    // Check if box_count is valid and within the range
    if (isNaN(count) || count <= 0 || count > 5) {
      console.warn("Invalid box_count, defaulting to 2 fields.");
      setTexts(Array(2).fill("")); // Default to 2 fields
    } else {
      setTexts(Array(count).fill("")); // Set the correct number of text fields
    }
  }, [searchParams.box_count]); // Trigger when box_count changes

  const handleChange = (index: number, value: string) => {
    // Create a copy of texts array to preserve immutability
    const updatedTexts = [...texts];
    updatedTexts[index] = value; // Update the value of the input at the correct index
    setTexts(updatedTexts); // Update the state with the new texts array

    // Debugging log to confirm the updated value for each field
    console.log("Updated texts:", updatedTexts);
  };

  const createMeme = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare the text params for API request
    const textParams = texts
      .map((text, index) => `text${index}=${encodeURIComponent(text)}`)
      .join("&");

    const response = await fetch(
      `https://api.imgflip.com/caption_image?template_id=${searchParams.id}&username=MuhammadAbrarUlHaq&password=abrarulhaq106&${textParams}`,
      { method: "POST" }
    );

    const data = await response.json();
    if (data.success) {
      setMeme(data.data.url);
    } else {
      console.error("Error creating meme:", data.error_message);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold text-center mb-4">Create Meme</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="flex flex-col items-center w-full md:w-1/2">
          <Image
            src={searchParams.url}
            width={320}
            height={320}
            alt="meme template"
            className="rounded object-cover mb-4"
          />

          <form
            onSubmit={createMeme}
            className="flex flex-col items-center w-full"
          >
            {/* Ensure the texts array length is correct */}
            {texts.length > 0 &&
              texts.map((text, index) => (
                <div key={index} className="mb-4 w-full">
                  <label className="block text-gray-700 text-sm mb-1">
                    Text {index + 1}:
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter text ${index + 1}`}
                    value={text}
                    onChange={(e) => handleChange(index, e.target.value)} // Update text at the correct index
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              ))}
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Meme
            </button>
          </form>
        </div>

        {meme && (
          <div className="flex flex-col items-center w-full md:w-1/2">
            <Image
              src={meme}
              width={320}
              height={320}
              alt="created meme"
              className="rounded object-cover mb-4"
            />
            <a
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
