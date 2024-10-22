async function generateToken() {
    var headers = new Headers();

    try {
        console.log(process.env.NEXT_PUBLIC_PRIMWE_PAG_CLIENT_ID + ":" + process.env.NEXT_PUBLIC_PRIMWE_PAG_CLIENT_SECRET);
        headers.append("Authorization", 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_PRIMWE_PAG_CLIENT_ID + ":" + process.env.NEXT_PUBLIC_PRIMWE_PAG_CLIENT_SECRET).toString('base64'));
        headers.append("Content-Type", "application/json");

        var body = JSON.stringify({
            "grant_type": "client_credentials"
        });
        
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_PRIMWE_PAG_API_URL}/auth/generate_token`, {
            method: 'POST',
            headers,
            body,
            next: {
                revalidate: 0
            }            
        });
        
        const { access_token, token_type, expires_in } = await authResponse.json();
        console.log("🚀 ~ generateToken ~ { access_token, token_type, expires_in } :", { access_token, token_type, expires_in } )

        return {
            access_token,
            token_type,
            expires_in
        };
    } catch (e) {
        return null;
    }    
}

export { generateToken };
