import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { contentModel, linkModel } from "../models/models.js";

export async function shareLink(req: Request, res: Response) {
  try {
    const contentId = req.body.id;
    //@ts-ignore
    const userId = req.user.userId;
    const content = await contentModel.findOne({
      _id: contentId,
      userId,
    });
    if (!content) {
      return res.status(404).json({
        message: "Content not found or you don't have permission to share it.",
      });
    }
    const alreadyPresent = await linkModel.findOne({
      contentId,
    });

    if (alreadyPresent) {
      const hash = alreadyPresent.hash;
      const sharableLink = `${process.env.CLIENT_URL}/brain/${hash}`;
      return res.status(200).json({
        hash,
        message: sharableLink,
      });
    }
    const hash = await nanoid(10);
    const newLink = new linkModel({
      hash,
      contentId,
    });
    await newLink.save();
    const sharableLink = `${process.env.CLIENT_URL}/brain/${hash}`;
    res.status(201).json({
      hash,
      message: sharableLink,
    });
  } catch (err) {
    console.log("Error creating link: " + err);
    res.status(500).json({
      message: "Internet server error",
    });
  }
}
