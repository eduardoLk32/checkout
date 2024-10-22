import { generateToken } from "@/lib/primepag-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const generatePixQrCodeSchema = z.object({
    chargedUser: z.object({
        fullName: z.string(),
        email: z.string(),
        document: z.string(),
    }),
    amountInCents: z.number(),
})

export interface PixGenerationResponse {
  qrcode: {
    content: string;
    reference_code: string;
  };
};

type PixInfo = z.infer<typeof generatePixQrCodeSchema>;

export async function POST(request: Request) {
    const body = await request.json();

    let pixInfo: PixInfo;

    try {
        pixInfo = generatePixQrCodeSchema.parse(body);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: (error as any).message,
            },
            { status: 400 },
        );
    }

    const auth = await generateToken();
    
    if (!auth) {
        return NextResponse.json(
            {
                error: "Error generating token",
            },
            { status: 403 },
        );
    }

    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", auth.access_token);

    var payload = JSON.stringify({
        "value_cents": pixInfo.amountInCents,
        "generator_name": pixInfo.chargedUser.fullName,
        "generator_document": pixInfo.chargedUser.document
    });

    try {
        const pixGenerationResponse = await fetch(`${process.env.NEXT_PUBLIC_PRIMWE_PAG_API_URL}/v1/pix/qrcodes`, {
            method: 'POST',
            headers,
            body: payload,
            next: {
                revalidate: 0
            }        
        });    

        const pixData: PixGenerationResponse = await pixGenerationResponse.json();

        return NextResponse.json(
            pixData,
            { status: 200}
        );
    } catch (e) {
        console.error("🚀 ~ generatePix ~ e:", e)
        return NextResponse.json(
            {
                error: (e as any).message,
            },
            { status: 400 },
        );
    }
}
