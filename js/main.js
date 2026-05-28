(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileNav.classList.remove("open"));
    });
  }

  // Animated stats
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }
      el.textContent = current.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    };
    tick();
  };
  if (counters.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((c) => obs.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  // Testimonials
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".slider-dots button");
  let slide = 0;
  const showSlide = (i) => {
    slide = i;
    testimonials.forEach((t, j) => t.classList.toggle("active", j === i));
    dots.forEach((d, j) => d.classList.toggle("active", j === i));
  };
  dots.forEach((btn, i) => btn.addEventListener("click", () => showSlide(i)));
  if (testimonials.length > 1) {
    setInterval(() => showSlide((slide + 1) % testimonials.length), 7000);
  }

  // FAQ
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  });

  // Modals
  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const id = trigger.dataset.modal;
      document.getElementById(id)?.classList.add("open");
    });
  });
  document.querySelectorAll(".modal-close, .modal-overlay").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target === el || e.target.classList.contains("modal-close")) {
        el.closest(".modal-overlay")?.classList.remove("open");
      }
    });
  });

  // Newsletter
  const nl = document.getElementById("newsletter-form");
  if (nl) {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = nl.querySelector('input[type="email"]').value;
      alert(`Thank you! We'll send updates to ${email}. (Connect to Mailchimp or Formspree for production.)`);
      nl.reset();
    });
  }

  // Header shadow on scroll
  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("scrolled", window.scrollY > 20),
    { passive: true }
  );

  // Remote image fallback (if CDN URL fails)
  document.querySelectorAll("img.remote-photo").forEach((img) => {
    let hasRetried = false;
    img.addEventListener("error", () => {
      if (hasRetried) return;
      const fallback = img.getAttribute("data-fallback-url");
      if (fallback) {
        hasRetried = true;
        img.src = fallback;
      }
    });
  });
})();
