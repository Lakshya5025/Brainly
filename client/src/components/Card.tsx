import { useEffect, useState } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import { BinIcon } from "../icons/BinIcon";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import { DocIcon } from "../icons/DocIcon";
import axios from "axios";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { SpeakerIcon } from "../icons/SpeakerIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { ShareModal } from "./ShareModel";
import { EditContentModal } from "./EditContetModal";
import { Pencil } from "../icons/Pencil";
const apiUrl = import.meta.env.VITE_API_URL;

type ContentType = "image" | "doc" | "video" | "audio" | "tweet";

interface Tag {
  _id: string;
  title: string;
}

interface CardProps {
  id: string;
  link: string;
  title: string;
  description?: string;
  updateUI: boolean;
  setUpdateUI: (v: boolean) => void;
  type: ContentType;
  tags: Tag[];
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
  useEffect(() => {
    if (type === "tweet") {
      // @ts-ignore
      const twttr = window.twttr;
      if (twttr && twttr.widgets) {
        twttr.widgets.load();
      }
    }
  }, [type, link]);
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

export function Card({
  link,
  title,
  description,
  id,
  type,
  updateUI,
  setUpdateUI,
  tags,
}: CardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharableLink, setSharableLink] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

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

  async function handelShare() {
    setIsShareModalOpen(true);
    try {
      const response = await axios.post(
        `${apiUrl}/brain/share`,
        { id },
        { withCredentials: true }
      );
      setSharableLink(response.data.message);
    } catch (err) {
      setSharableLink("Unable to create link");
      console.log("error creating link ", err);
    }
  }

  async function handleDeleteBtn() {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );
    if (!isConfirmed) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(`${apiUrl}/content/${id}`, { withCredentials: true });
      setUpdateUI(!updateUI);
    } catch (err) {
      console.log(err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="bg-white w-[354px] rounded-md border-2 border-black-200 overflow-y-auto max-h-80 mb-5">
      <div className="flex justify-between px-3 pt-3 items-center ">
        <div className="flex items-center gap-7">
          <div className="text-black-200"> {getContentIcon(type)}</div>
          <div className="font-medium">{title}</div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-gray-200 text-black-200 hover:cursor-pointer">
            <Pencil />
          </button>
          <div
            className="text-black-200 hover:cursor-pointer p-1 rounded hover:bg-gray-200 "
            onClick={handelShare}>
            {<ShareIcon />}
          </div>
          <div
            className="text-black-200 hover:cursor-pointer p-1 rounded hover:bg-gray-200 "
            onClick={isDeleting ? undefined : handleDeleteBtn}>
            {isDeleting ? <SpinnerIcon /> : <BinIcon />}
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="px-3 pt-2 text-sm text-center text-red-500">
          {deleteError}
        </div>
      )}

      <div className="flex-grow py-3 px-2 overflow-y-auto">
        <CardContent title={title} type={type} link={link} />
      </div>

      <div className="px-3 pb-3">{description}</div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-purple-100 text-purple-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag.title}
            </span>
          ))}
        </div>
      )}

      {isShareModalOpen && (
        <ShareModal
          link={sharableLink}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {isEditing && (
        <EditContentModal
          content={{ _id: id, title, description }}
          onClose={() => setIsEditing(false)}
          setUpdateUI={setUpdateUI}
          updateUI={updateUI}
        />
      )}
    </div>
  );
}
