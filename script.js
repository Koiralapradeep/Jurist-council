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
      el.placeholder = toEnglish ? el.dataset.enPlaceholder : el.dataset.npPlaceholder;
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
        ? (toEnglish ? "Close menu" : "मेनु बन्द गर्नुहोस्")
        : (toEnglish ? "Open menu" : "मेनु खोल्नुहोस्")
    );
  }

  isEnglish = toEnglish;
  window.isEnglish = isEnglish;
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
   EMAILJS CONFIG
================================ */
const EMAILJS_PUBLIC_KEY = "jnEux1iOoZ-ElIKCs";
const EMAILJS_SERVICE_ID = "service_8e3tq1v";
const EMAILJS_TEMPLATE_ID = "template_uzho2ep";

if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/* ===============================
   TOAST
================================ */
function ensureToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    stack.setAttribute("aria-atomic", "true");
    document.body.appendChild(stack);
  }
  return stack;
}

function toast(type, title, msg, timeout = 7000) {
  const stack = ensureToastStack();

  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  el.innerHTML = `
    <div>
      <div class="t-title">${title}</div>
      <p class="t-msg">${msg}</p>
    </div>
    <button class="t-close" type="button" aria-label="Close">✕</button>
  `;

  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;

    el.classList.remove("is-show");
    el.classList.add("is-hide");

    // remove after animation
    window.setTimeout(() => {
      el.remove();
    }, 260);
  };

  el.querySelector(".t-close").addEventListener("click", close);

  stack.appendChild(el);

  // trigger enter animation
  requestAnimationFrame(() => {
    el.classList.add("is-show");
  });

  if (timeout) window.setTimeout(close, timeout);
}


/* ===============================
   HELPERS
================================ */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setFieldError(fieldEl, message) {
  if (!fieldEl) return;
  fieldEl.classList.add("is-invalid");
  const small = fieldEl.querySelector(".error");
  if (small) small.textContent = message || "";
}

function clearFieldError(fieldEl) {
  if (!fieldEl) return;
  fieldEl.classList.remove("is-invalid");
  const small = fieldEl.querySelector(".error");
  if (small) small.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 25 && /^[+\d][\d+]*$/.test(cleaned);
}

function t(np, en) {
  return isEnglish ? en : np;
}

function mapConsultationToNepali(val) {
  if (val === "In-person") return "कार्यालयमा";
  if (val === "Phone") return "फोन";
  return val;
}
function mapMatterToNepali(val) {
  if (val === "New matter") return "नयाँ विषय";
  if (val === "Ongoing case") return "चलिरहेको मुद्दा";
  return val;
}
function mapYesNoToNepali(val) {
  if (val === "Yes") return "हो";
  if (val === "No") return "होइन";
  return val;
}
function mapHeardToNepali(value) {
  switch (value) {
    case "Referral":
      return "सिफारिस";
    case "Google":
      return "गुगल";
    case "Social media":
      return "सामाजिक सञ्जाल";
    case "Google Maps":
      return "गुगल म्याप";
    case "Other":
      return "अन्य";
    default:
      return value || "";
  }
}


/* ===============================
   BOOKING FORM 
================================ */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field) clearFieldError(field);
  });

  contactForm.addEventListener("change", (e) => {
    const field = e.target.closest(".field");
    if (field) clearFieldError(field);
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector(".booking-btn");
    const btnText = contactForm.querySelector(".btn-text");
    const btnLoading = contactForm.querySelector(".btn-loading");

    // SAFE reads
    const fullName = (contactForm.full_name?.value || "").trim();
    const email = (contactForm.email?.value || "").trim();
    const phone = (contactForm.phone?.value || "").trim();
    const consultationType = (contactForm.consultation_type?.value || "");
    const matterStatus = (contactForm.matter_status?.value || "");
    const consultedOther = (contactForm.consulted_other_attorney?.value || "");
    const heardAboutUs = (contactForm.heard_about_us?.value || "");
    const issueDescription = (contactForm.issue_description?.value || "");

    let ok = true;
    contactForm.querySelectorAll(".field").forEach(clearFieldError);

    // Full name
    const fNameField = document.getElementById("bf_name")?.closest(".field");
    if (!fullName || fullName.length < 2) {
      ok = false;
      setFieldError(fNameField, t("कृपया पुरा नाम लेख्नुहोस्।", "Please enter your full name."));
    }

    // Email
    const emailField = document.getElementById("bf_email")?.closest(".field");
    if (!email || !isValidEmail(email)) {
      ok = false;
      setFieldError(emailField, t("कृपया सही इमेल लेख्नुहोस्।", "Please enter a valid email address."));
    }

    // Phone
    const phoneField = document.getElementById("bf_phone")?.closest(".field");
    if (!phone || !isValidPhone(phone)) {
      ok = false;
      setFieldError(phoneField, t("कृपया सही फोन नम्बर लेख्नुहोस्।", "Please enter a valid phone number."));
    }

    // Consultation type
    const consultField = document.getElementById("bf_consultation")?.closest(".field");
    if (!consultationType) {
      ok = false;
      setFieldError(consultField, t("कृपया परामर्श प्रकार छान्नुहोस्।", "Please select consultation type."));
    }

    // Matter status
    const matterField = contactForm.querySelector('input[name="matter_status"]')?.closest(".field");
    if (!matterStatus) {
      ok = false;
      setFieldError(matterField, t("कृपया एउटा विकल्प छान्नुहोस्।", "Please choose one option."));
    }

    // Consulted other attorney
    const otherField = contactForm.querySelector('input[name="consulted_other_attorney"]')?.closest(".field");
    if (!consultedOther) {
      ok = false;
      setFieldError(otherField, t("कृपया छ/छैन छान्नुहोस्।", "Please choose yes or no."));
    }

    // Heard about us
    const sourceField = document.getElementById("bf_source")?.closest(".field");
    if (!heardAboutUs) {
      ok = false;
      setFieldError(sourceField, t("कृपया एउटा विकल्प छान्नुहोस्।", "Please select one option."));
    }

    // Description 
    const descField = document.getElementById("bf_desc")?.closest(".field");
    if (!issueDescription || issueDescription.trim().length < 20) {
      ok = false;
      setFieldError(descField, t("कृपया समस्याको विवरण लेख्नुहोस् (कम्तीमा २० अक्षर)।", "Please describe your legal issue (at least 20 characters)."));
    }

    if (!ok) {
      toast(
        "error",
        t("फर्म ठीक पार्नुहोस्", "Please fix the form"),
        t("केही फिल्डहरू जाँच गर्नुहोस्।", "Some fields need your attention.")
      );

      const firstInvalid = contactForm.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
      firstInvalid?.focus();
      return;
    }

    // Values shown in email should match selected language
    const consultationDisplay = isEnglish ? consultationType : mapConsultationToNepali(consultationType);
    const matterDisplay = isEnglish ? matterStatus : mapMatterToNepali(matterStatus);
    const consultedDisplay = isEnglish ? consultedOther : mapYesNoToNepali(consultedOther);

    const heardDisplay = isEnglish ? heardAboutUs : mapHeardToNepali(heardAboutUs);

    const submittedAt = new Date().toLocaleString();

    // Email body in selected language 
    const tableHtml = `
      <div style="font-family:Arial, sans-serif; line-height:1.45;">
        <h2 style="margin:0 0 10px;">${escapeHtml(t("नयाँ परामर्श बुकिङ", "New Consultation Booking"))}</h2>

        <table border="1" cellpadding="10" cellspacing="0"
          style="border-collapse:collapse; width:100%; max-width:760px; border:1px solid #ddd;">
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("पुरा नाम", "Full Name"))}</th>
            <td>${escapeHtml(fullName)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("इमेल ठेगाना", "Email Address"))}</th>
            <td>${escapeHtml(email)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("फोन नम्बर", "Phone Number"))}</th>
            <td>${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("परामर्श प्रकार", "Type of Consultation"))}</th>
            <td>${escapeHtml(consultationDisplay)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("विषय (नयाँ/चलिरहेको)", "New matter or ongoing case"))}</th>
            <td>${escapeHtml(matterDisplay)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("अर्को वकिलसँग परामर्श गर्नुभएको छ?", "Consulted another attorney?"))}</th>
            <td>${escapeHtml(consultedDisplay)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("हामीबारे कसरी थाहा पाउनुभयो?", "How did you hear about us?"))}</th>
            <td>${escapeHtml(heardDisplay)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("कानुनी समस्याको विवरण", "Description of legal issue"))}</th>
            <td>${escapeHtml(issueDescription).replaceAll("\n", "<br/>")}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("पठाइएको समय", "Submitted At"))}</th>
            <td>${escapeHtml(submittedAt)}</td>
          </tr>
          <tr>
            <th align="left" style="background:#f7f7f7;">${escapeHtml(t("पृष्ठ", "Page"))}</th>
            <td>${escapeHtml(window.location.href)}</td>
          </tr>
        </table>

        <p style="margin:10px 0 0; color:#666; font-size:12px;">
          ${escapeHtml(t(
            "नोट: Reply गर्दा उत्तर सिधै क्लाइन्टको इमेलमा जान्छ।",
            "Note: Reply will go directly to the client"
          ))}
        </p>
      </div>
    `;

    // Loading UI
    if (btn) btn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "inline";

    try {
      if (!window.emailjs) throw new Error("EmailJS not loaded. Check CDN script in index.html.");

      const params = {
        // Subject also follows language
        subject: isEnglish
          ? `Consultation Booking - ${consultationType}`
          : `परामर्श बुकिङ - ${consultationDisplay}`,
        reply_to: email,
        from_name: fullName,
        message_html: tableHtml
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);

      toast(
        "success",
        t("बुकिङ कन्फर्म भयो", "Booking confirmed"),
        t("हामीले तपाईंलाई चाँडै सम्पर्क गर्नेछौं।", "We will contact you soon.")
      );

      contactForm.reset();
    } catch (err) {
      console.error(err);
      toast(
        "error",
        t("पठाउन असफल", "Failed to send"),
        t("फेरि प्रयास गर्नुहोस् वा फोनबाट सम्पर्क गर्नुहोस्।", "Please try again or contact us by phone.")
      );
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.style.display = "";
      if (btnLoading) btnLoading.style.display = "none";
    }
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
        "opacity .8s ease, transform .8s cubic-bezier(.2,8,2,1)";
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
   LOADER
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
    const eng = window.isEnglish === true;
    if (open) btn.textContent = eng ? "Show less" : "कम देखाउनुहोस्";
    else btn.textContent = eng ? btn.dataset.en : btn.dataset.np;
  };

  setBtnText(false);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpening = !card.classList.contains("is-open");

    document.querySelectorAll(".service-card.is-open").forEach((c) => {
      c.classList.remove("is-open");
      const b = c.querySelector(".service-toggle");
      if (b) {
        b.setAttribute("aria-expanded", "false");
        const eng = window.isEnglish === true;
        b.textContent = eng ? b.dataset.en : b.dataset.np;
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

  document.addEventListener("click", (e) => {
    if (!card.classList.contains("is-open")) return;
    if (card.contains(e.target)) return;

    card.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    setBtnText(false);
  });
});