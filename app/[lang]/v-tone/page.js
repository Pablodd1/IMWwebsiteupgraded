import { Suspense } from "react";
import { getDictionary } from "@JSON/index";
import VToneHero from "../../../segments/vtone/Hero";
import VToneFeatured from "../../../segments/vtone/Featured";
import VToneIntroForm from "../../../segments/vtone/IntroForm";
import VToneAbout from "../../../segments/vtone/About";
import VToneConditions from "../../../segments/vtone/VToneConditions";
import VToneTreatment from "../../../segments/vtone/VToneTreatment";
import VToneBenefit from "../../../segments/vtone/VToneBenefit";
import VToneTestimonials from "../../../segments/vtone/VToneTestimonials";
import VToneFAQ from "../../../segments/vtone/VToneFAQ";

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const LANG = lang === 'es' ? 'es' : 'en';
  const title = 'V-Tone Pelvic Floor Therapy North Miami Beach';
  const description = 'Non-invasive V-Tone pelvic floor muscle stimulation for bladder leaks and urinary incontinence in North Miami Beach & Aventura. Book your free consultation.';

  return {
    title,
    description,
    keywords: [
      'V-Tone North Miami Beach',
      'V-Tone therapy Miami',
      'pelvic floor therapy Aventura',
      'urinary incontinence treatment North Miami Beach',
      'non-invasive pelvic floor strengthening',
      'bladder leak treatment Miami',
    ],
    alternates: {
      canonical: `${BASE_URL}/${LANG}/v-tone`,
      languages: {
        'en-US': `${BASE_URL}/en/v-tone`,
        'es-ES': `${BASE_URL}/es/v-tone`,
        'x-default': `${BASE_URL}/en/v-tone`,
      },
    },
    openGraph: {
      title: `${title} | Innovative Medical Wellness`,
      description,
      url: `${BASE_URL}/${LANG}/v-tone`,
      siteName: 'Innovative Medical Wellness',
      images: [
        {
          url: '/raster/vtone/hero-image.webp',
          width: 1200,
          height: 630,
          alt: 'V-Tone Pelvic Floor Therapy at Innovative Medical Wellness',
        },
      ],
      locale: LANG === 'es' ? 'es_ES' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/raster/vtone/hero-image.webp'],
    },
  };
}

export default async function VTonePage(props) {
  const { lang } = await props.params;
  const LANG = lang === 'es' ? 'es' : 'en';
  // V-Tone dictionary currently exists under en.vtone
  const vtoneLang = 'en';

  const hero = await getDictionary(vtoneLang, "vtone.hero");
  const featured = await getDictionary(vtoneLang, "vtone.featured");
  const introForm = await getDictionary(vtoneLang, "vtone.introForm");
  const about = await getDictionary(vtoneLang, "vtone.aboutus");
  const conditions = await getDictionary(vtoneLang, "vtone.conditionsTreatment");
  const treatmentExpectation = await getDictionary(vtoneLang, "vtone.treatmentExpectation");
  const benefit = await getDictionary(vtoneLang, "vtone.benefit");
  const testimonials = await getDictionary(vtoneLang, "vtone.testimonials");
  const faq = await getDictionary(vtoneLang, "vtone.faq");

  const vtoneSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${BASE_URL}/${LANG}/v-tone#medicalwebpage`,
    name: 'V-Tone Pelvic Floor Therapy',
    url: `${BASE_URL}/${LANG}/v-tone`,
    mainEntity: {
      '@type': 'MedicalProcedure',
      name: 'V-Tone Pelvic Floor Therapy',
      description: 'Non-invasive pelvic floor electrical muscle stimulation for bladder control, stress urinary incontinence, and pelvic health in North Miami Beach, FL.',
      provider: {
        '@type': 'MedicalClinic',
        '@id': `${BASE_URL}/#medicalclinic`,
      },
    },
  };

  const faqList = faq?.section?.faqs || faq?.faqs || [];
  const vtoneFaqSchema = Array.isArray(faqList) && faqList.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((f) => ({
      '@type': 'Question',
      name: f.question || f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer || f.a,
      },
    })),
  } : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vtoneSchema) }}
      />
      {vtoneFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vtoneFaqSchema) }}
        />
      )}
      <VToneHero content={hero} />

      <Suspense>
        <VToneFeatured content={featured} />
      </Suspense>

      <Suspense>
        <VToneIntroForm content={introForm} />
      </Suspense>
      <Suspense>
        <VToneAbout content={about} />
      </Suspense>
      <Suspense>
        <VToneConditions content={conditions} />
      </Suspense>

      <Suspense>
        <VToneTreatment content={treatmentExpectation} />
      </Suspense>
      <Suspense>
        <VToneBenefit content={benefit} />
      </Suspense>
      <Suspense>
        <VToneTestimonials content={testimonials} />
      </Suspense>
      <Suspense>
        <VToneFAQ content={faq} />
      </Suspense>
    </main>
  );
}
