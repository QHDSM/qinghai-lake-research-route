const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.topbar nav a')];

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting);
    if (!visible) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-30% 0px -62% 0px' });
  sections.forEach(section => observer.observe(section));
}
