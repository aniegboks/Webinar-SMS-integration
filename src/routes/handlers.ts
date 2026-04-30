export const createPosts = async (phoneNumber: string, fullName: string) => {
    const mrcIdentity = process.env.ACCOUNT_ID;
    const mrcToken = process.env.AKUUK_API_KEY;
    const senderSerial = process.env.AKUUK_SENDER_ID_SERIAL;

    const authHeader = `Basic ${Buffer.from(`${mrcIdentity}:${mrcToken}`).toString('base64')}`;

    let cleanNumber = phoneNumber.replace('+', '');
    if (cleanNumber.startsWith('0')) {
        cleanNumber = '234' + cleanNumber.substring(1);
    }

    const payload = {
        mrcReference: `REF-${Date.now()}`,
        countryCode: 234,
        number: cleanNumber,
        sender: senderSerial,
        type: "text",
        message: `Hi ${fullName}, your registration was successful! Welcome to Effective Communication Using SMS. on May 7th, 2026 at 10:00 AM`
    };

    try {
        const response = await fetch(`https://api.akuuk.com/messaging/sms`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("Akuuk Message Response:", result);

        return { success: response.ok, data: result };
    } catch (error) {
        console.error("Critical Connection Error:", error);
        return { success: false, error };
    }
};