import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;
type ImageMime = keyof typeof extensions;

function matchesSignature(type: ImageMime, bytes: Uint8Array) {
  if (type === "image/jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png")
    return bytes
      .slice(0, 8)
      .every(
        (value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index],
      );
  const ascii = new TextDecoder().decode(bytes);
  if (type === "image/webp")
    return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
  return ascii.slice(4, 12) === "ftypavif" || ascii.slice(4, 12) === "ftypavis";
}
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const form = await request.formData();
  const file = form.get("file");
  const siteId = String(form.get("siteId") ?? "pending");
  if (siteId !== "pending" && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(siteId))
    return NextResponse.json(
      { error: "Invalid website identifier." },
      { status: 400 },
    );
  if (!(file instanceof File))
    return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  if (!(file.type in extensions))
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP or AVIF image." },
      { status: 400 },
    );
  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json(
      { error: "Images must be smaller than 10 MB." },
      { status: 400 },
    );
  if (file.size === 0)
    return NextResponse.json(
      { error: "The selected image is empty." },
      { status: 400 },
    );
  const mime = file.type as ImageMime;
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesSignature(mime, bytes))
    return NextResponse.json(
      { error: "The file contents do not match a supported image type." },
      { status: 400 },
    );
  const extension = extensions[mime];
  const path = `${user.id}/${siteId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("site-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  const { data: media, error: rowError } = await supabase
    .from("media")
    .insert({
      owner_id: user.id,
      site_id: siteId === "pending" ? null : siteId,
      storage_path: path,
      public_url: data.publicUrl,
      mime_type: file.type,
      file_size: file.size,
    })
    .select("id,public_url,storage_path")
    .single();
  if (rowError) {
    await supabase.storage.from("site-media").remove([path]);
    return NextResponse.json({ error: rowError.message }, { status: 400 });
  }
  return NextResponse.json({ id: media.id, url: data.publicUrl });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const siteId = new URL(request.url).searchParams.get("siteId");
  if (!siteId)
    return NextResponse.json(
      { error: "Website is required." },
      { status: 400 },
    );
  const { data, error } = await supabase
    .from("media")
    .select(
      "id,public_url,storage_path,mime_type,file_size,width,height,alt_text,created_at",
    )
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ media: data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const body = (await request.json()) as {
    id?: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  if (!body.id || (body.altText?.length ?? 0) > 300)
    return NextResponse.json(
      { error: "Invalid media update." },
      { status: 400 },
    );
  const { error } = await supabase
    .from("media")
    .update({
      alt_text: body.altText?.trim() || null,
      width: body.width,
      height: body.height,
    })
    .eq("id", body.id)
    .eq("owner_id", user.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const id = new URL(request.url).searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { error: "Media item is required." },
      { status: 400 },
    );
  const { data: item } = await supabase
    .from("media")
    .select("id,site_id,storage_path,public_url")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();
  if (!item)
    return NextResponse.json(
      { error: "Media item not found." },
      { status: 404 },
    );
  const [{ count: experienceUse }, { count: businessUse }, { count: siteUse }] =
    await Promise.all([
      supabase
        .from("experiences")
        .select("id", { count: "exact", head: true })
        .eq("site_id", item.site_id)
        .or(
          `featured_image_url.eq.${item.public_url},gallery.cs.${JSON.stringify([{ url: item.public_url }])}`,
        ),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("logo_url", item.public_url),
      supabase
        .from("sites")
        .select("id", { count: "exact", head: true })
        .or(
          `favicon_url.eq.${item.public_url},default_og_image_url.eq.${item.public_url}`,
        ),
    ]);
  if ((experienceUse ?? 0) + (businessUse ?? 0) + (siteUse ?? 0) > 0)
    return NextResponse.json(
      {
        error:
          "This image is currently used by the website and cannot be deleted.",
      },
      { status: 409 },
    );
  const { error: storageError } = await supabase.storage
    .from("site-media")
    .remove([item.storage_path]);
  if (storageError)
    return NextResponse.json({ error: storageError.message }, { status: 400 });
  const { error } = await supabase.from("media").delete().eq("id", item.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
