import { NextResponse } from 'next/server';
import { sendEmailNotification } from './email';
import { encryptObject } from './encrypt';
import htmlContent from './temlate';
// import Log from './writelog';


export async function POST(req) {
    const body = await req.json();
    const obj = encryptObject(body);
    const htmlBody = htmlContent(body)
    try {
        // await Log(obj);
        await sendEmailNotification(
            [process.env.MYABABEEL,"jasmelacosta@gmail.com"],
            process.env.TITLE,
            `A New Form Submitted - IMW`,
            htmlBody
        );

        return NextResponse.json({ message: 'Success' }, { status: 200 });

    } catch (error) {

        await sendEmailNotification(
            [process.env.MYABABEEL],
            process.env.TITLE,
            'Error occurred',
            body.query
        );
        return NextResponse.error({ message: 'Internal Server Error' }, { status: 500 });
    }
}
