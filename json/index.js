import "server-only";

const dictionaries = {
  en: {
    general: {
      navs: () => import("./en/general/navs.json"),
      socialLinks: () => import("./en/general/socialLinks.json"),
      contactUS: () => import("./en/general/contactUS.json"),
      costCTA: () => import("./en/general/costCTA.json"),
      btn: () => import("./en/general/buttons.json"),
    },
    blogs: {
      Injectables: () => import("./en/blogs/Injectables.json"),
      "Hair-Restoration": () => import("./en/blogs/Hair Restoration.json"),
      "skin-treatment": () => import("./en/blogs/skin-treatment.json"),
      "Facial-Contouring": () => import("./en/blogs/Facial Contouring.json"),
      "Hormone-Replacement-Therapy": () =>
        import("./en/blogs/Hormone Replacement Therapy.json"),
      Testosterone: () =>
        import("./en/blogs/Testosterone Therapy for Men.json"),
      "NAD+Therapy": () => import("./en/blogs/NAD+ IV Therapy.json"),
      Biohacking: () => import("./en/blogs/Biohacking Protocols.json"),
      "red-light-therapy": () => import("./en/blogs/red-light-therapy.json"),
      "Mind-Body": () => import("./en/blogs/Mind-Body Connection.json"),
      "Vagus-Nerve-Stimulation": () =>
        import("./en/blogs/Vagus Nerve Stimulation.json"),
      "Personalized-Wellness": () =>
        import("./en/blogs/Personalized Wellness Programs.json"),
      Neurofeedback: () => import("./en/blogs/Neurofeedback.json"),
      "PEMF-Therapy": () => import("./en/blogs/PEMF-Therapy.json"),
      Cognitive: () => import("./en/blogs/Cognitive.json"),
      "Post-Concussion-Syndrome-Treatment": () =>
        import("./en/blogs/Post-Concussion-Syndrome-Treatment.json"),
      "spinal-decompression": () =>
        import("./en/blogs/spinal-decompression.json"),
      "chiropractic-adjustments": () =>
        import("./en/blogs/chiropractic-adjustments.json"),
      "posture-correction-therapy": () =>
        import("./en/blogs/posture-correction-therapy.json"),
      "shockwave-and-laser-therapy": () =>
        import("./en/blogs/shockwave-and-laser-therapy.json"),
      "IV-Micronutrient-Therapy": () =>
        import("./en/blogs/IV-Micronutrient-Therapy.json"),
      "NAD-Therapy": () => import("./en/blogs/NAD-Therapy.json"),
      "Custom-Blends": () => import("./en/blogs/Custom Blends.json"),
      "Performance-Booster-IVs": () =>
        import("./en/blogs/Performance Booster IVs.json"),
      "Post-MVA-Concussion-Treatment": () =>
        import("./en/blogs/Post-MVA-Concussion-Treatment.json"),
      "medical-notes": () => import("./en/blogs/medical-notes.json"),
      "Injury-Rehabilitation": () =>
        import("./en/blogs/Injury-Rehabilitation.json"),
      Whiplash: () => import("./en/blogs/Whiplash.json"),
      "stem-cell-therapy": () => import("./en/blogs/stem-cell-therapy.json"),
      "exosome-therapy": () => import("./en/blogs/exosome-therapy.json"),
      "Joint-Injections": () => import("./en/blogs/Joint-Injections.json"),
      "Clarity-Direct-Neurofeedback": () =>
        import("./en/blogs/Clarity-Direct-Neurofeedback.json"),
      "Cold-Exposure-Therapy": () =>
        import("./en/blogs/Cold-Exposure-Therapy.json"),
      "Salt-Therapy": () => import("./en/blogs/Salt-Therapy.json"),
      "Tissue-Engineering-Therapy": () =>
        import("./en/blogs/Tissue-Engineering-Therapy.json"),
      "Semaglutide-Injections": () =>
        import("./en/blogs/Semaglutide Injections.json"),
      "Brown-Fat-Activation": () =>
        import("./en/blogs/Brown Fat Activation.json"),
      "exosome-therapy": () => import("./en/blogs/exosome-therapy.json"),
      "Metabolic-Testing": () => import("./en/blogs/Metabolic Testing.json"),
    },
    about: {
      intro: () => import("./en/about/intro.json"),
      values: () => import("./en/about/values.json"),
      history: () => import("./en/about/history.json"),
    },
    homepage: {
      intro: () => import("./en/homepage/intro.json"),
      about: () => import("./en/homepage/about.json"),
      cards: () => import("./en/homepage/cards.json"),
      specialist: () => import("./en/homepage/specialist.json"),
      departs: () => import("./en/homepage/departs.json"),
      health: () => import("./en/homepage/health.json"),
    },
    subtypes: {
      "anti-aging-medicine": () =>
        import("./en/subtypes/anti-aging-medicine.json"),
      "chiropractic-and-physical-therapy": () =>
        import("./en/subtypes/chiropractic-and-physical-therapy.json"),
      "iv-therapy": () => import("./en/subtypes/iv-therapy.json"),
      "regenerative-medicine": () =>
        import("./en/subtypes/regenerative-medicine.json"),
      "brain-health": () => import("./en/subtypes/brain-health.json"),
      "aesthetic-treatments": () =>
        import("./en/subtypes/aesthetic-treatments.json"),
      "personal-injury": () => import("./en/subtypes/personal-injury.json"),
      "weight-loss-programs": () =>
        import("./en/subtypes/weight-loss-programs.json"),
      "biohacking-and-optimization": () =>
        import("./en/subtypes/biohacking-and-optimization.json"),
    },

    vtone: {
      hero: () => import("./en/vtone/hero.json"),
      featured: () => import("./en/vtone/featured.json"),
      introForm: () => import("./en/vtone/introForm.json"),
      aboutus: () => import("./en/vtone/about.json"),
      conditionsTreatment: () => import("./en/vtone/conditionsTreat.json"),
      treatmentExpectation: () => import("./en/vtone/treatments.json"),
      benefit: () => import("./en/vtone/benefit.json"),
      testimonials: () => import("./en/vtone/testimonials.json"),
      faq: () => import("./en/vtone/faq.json"),
    },
  },
  es: {
    general: {
      navs: () => import("./es/general/navs.json"),
      socialLinks: () => import("./en/general/socialLinks.json"),
      contactUS: () => import("./en/general/contactUS.json"),
      costCTA: () => import("./es/general/costCTA.json"),
      btn: () => import("./es/general/buttons.json"),
    },
    blogs: {
      Injectables: () => import("./es/blogs/Injectables.json"),
      "Hair-Restoration": () => import("./es/blogs/Hair Restoration.json"),
      "skin-treatment": () => import("./es/blogs/skin-treatment.json"),
      "Facial-Contouring": () => import("./es/blogs/Facial Contouring.json"),
      "Hormone-Replacement-Therapy": () =>
        import("./es/blogs/Hormone Replacement Therapy.json"),
      Testosterone: () =>
        import("./es/blogs/Testosterone Therapy for Men.json"),
      "NAD+Therapy": () => import("./es/blogs/NAD+ IV Therapy.json"),
      Biohacking: () => import("./es/blogs/Biohacking Protocols.json"),
      "red-light-therapy": () => import("./es/blogs/red-light-therapy.json"),
      "Mind-Body": () => import("./es/blogs/Mind-Body Connection.json"),
      "Vagus-Nerve-Stimulation": () =>
        import("./es/blogs/Vagus Nerve Stimulation.json"),
      "Personalized-Wellness": () =>
        import("./es/blogs/Personalized Wellness Programs.json"),
      Neurofeedback: () => import("./es/blogs/Neurofeedback.json"),
      "PEMF-Therapy": () => import("./es/blogs/PEMF-Therapy.json"),
      Cognitive: () => import("./es/blogs/Cognitive.json"),
      "Post-Concussion-Syndrome-Treatment": () =>
        import("./es/blogs/Post-Concussion-Syndrome-Treatment.json"),
      "spinal-decompression": () =>
        import("./es/blogs/spinal-decompression.json"),
      "chiropractic-adjustments": () =>
        import("./es/blogs/chiropractic-adjustments.json"),
      "posture-correction-therapy": () =>
        import("./es/blogs/posture-correction-therapy.json"),
      "shockwave-and-laser-therapy": () =>
        import("./es/blogs/shockwave-and-laser-therapy.json"),
      "IV-Micronutrient-Therapy": () =>
        import("./es/blogs/IV-Micronutrient-Therapy.json"),
      "NAD-Therapy": () => import("./es/blogs/NAD-Therapy.json"),
      "Custom-Blends": () => import("./es/blogs/Custom Blends.json"),
      "Performance-Booster-IVs": () =>
        import("./es/blogs/Performance Booster IVs.json"),
      "Post-MVA-Concussion-Treatment": () =>
        import("./es/blogs/Post-MVA-Concussion-Treatment.json"),
      "medical-notes": () => import("./es/blogs/medical-notes.json"),
      "Injury-Rehabilitation": () =>
        import("./es/blogs/Injury-Rehabilitation.json"),
      Whiplash: () => import("./es/blogs/Whiplash.json"),
      "stem-cell-therapy": () => import("./es/blogs/stem-cell-therapy.json"),
      "exosome-therapy": () => import("./es/blogs/exosome-therapy.json"),
      "Joint-Injections": () => import("./es/blogs/Joint-Injections.json"),
      "Clarity-Direct-Neurofeedback": () =>
        import("./es/blogs/Clarity-Direct-Neurofeedback.json"),
      "Cold-Exposure-Therapy": () =>
        import("./es/blogs/Cold-Exposure-Therapy.json"),
      "Salt-Therapy": () => import("./es/blogs/Salt-Therapy.json"),
      "Tissue-Engineering-Therapy": () =>
        import("./es/blogs/Tissue-Engineering-Therapy.json"),
      "Semaglutide-Injections": () =>
        import("./es/blogs/Semaglutide Injections.json"),
      "Brown-Fat-Activation": () =>
        import("./es/blogs/Brown Fat Activation.json"),
      "exosome-therapy": () => import("./es/blogs/exosome-therapy.json"),
      "Metabolic-Testing": () => import("./es/blogs/Metabolic Testing.json"),
    },
    about: {
      intro: () => import("./es/about/intro.json"),
      values: () => import("./es/about/values.json"),
      history: () => import("./es/about/history.json"),
    },
    homepage: {
      intro: () => import("./es/homepage/intro.json"),
      about: () => import("./es/homepage/about.json"),
      cards: () => import("./es/homepage/cards.json"),
      specialist: () => import("./es/homepage/specialist.json"),
      departs: () => import("./es/homepage/departs.json"),
      health: () => import("./es/homepage/health.json"),
    },
    subtypes: {
      "anti-aging-medicine": () =>
        import("./es/subtypes/anti-aging-medicine.json"),
      "chiropractic-and-physical-therapy": () =>
        import("./es/subtypes/chiropractic-and-physical-therapy.json"),
      "iv-therapy": () => import("./es/subtypes/iv-therapy.json"),
      "regenerative-medicine": () =>
        import("./es/subtypes/regenerative-medicine.json"),
      "brain-health": () => import("./es/subtypes/brain-health.json"),
      "aesthetic-treatments": () =>
        import("./es/subtypes/aesthetic-treatments.json"),
      "personal-injury": () => import("./es/subtypes/personal-injury.json"),
      "weight-loss-programs": () =>
        import("./es/subtypes/weight-loss-programs.json"),
      "biohacking-and-optimization": () =>
        import("./es/subtypes/biohacking-and-optimization.json"),
    },
  },
};
export const getDictionary = async (locale, path) => {
  // Ensure the path is a valid string
  if (typeof path !== "string") {
    console.info("Invalid path:", path);
    throw new Error("Path must be a string");
  }

  // Split the path into parts
  const pathParts = path.split(".");

  // Check if locale is valid and the path has at least two parts
  const currentLocale = locale || "en"; // Fallback to English
  if (!dictionaries[currentLocale]) {
    console.info("Locale not found:", currentLocale);
    throw new Error(`Locale "${currentLocale}" not found`);
  }
  // Access the nested dictionary structure
  let currentLevel = dictionaries[currentLocale];
  for (const part of pathParts) {
    if (currentLevel[part]) {
      currentLevel = currentLevel[part];
    } else {
      console.info("Path part not found:", part);
      throw new Error(`Path "${path}" not found for locale "${currentLocale}"`);
    }
  }

  // Check if currentLevel is a function and call it if it is
  if (typeof currentLevel === "function") {
    return currentLevel().then((module) => module.default);
  }

  // Return the current level if it's not a function
  return currentLevel;
};
