/* ===============================
   GLOBAL STATE
================================ */
let isEnglish = false;

/* ===============================
   LANGUAGE HANDLING
================================ */
function setLang(toEnglish) {
  document.querySelectorAll("[data-np][data-en]").forEach(el => {
    el.textContent = toEnglish ? el.dataset.en : el.dataset.np;
  });

  document
    .querySelectorAll("[data-np-placeholder][data-en-placeholder]")
    .forEach(el => {
      el.placeholder = toEnglish
        ? el.dataset.enPlaceholder
        : el.dataset.npPlaceholder;
    });

  const langLabel = document.getElementById("langLabel");
  if (langLabel) langLabel.textContent = toEnglish ? "NP" : "EN";

  document.documentElement.lang = toEnglish ? "en" : "ne";

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.setAttribute(
      "aria-label",
      toEnglish ? "भाषा नेपालीमा परिवर्तन" : "Change language to English"
    );
  }

  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.setAttribute(
      "aria-label",
      menuBtn.getAttribute("aria-expanded") === "true"
        ? toEnglish ? "Close menu" : "मेनु बन्द गर्नुहोस्"
        : toEnglish ? "Open menu" : "मेनु खोल्नुहोस्"
    );
  }

  isEnglish = toEnglish;
}

const langToggle = document.getElementById("langToggle");
if (langToggle) {
  langToggle.addEventListener("click", () => setLang(!isEnglish));
}

/* ===============================
   MOBILE MENU
================================ */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.hasAttribute("hidden");
    mobileMenu.toggleAttribute("hidden", !open);
    menuBtn.setAttribute("aria-expanded", open);
  });

  mobileMenu.addEventListener("click", e => {
    if (!e.target.closest("a")) return;
    mobileMenu.setAttribute("hidden", "");
    menuBtn.setAttribute("aria-expanded", "false");
  });
}

/* ===============================
   CONTACT FORM
================================ */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = contactForm.name?.value.trim();
    const email = contactForm.email?.value.trim();
    const phone = contactForm.phone?.value.trim();
    const message = contactForm.message?.value.trim();

    if (!name || !email || !phone || !message) {
      alert(isEnglish ? "Please fill in all fields." : "कृपया सबै फिल्डहरू भर्नुहोस्।");
      return;
    }

    alert(
      isEnglish
        ? `Thank you, ${name}! Your message has been received.`
        : `धन्यवाद, ${name}! तपाईंको सन्देश प्राप्त भयो।`
    );

    contactForm.reset();
  });
}

/* ===============================
   SMOOTH SCROLL
================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    const nav = document.querySelector(".navbar");
    const offset = nav ? nav.offsetHeight : 80;

    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: "smooth"
    });

    if (mobileMenu && !mobileMenu.hasAttribute("hidden")) {
      mobileMenu.setAttribute("hidden", "");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });
});

/* ===============================
   SCROLL ANIMATIONS
================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.opacity = "1";
    e.target.style.transform = "translateY(0) scale(1)";
    e.target.closest(".section")?.classList.add("revealed");
  });
}, { threshold: 0.12 });

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".value-card, .service-card, .team-card")
    .forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px) scale(.98)";
      el.style.transition =
        "opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)";
      observer.observe(el);
    });
});

/* ===============================
   NAVBAR SCROLL EFFECT
================================ */
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });
}

/* ===============================
   ACTIVE NAV LINK
================================ */
(function setActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link, .mobile-link");

  window.addEventListener("scroll", () => {
    const pos = window.scrollY + 120;
    let current = "";

    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  });
})();

/* ===============================
   ACCESSIBILITY
================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && mobileMenu && !mobileMenu.hasAttribute("hidden")) {
    mobileMenu.setAttribute("hidden", "");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.focus();
  }
});

/* ===============================
   INITIALIZATION
================================ */
setLang(false);

/* ===============================
   LOADER (ALWAYS)
================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 600);
  }, 3000);
});

/* ===== SERVICES TOGGLE ===== */

document.querySelectorAll(".service-card").forEach((card) => {
  const btn = card.querySelector(".service-toggle");
  if (!btn) return;

  const setBtnText = (open) => {
    const isEnglish = window.isEnglish === true;

    if (open) {
      btn.textContent = isEnglish ? "Show less" : "कम देखाउनुहोस्";
    } else {
      btn.textContent = isEnglish ? btn.dataset.en : btn.dataset.np;
    }
  };

  setBtnText(false);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpening = !card.classList.contains("is-open");

    // close others
    document.querySelectorAll(".service-card.is-open").forEach((c) => {
      c.classList.remove("is-open");
      const b = c.querySelector(".service-toggle");
      if (b) {
        b.setAttribute("aria-expanded", "false");
        const isEnglish = window.isEnglish === true;
        b.textContent = isEnglish ? b.dataset.en : b.dataset.np;
      }
    });

    if (isOpening) {
      card.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      setBtnText(true);
    } else {
      card.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      setBtnText(false);
    }
  });

  // close when user taps outside
  document.addEventListener("click", (e) => {
    if (!card.classList.contains("is-open")) return;
    if (card.contains(e.target)) return;

    card.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    setBtnText(false);
  });
});