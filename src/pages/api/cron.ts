import { type NextApiRequest, type NextApiResponse } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Nethod not allowed" });
  }

  const ctx = await createTRPCContext({
    req,
    res,
    info: {},
  });

  const caller = createCaller(ctx);

  try {
    const result = await caller.ping.ping();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
