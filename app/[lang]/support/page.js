import ContactUs from "@SEGMENT/ContactUs";

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';
    const isEs = LANG === 'es';

    const title = isEs
        ? 'Soporte al Paciente | North Miami Beach'
        : 'Patient Support & Scheduling Assistance';
    const description = isEs
        ? 'Asistencia al paciente, seguimiento médico y programación de citas en Innovative Medical Wellness en North Miami Beach, FL. Llámanos al (305) 864-1373.'
        : 'Patient support, appointment scheduling, and care coordination at Innovative Medical Wellness in North Miami Beach, FL. Reach our desk at (305) 864-1373.';

    return {
        title,
        description,
        alternates: {
            canonical: `${BASE_URL}/${LANG}/support`,
            languages: {
                'en-US': `${BASE_URL}/en/support`,
                'es-ES': `${BASE_URL}/es/support`,
                'x-default': `${BASE_URL}/en/support`,
            },
        },
        openGraph: {
            title: `${title} | Innovative Medical Wellness`,
            description,
            url: `${BASE_URL}/${LANG}/support`,
            siteName: 'Innovative Medical Wellness',
            images: ['/raster/doctor.jpg'],
            locale: isEs ? 'es_ES' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/raster/doctor.jpg'],
        },
    };
}

export default async function Support({ params }) {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';

    return (
        <main>
            <ContactUs LANG={LANG} isStandalone />
        </main>
    );
}
