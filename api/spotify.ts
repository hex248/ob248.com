import { getCurrentlyPlaying } from "../lib/spotify.ts";

export default async function handler(req: any, res: any) {
  const currentlyPlaying = await getCurrentlyPlaying();
  res.status(200).json(currentlyPlaying);
}
