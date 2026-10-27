import { appendFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const body = await request.json();
    const entry = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(
      path.join(dataDir, "entries.json"),
      `${JSON.stringify(entry)}\n`,
      "utf8"
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
