//Light-Dark start

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

prefersDarkScheme.addEventListener("change", (e) => {
  const isDarkMode = e.matches;
  
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system";
  if (savedTheme === "system") {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
});

const setTheme = (theme: "light" | "dark" | "system") => {
  const body = document.body;
  
  body.classList.remove("dark");
  
  if (theme === "dark") {
    body.classList.add("dark");
  } else if (theme === "system") {
    if (prefersDarkScheme.matches) {
      body.classList.add("dark");
    }
  }
  
  localStorage.setItem("theme", theme);
};

document.getElementById("light-button")?.addEventListener("click", () => {
  setTheme("light");
});
document.getElementById("dark-button")?.addEventListener("click", () => {
  setTheme("dark");
});
document.getElementById("system-button")?.addEventListener("click", () => {
  setTheme("system");
});

const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system";

if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme("system");
}

//Light-Dark finish

//Color-Selector start

const colorInput = document.getElementById("colorInput") as HTMLInputElement;

let currentColor = "#6FCF97";

const updateStrongColors = () => {
  const strongElements = document.querySelectorAll("strong");
  strongElements.forEach((el) => {
    (el as HTMLElement).style.color = currentColor;
  });
};

const updateColor = (color: string) => {
  currentColor = color;
  updateStrongColors();
};

colorInput.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  const selectedColor = target.value;
  updateColor(selectedColor);
});

//Color-Selector finish

//Translations start

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<string, Promise<Translations>> = {
  es: fetch('../i18n/es.json').then((res) => res.json()),
  en: fetch('../i18n/es.json').then((res) => res.json()),
  de: fetch('../i18n/es.json').then((res) => res.json())
};

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

  updateStrongColors();
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

  updateStrongColors();
});

//Translations finish
