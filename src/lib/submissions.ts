import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Submission } from "./types";

/**
 * Local-first submission storage. Writes one JSON file per submission into
 * SUBMISSIONS_DIR (default ./data/submissions). On Vercel the filesystem is
 * read-only, so for production replace the body of saveSubmission with a
 * Supabase insert — the shape of `Submission` maps 1:1 onto a table.
 *
 *   const { error } = await supabase.from("submissions").insert(submission);
 */
export async function saveSubmission(input: Omit<Submission, "id" | "receivedAt" | "status">): Promise<Submission> {
  const submission: Submission = {
    ...input,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "pending",
  };

  const dir = path.resolve(process.cwd(), process.env.SUBMISSIONS_DIR ?? "./data/submissions");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${submission.id}.json`), JSON.stringify(submission, null, 2), "utf8");
  } catch (err) {
    // Read-only filesystem (e.g. Vercel). Log it so nothing is silently lost
    // while the database layer is still TODO.
    console.warn("[submissions] could not write to disk; submission logged instead", err);
    console.log(JSON.stringify(submission));
  }
  return submission;
}

export async function listSubmissions(): Promise<Submission[]> {
  const dir = path.resolve(process.cwd(), process.env.SUBMISSIONS_DIR ?? "./data/submissions");
  let files: string[] = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const items = await Promise.all(
    files.map(async (f) => JSON.parse(await fs.readFile(path.join(dir, f), "utf8")) as Submission),
  );
  return items.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}
