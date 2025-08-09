import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  // If no query is provided, fetch curated images
  const endpoint = query
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=12`
    : `https://api.pexels.com/v1/curated?per_page=12`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY || "",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from Pexels");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
