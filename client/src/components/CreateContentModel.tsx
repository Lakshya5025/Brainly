import { useState } from "react";
import { Cross } from "../icons/Cross";
import { Button } from "./Button";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface InputProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function Input({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="my-2">
      <input
        className="bg-grey-200 w-full rounded-md py-2 pl-2 text-black"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

const buttonData = [
  { text: "image", type: "image" },
  { text: "doc", type: "doc" },
  { text: "video", type: "video" },
  { text: "audio", type: "audio" },
  { text: "tweet", type: "tweet" },
];

interface FormData {
  title: string;
  link: string;
  description: string;
  tags: string;
}

export function CreateContentModel({
  onClose,
  setUpdateUI,
  updateUI,
}: {
  onClose: () => void;
  updateUI: boolean;
  setUpdateUI: (v: boolean) => void;
}) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    link: "",
    description: "",
    tags: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!activeType) {
      alert("Please select a content type.");
      return;
    }
    const payload = {
      type: activeType,
      title: formData.title,
      link: formData.link,
      description: formData.description,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    console.log("Sending data to backend:", payload);

    try {
      const response = await axios.post(`${apiUrl}/content`, payload, {
        withCredentials: true,
      });
      console.log(response.data);
      setUpdateUI(!updateUI);
      onClose();
    } catch (error) {
      console.error("Failed to submit content:", error);
      alert("There was an error submitting your content.");
    }
  };
  const handleTypeSelect = (type: string) => {
    setActiveType(type);
    setFormData({ title: "", link: "", description: "", tags: "" });
  };
  const renderInputs = () => {
    switch (activeType) {
      case "image":
      case "video":
      case "doc":
      case "audio":
      case "tweet":
        return (
          <>
            <Input
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Link (e.g., https://...)"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={4}
              className="bg-gray-100 w-full rounded-md py-2 px-3 text-black  focus:ring-purple-500 focus:border-purple-500"
            />
            <Input
              placeholder="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </>
        );

      default:
        return (
          <div className="text-center text-gray-400 my-10">
            Please select a content type above.
          </div>
        );
    }
  };

  return (
    <div className="absolute top-0 text-white h-full w-full flex items-center justify-center opacity-100 bg-black-100">
      <div className="bg-white h-auto w-90 text-purple-500 rounded-lg p-4">
        <div className="">
          <div className="flex justify-between mt-3 mb-5 ">
            <div className="font-medium text-xl">Add Content</div>
            <div className="hover:cursor-pointer" onClick={onClose}>
              <Cross />
            </div>
          </div>
          <div className="flex justify-between mb-3">
            {buttonData.map((button, i) => (
              <Button
                key={i}
                varient="primary"
                text={button.text}
                isActive={activeType === button.type}
                onClick={() => handleTypeSelect(button.type)}
              />
            ))}
          </div>
          <div>{renderInputs()}</div>
          {activeType && (
            <div className="flex mt-7 justify-center">
              <Button
                varient="primary"
                customCSS="w-full flex justify-center"
                text="Submit"
                onClick={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
