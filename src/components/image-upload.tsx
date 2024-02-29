"use client";
import { imageUpload } from "@/services/imageUpload";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "JPEG"];

interface ImageUploadProps {
  handleChange: (file: File) => void;
}

export default function ImageUpload({ handleChange }: ImageUploadProps) {
  return (
    <div>
      <FileUploader
        handleChange={(file: File) => {
          imageUpload(file, file.name);
          handleChange(file);
        }}
        name="file"
        types={fileTypes}
      />{" "}
    </div>
  );
}
