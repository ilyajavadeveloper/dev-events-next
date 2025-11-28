import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        const bytes = await req.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploaded: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { folder: "DevEvent", resource_type: "image" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({ secure_url: uploaded.secure_url });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
