
import { NextResponse } from "next/server";
import redis from "../lib/redis";

const GAPI_KEY = process.env.GAPI_KEY;
const GAPI_BASE_URL = process.env.GAPI_BASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queue = searchParams.get("queue");

  if (!queue) {
    return NextResponse.json(
      { error: "Queue parameter is required" },
      { status: 400 }
    );
  }

  const cacheKey = `genesys-availability:${queue}`;

  try {
    // 1. Check Redis Cache first
    const cachedStatus = await redis.get(cacheKey);
    if (cachedStatus) {
      console.log("Serving availability from cache");
      return NextResponse.json(JSON.parse(cachedStatus));
    }

    // 2. If not in cache, fetch from Genesys API
    console.log("Fetching availability from Genesys API");
    const openForResponse = await fetch(
      `${GAPI_BASE_URL}/callbacks/open-for/${queue}`,
      {
        headers: { "x-api-key": GAPI_KEY },
      }
    );
    const openForData = await openForResponse.json();

    let isAvailable = false;
    // If the queue is open, check the estimated wait time (EWT)
    if (openForData.data.openFor > 0) {
      const ewtResponse = await fetch(
        `${GAPI_BASE_URL}/estimated-wait-time?virtual-queues=${queue}&mode=mode2`,
        {
          headers: { "x-api-key": GAPI_KEY },
        }
      );
      const ewtData = await ewtResponse.json();
      const ewt = ewtData.data[0].estimatedWaitTime;

      // Available if agents are logged in (ewt != -1) and wait time is reasonable
      if (ewt !== -1 && ewt < 3600) {
        isAvailable = true;
      }
    }

    const availability = { isAvailable, timestamp: new Date().toISOString() };

    // 3. Store the result in Redis with a 60-second expiration
    await redis.set(cacheKey, JSON.stringify(availability), "EX", 60);

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Failed to fetch Genesys availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

