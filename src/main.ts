// Navbar

const iconContainers = document.querySelectorAll(".icon-container");
let closeTimeout: number | null = null;

const closeDropdowns = () => {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.classList.remove("open");
    });
};

iconContainers.forEach(icon => {
    icon.addEventListener("click", (event) => {
        event.stopPropagation();

        const dropdown = icon.querySelector(".dropdown") as HTMLElement;
        if (!dropdown) return;

        const isOpen = dropdown.classList.contains("open");
        closeDropdowns();

        if (!isOpen) {
            dropdown.classList.add("open");
        }
    });

    const dropdown = icon.querySelector(".dropdown") as HTMLElement;
    if (!dropdown) return;

    dropdown.addEventListener("mouseenter", () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    });

    dropdown.addEventListener("mouseleave", () => {
        closeTimeout = setTimeout(() => {
            dropdown.classList.remove("open");
        }, 300);
    });
});

document.addEventListener("scroll", closeDropdowns);
document.addEventListener("click", closeDropdowns);



// //Light-Dark start

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

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("color-picker") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const indicator = document.getElementById("color-indicator") as HTMLDivElement;
  let isDragging = false;

  const setIndicatorPosition = (y: number) => {
    y = Math.max(0, Math.min(y, canvas.height - 1));
    indicator.style.top = `${y}px`;

    const pixel = ctx.getImageData(0, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    document.body.style.setProperty("--action", color);
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ff0000");
  gradient.addColorStop(0.17, "#ffff00");
  gradient.addColorStop(0.34, "#00ff00");
  gradient.addColorStop(0.51, "#00ffff");
  gradient.addColorStop(0.68, "#0000ff");
  gradient.addColorStop(0.85, "#ff00ff");
  gradient.addColorStop(1, "#ff0000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const initialY = Math.floor(canvas.height * 0.5);
  setIndicatorPosition(initialY);

  canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    setIndicatorPosition(event.offsetY);
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
      setIndicatorPosition(event.offsetY);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
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

//Translations finish
