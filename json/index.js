import 'server-only';

const dictionaries = {
  en: {
    general: {
      navs: () => import('./en/general/navs.json'),
      socialLinks: () => import('./en/general/socialLinks.json'),
      contactUS: () => import('./en/general/contactUS.json'),
    },
    about: {
      intro: () => import('./en/about/intro.json'),
      values: () => import('./en/about/values.json'),
      history: () => import('./en/about/history.json'),
    },
    homepage: {
      intro: () => import('./en/homepage/intro.json'),
      about: () => import('./en/homepage/about.json'),
      cards: () => import('./en/homepage/cards.json'),
      specialist: () => import('./en/homepage/specialist.json'),
      departs: () => import('./en/homepage/departs.json'),
      health: () => import('./en/homepage/health.json'),
    },
    subtypes: {
      'anti-aging-medicine': () => import('./en/subtypes/anti-aging-medicine.json'),
      'chiropractic-and-physical-therapy': () => import('./en/subtypes/chiropractic-and-physical-therapy.json'),
      'iv-therapy': () => import('./en/subtypes/iv-therapy.json'),
      'regenerative-medicine': () => import('./en/subtypes/regenerative-medicine.json'),
      'brain-Health': () => import('./en/subtypes/brain-Health.json'),
      'aesthetic-treatments': () => import('./en/subtypes/aesthetic-treatments.json'),
      'personal-Injury': () => import('./en/subtypes/personal-Injury.json'),
      'weight-loss-programs': () => import('./en/subtypes/weight-loss-programs.json'),
      'biohacking-and-optimization': () => import('./en/subtypes/biohacking-and-optimization.json')
    },
  },
  es: {
    general: {
      navs: () => import('./es/general/navs.json'),
      socialLinks: () => import('./es/general/socialLinks.json'),
      contactUS: () => import('./es/general/contactUS.json'),
    },
    about: {
      intro: () => import('./es/about/intro.json'),
      values: () => import('./es/about/values.json'),
      history: () => import('./es/about/history.json'),
    },
    homepage: {
      intro: () => import('./es/homepage/intro.json'),
      about: () => import('./es/homepage/about.json'),
      cards: () => import('./es/homepage/cards.json'),
      specialist: () => import('./es/homepage/specialist.json'),
      departs: () => import('./es/homepage/departs.json'),
      health: () => import('./es/homepage/health.json'),
    },
    subtypes: {
      'anti-aging-medicine': () => import('./es/subtypes/anti-aging-medicine.json'),
      'chiropractic-and-physical-therapy': () => import('./es/subtypes/chiropractic-and-physical-therapy.json'),
      'iv-therapy': () => import('./es/subtypes/iv-therapy.json'),
      'regenerative-medicine': () => import('./es/subtypes/regenerative-medicine.json'),
      'brain-Health': () => import('./es/subtypes/brain-Health.json'),
      'aesthetic-treatments': () => import('./es/subtypes/aesthetic-treatments.json'),
      'personal-Injury': () => import('./es/subtypes/personal-Injury.json'),
      'weight-loss-programs': () => import('./es/subtypes/weight-loss-programs.json'),
      'biohacking-and-optimization': () => import('./es/subtypes/biohacking-and-optimization.json')
    },
  },
};

export const getDictionary = async (locale, path) => {
  const pathParts = path.split('.');
  let currentLevel = dictionaries[locale];

  for (const part of pathParts) {
    if (!currentLevel[part]) {
      throw new Error(`Path "${path}" not found for locale "${locale}"`);
    }
    currentLevel = currentLevel[part];
  }

  if (typeof currentLevel === 'function') {
    return currentLevel().then((module) => module.default);
  }

  const data = {};
  for (const key in currentLevel) {
    if (typeof currentLevel[key] === 'function') {
      data[key] = await currentLevel[key]().then((module) => module.default);
    }
  }

  return data;
};
