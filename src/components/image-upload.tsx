"use client";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "JPEG"];

interface ImageUploadProps {
  handleChange: (file: File) => void;
}

export default function ImageUpload({ handleChange }: ImageUploadProps) {
  return (
    <div>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />{" "}
    </div>
  );
}
