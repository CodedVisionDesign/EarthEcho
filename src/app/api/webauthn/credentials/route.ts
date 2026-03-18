import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credentials = await db.webAuthnCredential.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      credentialId: true,
      deviceName: true,
      backedUp: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ credentials });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { credentialId } = body;

  if (!credentialId) {
    return NextResponse.json(
      { error: "Missing credentialId" },
      { status: 400 }
    );
  }

  // Ensure the credential belongs to this user
  const credential = await db.webAuthnCredential.findFirst({
    where: { id: credentialId, userId: session.user.id },
  });

  if (!credential) {
    return NextResponse.json(
      { error: "Credential not found" },
      { status: 404 }
    );
  }

  // Check user still has another auth method before deleting last passkey
  const [otherPasskeys, user] = await Promise.all([
    db.webAuthnCredential.count({
      where: { userId: session.user.id, id: { not: credentialId } },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, accounts: { select: { id: true } } },
    }),
  ]);

  const hasOtherAuth = otherPasskeys > 0 || !!user?.password || (user?.accounts?.length ?? 0) > 0;

  if (!hasOtherAuth) {
    return NextResponse.json(
      { error: "Cannot remove last authentication method" },
      { status: 400 }
    );
  }

  await db.webAuthnCredential.delete({ where: { id: credentialId } });

  return NextResponse.json({ success: true });
}
