import crypto from 'crypto';
export const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = process.env.ENCRYPTION_KEY;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};
export const encryptObject = (obj) => {
    const encryptedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const encryptedValue = encrypt(obj[key]);
            encryptedObj[key] = encryptedValue;
        }
    }
    return encryptedObj;
};