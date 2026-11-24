const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    });
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".primary-nav > a:not(.nav-cta)").forEach((link) => {
  const targetPage = link.getAttribute("href").split("/").pop();
  if (targetPage === currentPage) {
    link.classList.add("is-current");
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".portfolio-grid .project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.hidden = selectedFilter !== "all" && !categories.includes(selectedFilter);
    });
  });
});

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const fields = [
    { input: contactForm.elements.name, error: document.querySelector("#name-error"), message: "Please enter your name (at least 2 characters).", validate: (input) => input.value.trim().length >= 2 },
    { input: contactForm.elements.email, error: document.querySelector("#email-error"), message: "Please enter a valid email address.", validate: (input) => input.value.trim().length > 0 && input.checkValidity() },
    { input: contactForm.elements.subject, error: document.querySelector("#subject-error"), message: "Please enter a subject (at least 3 characters).", validate: (input) => input.value.trim().length >= 3 },
    { input: contactForm.elements.message, error: document.querySelector("#message-error"), message: "Please enter a message (at least 10 characters).", validate: (input) => input.value.trim().length >= 10 }
  ];
  const formStatus = document.querySelector("#form-status");

  fields.forEach(({ input, error }) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
      formStatus.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalidField = null;
    fields.forEach(({ input, error, message, validate }) => {
      const isValid = validate(input);
      input.setAttribute("aria-invalid", String(!isValid));
      error.textContent = isValid ? "" : message;
      if (!isValid && !firstInvalidField) firstInvalidField = input;
    });

    if (firstInvalidField) {
      formStatus.textContent = "Please check the highlighted fields.";
      firstInvalidField.focus();
      return;
    }

    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const subject = contactForm.elements.subject.value.trim();
    const message = contactForm.elements.message.value.trim();
    const mailto = `mailto:gideonadeojo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    formStatus.textContent = "Your email app is opening with your message.";
    window.location.href = mailto;
  });
}
