'use server'

interface PixGenerationResponse {
  qrcode: {
    content: string;
    reference_code: string;
  };
};

interface PixGenerationData {
  chargedUser: {
    fullName: string;
    email: string;
    document: string;
  };
  amountInCents: number;
}

export async function generateToken() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRIMEPAG_API_URL}/auth/generate_token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_PRIMEPAG_CLIENT_ID + ":" + process.env.NEXT_PUBLIC_PRIMEPAG_CLIENT_SECRET).toString('base64'),
      },
      body: JSON.stringify({
        "grant_type": "client_credentials"
      }),
    }
  );
  
  const { access_token, token_type, expires_in } = await response.json();

  return {
    access_token,
    token_type,
    expires_in
  };
}

export async function generatePix(pixGenerationData: PixGenerationData) {
  const { access_token } = await generateToken();

  try {

    const response = await fetch(
      'https://api-stg.primepag.com.br/v1/pix/qrcodes', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': access_token,
        },
        body: JSON.stringify({
          "value_cents": pixGenerationData.amountInCents,
          "generator_name": pixGenerationData.chargedUser.fullName,
          "generator_document": pixGenerationData.chargedUser.document
        }),
      }
    );    

    const pixData: PixGenerationResponse = await response.json();

    return {
      status: "success",
      message: `Welcome!`,
      data: pixData
    };
  } catch (e) {
    return {
      status: "error",
      message: `Error: ${e}`,
    };
  }    
}