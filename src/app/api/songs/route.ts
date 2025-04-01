// src/app/api/songs/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "~/server/db";
import { songs } from "~/server/db/schema";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js body parsing, we'll handle file upload manually
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audioFile") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string;
    const genre = formData.get("genre") as string;
    
    if (!audioFile || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Received file:", audioFile.name, "Size:", audioFile.size);

    // Convert File to buffer for cloudinary upload
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary using promises
    try {
      const cloudinaryResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "music_app/songs",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        
        // Using the buffer directly with end()
        uploadStream.end(buffer);
      });
      
      console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

      // Store in database
      const newSong = await db.insert(songs).values({
        title,
        artist: artist || null,
        album: album || null,
        genre: genre || null,
        duration: cloudinaryResult.duration ? cloudinaryResult.duration.toString() : null,
        cloudinaryUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        coverArtUrl: null,
      }).returning();

      return NextResponse.json({ success: true, song: newSong[0] });
      
    } catch (cloudinaryError) {
      console.error("Error in Cloudinary upload:", cloudinaryError);
      return NextResponse.json({ error: "Failed to upload to Cloudinary", details: cloudinaryError }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error uploading song:", error);
    return NextResponse.json({ error: "Failed to upload song", details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allSongs = await db.select().from(songs).orderBy(songs.createdAt);
    return NextResponse.json(allSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}