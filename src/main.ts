import './style.css'

document.addEventListener('scroll', () => {
  const hero = document.getElementById('hero') as HTMLElement | null;

  if (hero) {
    hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
  }
});