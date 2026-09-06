"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuButton && mobileMenu) {
    const setMenu = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      mobileMenu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
    };

    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
  }

  /* Smooth navigation for all desktop and mobile menu links */
  const navigationLinks = Array.from(
    document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]')
  );

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });

      window.history.pushState(null, "", targetId);
    });
  });

  /* Highlight the current navigation section */
  const navigableSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!current) return;

        navigationLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${current.target.id}`;

          link.classList.toggle("is-current", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-20% 0px -67% 0px",
        threshold: [0.01, 0.2, 0.45],
      }
    );

    navigableSections.forEach((section) => navigationObserver.observe(section));
  }

  /* Countdown */
  const countdownTarget = new Date("2026-09-24T00:00:00+05:30").getTime();

  const countNodes = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  const updateCountdown = () => {
    let remaining = Math.max(0, countdownTarget - Date.now());

    const days = Math.floor(remaining / 86400000);
    remaining -= days * 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining -= hours * 3600000;

    const minutes = Math.floor(remaining / 60000);
    remaining -= minutes * 60000;

    const seconds = Math.floor(remaining / 1000);

    countNodes.days.textContent = String(days).padStart(3, "0");
    countNodes.hours.textContent = String(hours).padStart(2, "0");
    countNodes.minutes.textContent = String(minutes).padStart(2, "0");
    countNodes.seconds.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* Themes accordion */
  document.querySelectorAll(".theme-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".theme-item");
      const opening = !item.classList.contains("is-open");

      document.querySelectorAll(".theme-item").forEach((theme) => {
        theme.classList.remove("is-open");
        theme.querySelector(".theme-trigger").setAttribute("aria-expanded", "false");
      });

      if (opening) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* FAQ accordion */
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const opening = !item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("is-open");
        faq.querySelector("button").setAttribute("aria-expanded", "false");
      });

      if (opening) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Copy payment information */
  const toast = document.querySelector(".toast");

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1900);
  };

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy || "";

      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();

        showToast("Copied to clipboard");
      }
    });
  });

  /* Scroll reveal animation */
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -28px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
});
