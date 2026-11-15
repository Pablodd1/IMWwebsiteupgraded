import ContactUs from "@SEGMENT/ContactUs";

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';
    const isEs = LANG === 'es';

    const title = isEs
        ? 'Contacto y Citas | North Miami Beach'
        : 'Contact Us & Book a Free Consultation';
    const description = isEs
        ? 'Agenda tu consulta gratuita en Innovative Medical Wellness, 1899 NE 164th St, North Miami Beach, FL 33162. Llama o escribe al (305) 864-1373.'
        : 'Book a free consultation at Innovative Medical Wellness, 1899 NE 164th St, North Miami Beach, FL 33162. Call or WhatsApp (305) 864-1373 today.';

    return {
        title,
        description,
        alternates: {
            canonical: `${BASE_URL}/${LANG}/contact`,
            languages: {
                'en-US': `${BASE_URL}/en/contact`,
                'es-ES': `${BASE_URL}/es/contact`,
                'x-default': `${BASE_URL}/en/contact`,
            },
        },
        openGraph: {
            title: `${title} | Innovative Medical Wellness`,
            description,
            url: `${BASE_URL}/${LANG}/contact`,
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

export default async function ContactPage({ params }) {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';

    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${BASE_URL}/${LANG}/contact#contactpage`,
        name: 'Contact Innovative Medical Wellness',
        url: `${BASE_URL}/${LANG}/contact`,
        mainEntity: {
            '@type': 'MedicalClinic',
            '@id': `${BASE_URL}/#medicalclinic`,
        },
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <ContactUs LANG={LANG} isStandalone />
        </main>
    );
}
