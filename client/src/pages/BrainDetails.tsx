import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocIcon } from "../icons/DocIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { SpeakerIcon } from "../icons/SpeakerIcon";
import { LinkIcon } from "../icons/LinkIcon";
const apiUrl = import.meta.env.VITE_API_URL;
type ContentType = "image" | "doc" | "video" | "audio" | "tweet";
const getContentIcon = (type: ContentType) => {
  switch (type) {
    case "video":
      return <YoutubeIcon />;
    case "tweet":
      return <TwitterIcon />;
    case "doc":
      return <DocIcon />;
    case "image":
      return <ImageIcon />;
    case "audio":
      return <SpeakerIcon />;
    default:
      return <LinkIcon />;
  }
};

interface CardProps {
  id: string;
  link: string;
  title: string;
  description?: string;
  updateUI: boolean;
  setUpdateUI: (v: boolean) => void;
  type: ContentType;
}
const CardContent = ({
  type,
  link,
  title,
}: {
  type: ContentType;
  link: string;
  title: string;
}) => {
  switch (type) {
    case "video":
      try {
        const url = new URL(link);
        const videoId = url.searchParams.get("v");
        if (!videoId)
          return <p className="p-4 text-red-500">Invalid YouTube URL</p>;
        return (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        );
      } catch (error) {
        console.log(error);
        return <p className="p-4 text-red-500">Invalid YouTube URL</p>;
      }
    case "tweet":
      link = link.replace("x.com", "twitter.com");
      return (
        <blockquote className="twitter-tweet">
          <a href={link}></a>
        </blockquote>
      );
    case "image":
      return <img src={link} alt={title} className="w-full h-auto" />;
    case "audio":
      return (
        <audio controls src={link} className="w-full">
          Your browser does not support the audio element.
        </audio>
      );
    case "doc":
      if (link.toLowerCase().endsWith(".pdf")) {
        return (
          <iframe
            src={link}
            title={title}
            className="w-full h-full min-h-64"></iframe>
        );
      } else {
        return (
          <div className="p-4 text-center">
            <DocIcon />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 hover:underline break-all">
              View Document
            </a>
          </div>
        );
      }
    default:
      return <p className="p-4">Unsupported content type.</p>;
  }
};
export function BrainDetails() {
  const { brainId } = useParams();
  const [brain, setBrain] = useState<CardProps>();
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/brain/${brainId}`, {
          withCredentials: true,
        });
        setBrain(response.data?.message.contentId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, [brainId]);
  if (!brain) return <div>Loading brain</div>;
  console.log(brain);
  return (
    <div className="bg-purple-100 h-screen w-screen  flex justify-center items-center">
      <div className="bg-white w-[400px]  rounded-md border-2 border-black-200 overflow-y-auto max-h-90 mb-5">
        <div className="flex justify-between px-3 pt-3 items-center ">
          <div className="flex items-center gap-7">
            <div className="text-black-200"> {getContentIcon(brain.type)}</div>
            <div className="font-medium">{brain.title}</div>
          </div>
        </div>
        <div className="flex-grow py-3 px-2 overflow-y-auto">
          <CardContent
            title={brain.title}
            type={brain.type}
            link={brain.link}
          />
        </div>
        <div className="px-3 pb-3">{brain.description}</div>
      </div>
    </div>
  );
}
