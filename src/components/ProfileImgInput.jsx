"use client";
import { useState } from "react";

export default function ProfileImgInput() {
  const [imgFile, setImgFile] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <label
        className="mb-4 file-upload-container underline underline-offset-8 p-3 hover:bg-gray-300 cursor-pointer"
        htmlFor="profileImg"
      >
        ProfileImg
      </label>
      <input
        className="hidden"
        name="profileImg"
        type="file"
        id="profileImg"
        onChange={handleFileChange}
        accept="image/*"
      />
      <div className="h-[2rem] w-3/5 overflow-auto flex justify-center items-center">
        {imgFile ? (
          <p className="text-gray-400">Selected file : {imgFile.name}</p>
        ) : (
          <p className="text-gray-400">{`" Please select a profile image. "`}</p>
        )}
      </div>
    </div>
  );
}
