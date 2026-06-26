// Reading Progress
const progress = document.querySelector(".progress");

window.addEventListener("scroll", () => {
  const winScroll =
    document.documentElement.scrollTop || document.body.scrollTop;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  progress.style.width = (winScroll / height) * 100 + "%";
});

// Reveal Animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(
    ".article section,.image-block,.benefit-card,.connect-card,.amenity-card,.sidebar-card,.quote,.cta"
  )
  .forEach((el) => {
    el.classList.add("fade-up");
    observer.observe(el);
  });

// Active TOC Highlight
const sections = document.querySelectorAll("section[id]");
const tocLinks = document.querySelectorAll(".toc a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 180;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });

  tocLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});