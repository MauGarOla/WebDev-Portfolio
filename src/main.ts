// Navbar

const iconContainers = document.querySelectorAll(".icon-container");
let closeTimeout: number | null = null;

const closeDropdowns = () => {
  document.querySelectorAll(".dropdown").forEach(dropdown => {
    dropdown.classList.remove("open");
  });
};

iconContainers.forEach(icon => {
  const dropdown = icon.querySelector(".dropdown") as HTMLElement;
  if (!dropdown) return;

  let hovered = false;

  icon.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = dropdown.classList.contains("open");
    closeDropdowns();

    if (!isOpen) {
      dropdown.classList.add("open");
      hovered = false;

      closeTimeout = setTimeout(() => {
        if (!hovered) {
          dropdown.classList.remove("open");
        }
      }, 1500);
    }
  });

  dropdown.addEventListener("mouseenter", () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    hovered = true;
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
  setTimeout(() => {

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
  
    const aplicarGradiente = () => {
      const body = document.body;
      const gradientColor1 = getComputedStyle(body).getPropertyValue('--color-picker1').trim();
      const gradientColor2 = getComputedStyle(body).getPropertyValue('--color-picker2').trim();
      const gradientColor3 = getComputedStyle(body).getPropertyValue('--color-picker3').trim();
      const gradientColor4 = getComputedStyle(body).getPropertyValue('--color-picker4').trim();
      const gradientColor5 = getComputedStyle(body).getPropertyValue('--color-picker5').trim();
      const gradientColor6 = getComputedStyle(body).getPropertyValue('--color-picker6').trim();
  
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, gradientColor1); 
      gradient.addColorStop(0.2, gradientColor2);
      gradient.addColorStop(0.4, gradientColor3);
      gradient.addColorStop(0.6, gradientColor4);
      gradient.addColorStop(0.8, gradientColor5);
      gradient.addColorStop(1, gradientColor6);
  
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    };
  
    aplicarGradiente();
  
    const observer = new MutationObserver(() => aplicarGradiente());
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  
    const initialY = Math.floor(canvas.height * 0.1);
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
  }, 200)
});

//Color-Selector finish

//Translations start

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<string, Promise<Translations>> = {
  es: fetch('../i18n/es.json').then((res) => res.json()),
  en: fetch('../i18n/en.json').then((res) => res.json()),
  de: fetch('../i18n/de.json').then((res) => res.json())
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


// projects 

document.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelectorAll<HTMLElement>(".project");
  const nextBtn = document.getElementById("next-btn")!;
  const prevBtn = document.getElementById("prev-btn")!;

  let currentIndex = 0;

  function updateVisibility(index: number) {
    projects.forEach((project, i) => {
      project.classList.toggle("project-visibility", i === index);
    });
  }

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % projects.length;
    updateVisibility(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    updateVisibility(currentIndex);
  });

  updateVisibility(currentIndex); 
});