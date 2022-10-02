import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { v4 as uuidv4 } from "uuid";

// this function will return either empty channel-name or a channel with one member
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    const room = await prisma.room.findFirst({
      where: {
        currentMembersCount: {
          lt: 2,
        },
      },
    });

    if (room) {
      res.status(200).json(room);
      return;
    } else {
      const newRoom = await prisma.room.create({
        data: { channelName: uuidv4() },
      });

      res.status(200).json(newRoom);

      return;
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
