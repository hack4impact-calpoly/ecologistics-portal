"use client";

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "JPEG"];
export default function ImageUpload() {
  const [file, setFile] = useState<File>();

  const handleChange = (file: File) => {
    setFile(file);
  };
  return (
    <div>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    </div>
  );
}
