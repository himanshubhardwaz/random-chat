import type { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  const clientId: string = query.clientId ? (query.clientId as string) : "";

  console.log(clientId);

  if (method === "GET") {
    const ablyApiKey = process.env.ABLY_API_KEY;

    const client = new Ably.Realtime(ablyApiKey as string);

    const tokenRequestData = await client.auth.createTokenRequest({
      clientId,
    });

    res.status(200).json(tokenRequestData);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
