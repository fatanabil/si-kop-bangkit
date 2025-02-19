import { type TRPCRequestInfo } from "@trpc/server/unstable-core-do-not-import";
import { type NextApiRequest, type NextApiResponse } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const controller = new AbortController();

  const trpcRequestInfo: TRPCRequestInfo = {
    accept: "application/jsonl",
    type: "query",
    calls: [],
    isBatchCall: false,
    signal: controller.signal,
    connectionParams: {},
  };
  const ctx = await createTRPCContext({
    req,
    res,
    info: trpcRequestInfo,
  });

  const caller = createCaller(ctx);

  try {
    const result = await caller.ping.ping();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
