import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { v4 as uuidv4 } from "uuid";
import {
  TWO_MEMBER_ALREADY_PRESENT,
  REQUIRED_PARAMETERS_MISSING,
  INVALID_CHANNEL_NAME,
} from "@/utils/errorCodes";

// this function will return either empty channel-name or a channel with one member
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // to get channel name
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
  }
  // to update channel currentMembersCount
  else if (method === "PUT") {
    const { query } = req;

    const channelName: string = (query.channelName as string) ?? "";

    const status: string = (query.status as string) ?? "";

    console.log({ channelName, status });

    if (!channelName || !status) {
      res.status(404).json({
        message: "Pls pass channel name you want to join",
        code: REQUIRED_PARAMETERS_MISSING,
      });
      return;
    }

    const channel = await prisma.room.findFirst({
      where: { channelName: channelName },
    });

    console.log({ channel });

    if (channel) {
      if (channel.currentMembersCount <= 1) {
        if (status === "join") {
          if (channel.currentMembersCount === 1) {
            await prisma.room.delete({
              where: { channelName: channelName },
            });

            res.status(200).json({ message: "You can now join room" });
          } else {
            await prisma.room.update({
              where: { channelName: channelName },
              data: { currentMembersCount: channel.currentMembersCount + 1 },
            });

            res.status(200).json({ message: "You can now join room" });

            return;
          }
        }

        // currently no use of this
        else if (status === "leave") {
          await prisma.room.update({
            where: { channelName: channelName },
            data: { currentMembersCount: channel.currentMembersCount - 1 },
          });

          res.status(200).json({ message: "You can now join room" });

          return;
        }
      } else {
        res.status(404).json({
          message:
            "Two members already present in channel, please request to create or join another channel",
          code: TWO_MEMBER_ALREADY_PRESENT,
        });
      }
    } else {
      res.status(404).json({
        message: "Pls pass channel name you want to join",
        code: INVALID_CHANNEL_NAME,
      });
      return;
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
