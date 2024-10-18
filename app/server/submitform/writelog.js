import fs from 'fs';
const DIR = `./public/_forms`;

function generateRandomFileName() {
    const randomString = Math.random().toString(36).slice(2, 18);
    const date = new Date().toISOString().split('T')[0];
    return `${randomString}-${date}.json`;
}
export default async function Log(obj) {

    const fileName = generateRandomFileName();
    const filePath = `${DIR}/${fileName}`;
    try {
        if (!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify({ ...obj, createdAt: new Date() }, null, 2));

    }
    catch (err) {
        console.error('Error writing file:', err);

    }
}