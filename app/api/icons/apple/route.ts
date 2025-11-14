import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");
  if (!appId) {
    return new Response("Missing appId", { status: 400 });
  }

  try {
    // Lookup the app on iTunes to get the official artwork URL
    const lookupRes = await fetch(`https://itunes.apple.com/lookup?id=${appId}`, {
      cache: "no-store",
    });
    if (!lookupRes.ok) {
      return new Response("Lookup failed", { status: 502 });
    }
    const lookupJson = await lookupRes.json();
    const artworkUrl: string | undefined =
      lookupJson?.results?.[0]?.artworkUrl512 || lookupJson?.results?.[0]?.artworkUrl100;
    if (!artworkUrl) {
      return new Response("Artwork not found", { status: 404 });
    }

    // Fetch the image itself and stream it back to the client
    const imgRes = await fetch(artworkUrl, { cache: "force-cache" });
    if (!imgRes.ok || !imgRes.body) {
      return new Response("Image fetch failed", { status: 502 });
    }
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    return new Response(imgRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache at the CDN and browser for 1 day, allow SWR
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
