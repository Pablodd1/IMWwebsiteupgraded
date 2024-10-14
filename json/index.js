import 'server-only';

const dictionaries = {
  en: {
    general: {
      navs: () => import('./en/general/navs.json'),
      socialLinks: () => import('./en/general/socialLinks.json'),
      contactUS: () => import('./en/general/contactUS.json'),
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
      'anti-aging': () => import('./en/subtypes/anti-aging.json'),
      chiropractic: () => import('./en/subtypes/chiropractic.json'),
      wellness: () => import('./en/subtypes/wellness.json'),
      'regenerative-medicine': () => import('./en/subtypes/regenerative-medicine.json'),
    },
  },
  es: {
    general: {
      navs: () => import('./es/general/navs.json'),
      socialLinks: () => import('./es/general/socialLinks.json'),
    },
    homepage: {
      about: () => import('./es/homepage/about.json'),
      cards: () => import('./es/homepage/cards.json'),
      specialist: () => import('./es/homepage/specialist.json'),
    },
    subtypes: {
      'anti-aging': () => import('./es/subtypes/anti-aging.json'),
      chiropractic: () => import('./es/subtypes/chiropractic.json'),
      wellness: () => import('./es/subtypes/wellness.json'),
      'regenerative-medicine': () => import('./es/subtypes/regenerative-medicine.json'),
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
