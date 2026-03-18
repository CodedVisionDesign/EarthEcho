import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkBanned } from "@/lib/auth-guard";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banned = await checkBanned(session.user.id);
  if (banned) return NextResponse.json({ error: banned }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, or WebP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum 2MB." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${session.user.id}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  const filePath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Delete old custom avatar if exists
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { customImage: true },
  });

  if (currentUser?.customImage) {
    const oldPath = path.join(process.cwd(), "public", currentUser.customImage);
    try {
      await unlink(oldPath);
    } catch {
      // Old file may not exist, ignore
    }
  }

  // Write new file
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  // Update database
  const imageUrl = `/uploads/avatars/${filename}`;
  await db.user.update({
    where: { id: session.user.id },
    data: { customImage: imageUrl },
  });

  return NextResponse.json({ imageUrl });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banned = await checkBanned(session.user.id);
  if (banned) return NextResponse.json({ error: banned }, { status: 403 });

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { customImage: true },
  });

  if (currentUser?.customImage) {
    const oldPath = path.join(process.cwd(), "public", currentUser.customImage);
    try {
      await unlink(oldPath);
    } catch {
      // File may not exist
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { customImage: null },
    });
  }

  return NextResponse.json({ success: true });
}
