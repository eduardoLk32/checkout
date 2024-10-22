import { generateToken } from "@/lib/primepag-auth";
import { PixInfo } from "@/types/pix";
import { NextRequest, NextResponse } from "next/server";

type GetPixPaymentContext = {
    params: {
        'referenceCode': string;
    };
}

export async function GET(_request: NextRequest, context: GetPixPaymentContext) {
    const { referenceCode } = context.params;

    const authData = await generateToken();
    
    if (!authData) {
        return NextResponse.json(
            {
                error: "Error generating token",
            },
            { status: 403 },
        );
    }

    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", authData.access_token);
    
    const pixResult = await fetch(`${process.env.NEXT_PUBLIC_PRIMWE_PAG_API_URL}/v1/pix/qrcodes/${referenceCode}`, {
        method: 'GET',
        headers,
        next: {
            revalidate: 0
        }
    });    
    
    const pixResultJson: PixInfo = await pixResult.json();
    console.log("🚀 ~ GET ~ pixResultJson:", pixResultJson)

    return NextResponse.json(
        pixResultJson,
        { status: 200}
    );
}
