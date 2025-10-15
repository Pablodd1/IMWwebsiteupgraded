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

export const metadata = {
  title: "V-Tone | Innovative Medical Wellness",
  description: "Regain confidence with this non-invasive treatment.",
};

export default async function VTonePage(props) {
  const { lang } = await props.params;

  const hero = await getDictionary(lang, "vtone.hero");
  const featured = await getDictionary(lang, "vtone.featured");
  const introForm = await getDictionary(lang, "vtone.introForm");
  const about = await getDictionary(lang, "vtone.aboutus");
  const conditions = await getDictionary(lang, "vtone.conditionsTreatment");
  const treatmentExpectation = await getDictionary(
    lang,
    "vtone.treatmentExpectation"
  );

  const benefit = await getDictionary(lang, "vtone.benefit");
  const testimonials = await getDictionary(lang, "vtone.testimonials");
  const faq = await getDictionary(lang, "vtone.faq");

  return (
    <main>
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
