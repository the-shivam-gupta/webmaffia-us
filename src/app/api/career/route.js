import { appendFile, mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let entry;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const resume = formData.get("resume");
      let resumeMeta = null;

      if (resume && typeof resume === "object" && "arrayBuffer" in resume) {
        const file = resume;
        if (file.size > 0) {
          const uploadsDir = path.join(process.cwd(), "data", "resumes");
          await mkdir(uploadsDir, { recursive: true });
          const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const buffer = Buffer.from(await file.arrayBuffer());
          await writeFile(path.join(uploadsDir, safeName), buffer);
          resumeMeta = {
            originalName: file.name,
            size: file.size,
            savedAs: safeName,
          };
        }
      }

      const interests = formData.getAll("interests[]").map(String);

      entry = {
        type: "career",
        form_source: String(formData.get("form_source") || "career"),
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        mobile: String(formData.get("mobile") || ""),
        interests,
        resume: resumeMeta,
        submittedAt: new Date().toISOString(),
      };
    } else {
      const body = await request.json();
      entry = {
        type: "career",
        ...body,
        submittedAt: new Date().toISOString(),
      };
    }

    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(
      path.join(dataDir, "career-entries.json"),
      `${JSON.stringify(entry)}\n`,
      "utf8"
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Career form error:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
