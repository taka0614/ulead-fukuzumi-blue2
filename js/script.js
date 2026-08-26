document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  const setMenuState = (isOpen) => {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  const closeMenu = () => setMenuState(false);

  if (menuButton && mobileMenu) {
    setMenuState(false);

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      closeMenu();
      menuButton.focus();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        closeMenu();
      }
    });
  }

  const navLinks = [
    ...document.querySelectorAll(".sidebar-nav a[data-section]"),
  ];

  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const activeId = visible[0].target.id;

        navLinks.forEach((link) => {
          const isCurrent = link.dataset.section === activeId;
          link.classList.toggle("is-current", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.05, 0.2, 0.45],
      },
    );

    sections.forEach((section) => observer.observe(section));
  }

  const flowDetails = [...document.querySelectorAll(".flow-step details")];

  flowDetails.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;

      flowDetails.forEach((otherDetail) => {
        if (otherDetail !== detail) {
          otherDetail.open = false;
        }
      });
    });
  });

  const currentYear = document.querySelector("[data-current-year]");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
