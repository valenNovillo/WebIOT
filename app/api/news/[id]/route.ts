import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_PASSWORD;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = await getDb();
    const body = await req.json();
    // Partial update: only touch the fields present in the body, so a
    // reorder call (just `{ order }`) doesn't wipe the rest of the doc.
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const textFields = [
      "title_es", "title_en",
      "summary_es", "summary_en",
      "category_es", "category_en",
      "link",
    ] as const;
    for (const f of textFields) {
      if (body[f] !== undefined) update[f] = body[f];
    }
    if (body.date) update.date = new Date(body.date);
    if (body.imagenId) update.images = [new ObjectId(body.imagenId)];
    if (body.order !== undefined) update.order = body.order;
    await db
      .collection("novedads")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: update });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = await getDb();
    await db
      .collection("novedads")
      .deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
