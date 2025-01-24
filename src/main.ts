interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<string, Promise<Translations>> = {
  es: fetch('../src/i18n/es.json').then((res) => res.json()),
  en: fetch('../src/i18n/en.json').then((res) => res.json()),
  de: fetch('../src/i18n/de.json').then((res) => res.json())
};

// Función para buscar claves anidadas en el JSON
const getNestedValue = (obj: Translations, path: string): string | undefined => {
  return path.split('.').reduce((acc: Translations | string | undefined, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj) as string | undefined;
};

const applyTranslations = (langData: Translations): void => {
  document.querySelectorAll('[data-key]').forEach((element) => {
    const key = element.getAttribute('data-key');
    if (key) {
      const translation = getNestedValue(langData, key);
      if (translation) {
        element.innerHTML = translation;
      }
    }
  });
};

const setLanguage = async (lang: string): Promise<void> => {
  const langData = await translations[lang];
  localStorage.setItem('lang', lang);
  applyTranslations(langData);
};

document.querySelectorAll('.lang-switch').forEach((button) => {
  button.addEventListener('click', () => {
    const lang = button.getAttribute('data-lang');
    if (lang) {
      setLanguage(lang);
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  const langData = await translations[savedLang];
  applyTranslations(langData);
});
