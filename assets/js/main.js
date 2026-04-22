/* ==========================================================================
   main.js - Extracted inline scripts from HTML pages
   ========================================================================== */

(function () {
  "use strict";

  var masthead = document.getElementById("masthead");
  if (!masthead) return;

  function updateHeaderOnScroll() {
    if (window.scrollY > 20) {
      masthead.classList.add("is-scrolled");
    } else {
      masthead.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll);
  updateHeaderOnScroll();

  // Desktop mega menu: click to open, click outside to close.
  var megaTriggers = document.querySelectorAll("[data-mega-trigger]");
  var megaPanels = document.querySelectorAll("[data-mega-panel]");
  var navEl = document.getElementById("site-navigation");

  function closeDesktopMegaMenus() {
    megaPanels.forEach(function (panel) {
      panel.classList.add("hidden");
    });
    megaTriggers.forEach(function (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      var down = trigger.querySelector(".mega-parent-caret-down");
      var up = trigger.querySelector(".mega-parent-caret-up");
      if (down) down.classList.remove("hidden");
      if (up) up.classList.add("hidden");
    });
  }

  function toggleDesktopMegaMenu(slug) {
    var targetPanel = document.querySelector(
      '[data-mega-panel="' + slug + '"]',
    );
    var targetTrigger = document.querySelector(
      '[data-mega-trigger="' + slug + '"]',
    );
    if (!targetPanel || !targetTrigger) return;

    var willOpen = targetPanel.classList.contains("hidden");
    closeDesktopMegaMenus();
    if (willOpen) {
      targetPanel.classList.remove("hidden");
      targetTrigger.setAttribute("aria-expanded", "true");
      var down = targetTrigger.querySelector(".mega-parent-caret-down");
      var up = targetTrigger.querySelector(".mega-parent-caret-up");
      if (down) down.classList.add("hidden");
      if (up) up.classList.remove("hidden");
    }
  }

  megaTriggers.forEach(function (trigger) {
    // Open on hover/focus for desktop, but keep the parent link clickable.
    trigger.addEventListener("mouseenter", function () {
      if (window.innerWidth < 1024) return;
      toggleDesktopMegaMenu(trigger.getAttribute("data-mega-trigger"));
    });

    trigger.addEventListener("focus", function () {
      if (window.innerWidth < 1024) return;
      toggleDesktopMegaMenu(trigger.getAttribute("data-mega-trigger"));
    });
  });

  if (navEl) {
    // Close when leaving the entire header nav region.
    navEl.addEventListener("mouseleave", function () {
      if (window.innerWidth < 1024) return;
      closeDesktopMegaMenus();
    });
  }

  document.addEventListener("click", function (event) {
    var nav = document.getElementById("site-navigation");
    if (!nav || nav.contains(event.target)) return;
    closeDesktopMegaMenus();
  });

  // Mobile drawer + submenus.
  var toggle = document.getElementById("mobile-menu-toggle");
  var closeBtn = document.getElementById("mobile-menu-close");
  var menu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("hamburger-icon");
  var iconClose = document.getElementById("close-icon");
  var stage = menu ? menu.querySelector(".mobile-menu-stage") : null;
  var rootList = menu ? menu.querySelector(".mobile-menu-list") : null;
  var subToggles = menu ? menu.querySelectorAll(".mobile-submenu-toggle") : [];
  var submenuPanels = menu
    ? menu.querySelectorAll("[data-mobile-submenu-panel]")
    : [];
  var submenuBackButtons = menu
    ? menu.querySelectorAll("[data-mobile-submenu-back]")
    : [];
  var mobileLinks = menu ? menu.querySelectorAll("a") : [];
  var activeMobilePanel = null;

  if (!toggle || !menu || !iconOpen || !iconClose) return;

  function resetMobilePanels() {
    subToggles.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      var down = btn.querySelector(".mobile-parent-caret-down");
      var up = btn.querySelector(".mobile-parent-caret-up");
      if (down) down.classList.remove("hidden");
      if (up) up.classList.add("hidden");
    });

    submenuPanels.forEach(function (panel) {
      if (panel._hideTimer) {
        window.clearTimeout(panel._hideTimer);
        panel._hideTimer = null;
      }
      panel.classList.add("hidden", "translate-x-full");
      panel.classList.remove("translate-x-0");
      panel.setAttribute("inert", "");
    });

    if (rootList) {
      rootList.classList.remove("-translate-x-full");
      rootList.classList.add("translate-x-0");
    }

    activeMobilePanel = null;
  }

  function openMobilePanel(panel) {
    if (!panel || !rootList) return;

    if (activeMobilePanel && activeMobilePanel !== panel) {
      resetMobilePanels();
    }

    if (panel._hideTimer) {
      window.clearTimeout(panel._hideTimer);
      panel._hideTimer = null;
    }

    panel.classList.remove("hidden");
    panel.removeAttribute("inert");
    rootList.classList.add("-translate-x-full");
    rootList.classList.remove("translate-x-0");

    window.requestAnimationFrame(function () {
      panel.classList.remove("translate-x-full");
      panel.classList.add("translate-x-0");
    });

    activeMobilePanel = panel;
  }

  function closeMobilePanel(panel) {
    if (!panel || !rootList) return;

    if (panel._hideTimer) {
      window.clearTimeout(panel._hideTimer);
      panel._hideTimer = null;
    }

    panel.classList.add("translate-x-full");
    panel.classList.remove("translate-x-0");
    panel.setAttribute("inert", "");
    rootList.classList.remove("-translate-x-full");
    rootList.classList.add("translate-x-0");

    panel._hideTimer = window.setTimeout(function () {
      panel.classList.add("hidden");
      panel._hideTimer = null;
    }, 300);

    if (activeMobilePanel === panel) {
      activeMobilePanel = null;
    }
  }

  function setMenuState(open) {
    menu.classList.toggle("opacity-0", !open);
    menu.classList.toggle("translate-x-full", !open);
    menu.classList.toggle("pointer-events-none", !open);
    menu.classList.toggle("opacity-100", open);
    menu.classList.toggle("translate-x-0", open);
    menu.classList.toggle("pointer-events-auto", open);
    toggle.classList.toggle("opacity-0", open);
    toggle.classList.toggle("pointer-events-none", open);

    iconOpen.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);

    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.removeAttribute("inert");
    } else {
      menu.setAttribute("inert", "");
    }

    document.body.style.overflow = open ? "hidden" : "";
    if (!open) resetMobilePanels();
    if (open && stage && rootList) {
      stage.scrollTop = 0;
      rootList.scrollTop = 0;
    }
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      setMenuState(false);
    });
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuState(false);
    });
  });

  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      var down = btn.querySelector(".mobile-parent-caret-down");
      var up = btn.querySelector(".mobile-parent-caret-up");
      if (!panel) return;

      if (activeMobilePanel === panel) {
        closeMobilePanel(panel);
        btn.setAttribute("aria-expanded", "false");
        if (down) down.classList.remove("hidden");
        if (up) up.classList.add("hidden");
        return;
      }

      submenuPanels.forEach(function (otherPanel) {
        if (otherPanel !== panel) {
          otherPanel.classList.add("hidden", "translate-x-full");
          otherPanel.classList.remove("translate-x-0");
          otherPanel.setAttribute("inert", "");
        }
      });

      subToggles.forEach(function (otherBtn) {
        var otherDown = otherBtn.querySelector(".mobile-parent-caret-down");
        var otherUp = otherBtn.querySelector(".mobile-parent-caret-up");
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          if (otherDown) otherDown.classList.remove("hidden");
          if (otherUp) otherUp.classList.add("hidden");
        }
      });

      btn.setAttribute("aria-expanded", "true");
      if (down) down.classList.add("hidden");
      if (up) up.classList.remove("hidden");
      openMobilePanel(panel);
    });
  });

  submenuBackButtons.forEach(function (backButton) {
    backButton.addEventListener("click", function () {
      var panel = backButton.closest("[data-mobile-submenu-panel]");
      if (!panel) return;

      var panelId = panel.getAttribute("id");
      var trigger = panelId
        ? document.querySelector('[aria-controls="' + panelId + '"]')
        : null;
      closeMobilePanel(panel);
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        var down = trigger.querySelector(".mobile-parent-caret-down");
        var up = trigger.querySelector(".mobile-parent-caret-up");
        if (down) down.classList.remove("hidden");
        if (up) up.classList.add("hidden");
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDesktopMegaMenus();
      setMenuState(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth < 1024) closeDesktopMegaMenus();
    if (window.innerWidth >= 1024) setMenuState(false);
  });

  setMenuState(false);
})();

document.addEventListener("DOMContentLoaded", () => {
  const syncHeroNotchToDesktopMenu = () => {
    const heroCard = document.querySelector(
      ".reacon-home-hero-card, .reacon-about-hero-card, .reacon-blog-hero-card, .reacon-legal-hero-card",
    );
    const navPill = document.querySelector("#site-navigation > ul");
    if (!heroCard || !navPill) return;

    if (window.innerWidth < 1024) {
      heroCard.style.removeProperty("--hero-notch-width");
      heroCard.style.removeProperty("--hero-notch-shift");
      return;
    }

    const heroRect = heroCard.getBoundingClientRect();
    const navRect = navPill.getBoundingClientRect();
    const navWidth = Math.round(navPill.getBoundingClientRect().width);
    if (!navWidth) return;
    const heroCenterX = heroRect.left + heroRect.width / 2;
    const navCenterX = navRect.left + navRect.width / 2;
    const notchShift = Math.round(navCenterX - heroCenterX);

    heroCard.style.setProperty("--hero-notch-width", `${navWidth + 18}px`);
    heroCard.style.setProperty("--hero-notch-shift", `${notchShift}px`);
  };

  const initDesktopSolutionStack = () => {
    if (
      typeof window.gsap === "undefined" ||
      typeof window.ScrollTrigger === "undefined"
    ) {
      return;
    }

    const stackRoot = document.querySelector(
      '#solution-visual-content[data-stack-enabled="true"]',
    );
    if (!stackRoot) {
      return;
    }

    const stackCards = gsap.utils.toArray(
      "#solution-visual-content [data-stack-card]",
    );
    if (!stackCards.length) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": function () {
        stackCards.forEach((card, index) => {
          gsap.set(card, {
            clearProps: "transform,opacity,visibility",
          });

          if (index > 0) {
            gsap.fromTo(
              card,
              {
                y: 90,
                scale: 0.97,
              },
              {
                y: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 86%",
                  end: "top 38%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );

            const previousCard = stackCards[index - 1];
            if (previousCard) {
              gsap.to(previousCard, {
                scale: 0.965,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 86%",
                  end: "top 38%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              });
            }
          }
        });
      },
      "(max-width: 1023px)": function () {
        stackCards.forEach((card) => {
          gsap.set(card, {
            clearProps: "transform,opacity,visibility",
          });
        });
      },
    });
  };

  const initLegalTermsSidebar = () => {
    const legalTabs = document.querySelectorAll(
      "#legal-terms-sidebar .reacon-legal-tab",
    );
    if (!legalTabs.length) {
      return;
    }

    const activateLegalTab = (activeTab) => {
      if (!activeTab) {
        return;
      }

      legalTabs.forEach((tab) => {
        tab.classList.remove(
          "is-active",
          "bg-white",
          "text-primary",
          "shadow-sm",
        );
      });

      activeTab.classList.add(
        "is-active",
        "bg-white",
        "text-primary",
        "shadow-sm",
      );
    };

    const activateFromHash = () => {
      const currentHash = window.location.hash;
      if (!currentHash) {
        activateLegalTab(legalTabs[0]);
        return;
      }

      const targetTab = document.querySelector(
        '#legal-terms-sidebar .reacon-legal-tab[href="' + currentHash + '"]',
      );
      if (targetTab) {
        activateLegalTab(targetTab);
      }
    };

    legalTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateLegalTab(tab);
      });
    });

    window.addEventListener("hashchange", activateFromHash);
    activateFromHash();
  };

  const initFooterLanguageDropdown = () => {
    const languageButtons = document.querySelectorAll(
      '#reacon-site-footer button[aria-label="Select language"]',
    );
    if (!languageButtons.length) {
      return;
    }

    languageButtons.forEach((button, index) => {
      if (button.dataset.languageDropdownReady === "true") {
        return;
      }
      button.dataset.languageDropdownReady = "true";

      const parent = button.parentElement;
      if (!parent) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "relative inline-block";
      parent.insertBefore(wrapper, button);
      wrapper.appendChild(button);

      const labelEl = button.querySelector("span");
      const menuId = "footer-language-menu-" + index;
      const activeLanguage = labelEl ? labelEl.textContent.trim() : "English";
      const optionsFromData = button.getAttribute("data-language-options");
      let languageOptions = [];

      if (optionsFromData) {
        try {
          const parsedOptions = JSON.parse(optionsFromData);
          if (Array.isArray(parsedOptions)) {
            languageOptions = parsedOptions
              .map((option) => {
                if (typeof option === "string") {
                  return { label: option, href: "" };
                }
                if (option && typeof option === "object" && option.label) {
                  return {
                    label: String(option.label),
                    href: option.href ? String(option.href) : "",
                  };
                }
                return null;
              })
              .filter(Boolean);
          }
        } catch (error) {
          languageOptions = [];
        }
      }

      if (!languageOptions.length) {
        languageOptions = [{ label: activeLanguage || "English", href: "" }];
      }

      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", menuId);

      const menu = document.createElement("ul");
      menu.id = menuId;
      menu.setAttribute("role", "listbox");
      menu.hidden = true;
      menu.style.position = "absolute";
      menu.style.right = "0";
      menu.style.top = "calc(100% + 8px)";
      menu.style.zIndex = "40";
      menu.style.minWidth = "170px";
      menu.style.padding = "6px";
      menu.style.margin = "0";
      menu.style.listStyle = "none";
      menu.style.borderRadius = "12px";
      menu.style.border = "1px solid rgba(255,255,255,0.2)";
      menu.style.boxShadow = "0 16px 40px rgba(0,0,0,0.45)";
      menu.style.backgroundColor = "#0f1320";

      languageOptions.forEach((language) => {
        const option = document.createElement("li");
        option.setAttribute("role", "option");
        option.setAttribute(
          "aria-selected",
          language.label === activeLanguage ? "true" : "false",
        );

        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.style.display = "block";
        optionButton.style.width = "100%";
        optionButton.style.border = "0";
        optionButton.style.borderRadius = "8px";
        optionButton.style.padding = "8px 12px";
        optionButton.style.textAlign = "left";
        optionButton.style.fontFamily = "inherit";
        optionButton.style.fontSize = "13px";
        optionButton.style.lineHeight = "1.2";
        optionButton.style.color = "rgba(255,255,255,0.9)";
        optionButton.style.background = "transparent";
        optionButton.style.cursor = "pointer";
        optionButton.style.transition = "background-color 150ms ease";
        optionButton.addEventListener("mouseenter", () => {
          optionButton.style.backgroundColor = "rgba(255,255,255,0.1)";
        });
        optionButton.addEventListener("mouseleave", () => {
          optionButton.style.backgroundColor = "transparent";
        });
        optionButton.textContent = language.label;
        optionButton.addEventListener("click", () => {
          if (labelEl) {
            labelEl.textContent = language.label;
          }

          menu.querySelectorAll('[role="option"]').forEach((item) => {
            item.setAttribute("aria-selected", "false");
          });
          option.setAttribute("aria-selected", "true");
          closeMenu();

          if (language.href && language.href !== "#") {
            window.location.href = language.href;
          }
        });

        option.appendChild(optionButton);
        menu.appendChild(option);
      });

      wrapper.appendChild(menu);

      const closeMenu = () => {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
      };

      const openMenu = () => {
        menu.hidden = false;
        button.setAttribute("aria-expanded", "true");
      };

      button.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = button.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });
    });
  };

  syncHeroNotchToDesktopMenu();
  initDesktopSolutionStack();
  initLegalTermsSidebar();
  initFooterLanguageDropdown();

  // Initialize Industries Swiper and wire up the left-hand nav buttons
  function initIndustriesSwiper() {
    // Require Swiper to be available (exported script is included on the page)
    if (typeof window.Swiper === "undefined") return;

    var rootEl = document.querySelector(".js-industries-work-swiper");
    if (!rootEl) return;

    // Avoid double-init if script runs multiple times
    if (rootEl._swiperInstance) return;

    var swiper = new Swiper(rootEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: false,
      observer: true,
      observeParents: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 32,
        },
      },
    });
    // Save instance for potential later checks
    rootEl._swiperInstance = swiper;

    // Wire nav buttons (buttons with data-industries-slide)
    var navButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-industries-slide]"),
    );
    if (navButtons.length) {
      navButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-industries-slide"), 10);
          if (!isNaN(idx) && swiper && typeof swiper.slideTo === "function") {
            // slideTo accepts (index, speed, runCallbacks)
            swiper.slideTo(idx, 400, true);
          }
        });
      });

      // Update active state on init and on slide change
      function updateActiveNav() {
        var active = swiper.activeIndex;
        navButtons.forEach(function (btn) {
          var idx = parseInt(btn.getAttribute("data-industries-slide"), 10);
          if (idx === active) {
            btn.classList.add("bg-primary", "text-white");
            btn.classList.remove("bg-transparent", "text-muted-foreground");
          } else {
            btn.classList.remove("bg-primary", "text-white");
            // ensure default classes present
            btn.classList.add("bg-transparent", "text-muted-foreground");
          }
        });
      }

      swiper.on("init", updateActiveNav);
      swiper.on("slideChange", updateActiveNav);
      // If already initialized by Swiper constructor, call update now
      if (swiper.initialized) updateActiveNav();
    }
  }

  // Run the industries swiper init (safe if Swiper is missing)
  initIndustriesSwiper();

  // Initialize Explore More Blogs Swiper with numbered pagination + nav
  function initExploreMoreBlogsSwiper() {
    if (typeof window.Swiper === "undefined") return;

    var rootEl = document.querySelector(".js-explore-more-swiper");
    if (!rootEl) return;
    if (rootEl._swiperInstance) return;

    var sectionEl = rootEl.closest("#explore-more-blogs") || document;
    var paginationEl = sectionEl.querySelector(".js-explore-more-pagination");
    var prevEl = sectionEl.querySelector(".js-explore-more-prev");
    var nextEl = sectionEl.querySelector(".js-explore-more-next");

    var swiper = new Swiper(rootEl, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
            renderBullet: function (index, className) {
              return (
                '<button type="button" class="' +
                className +
                '" aria-label="Go to blog slide ' +
                (index + 1) +
                '">' +
                (index + 1) +
                "</button>"
              );
            },
          }
        : undefined,
      navigation:
        prevEl && nextEl
          ? {
              prevEl: prevEl,
              nextEl: nextEl,
            }
          : undefined,
    });

    rootEl._swiperInstance = swiper;
  }

  initExploreMoreBlogsSwiper();

  // Keep hero notch sync on resize
  window.addEventListener("resize", syncHeroNotchToDesktopMenu);
});

// From inline script: cf7apps-redirection-js-extra
var cf7appsRedirection = {
  ajaxurl: "http://reacongroup.test/wp-admin/admin-ajax.php",
};

// From inline script: wp-i18n-js-after
wp.i18n.setLocaleData({ "text direction\u0004ltr": ["ltr"] });

// From inline script: contact-form-7-js-before
var wpcf7 = {
  api: {
    root: "http:\/\/reacongroup.test\/wp-json\/",
    namespace: "contact-form-7\/v1",
  },
};

/*! This file is auto-generated */
const a = JSON.parse(document.getElementById("wp-emoji-settings").textContent),
  o = ((window._wpemojiSettings = a), "wpEmojiSettingsSupports"),
  s = ["flag", "emoji"];
function i(e) {
  try {
    var t = { supportTests: e, timestamp: new Date().valueOf() };
    sessionStorage.setItem(o, JSON.stringify(t));
  } catch (e) {}
}
function c(e, t, n) {
  (e.clearRect(0, 0, e.canvas.width, e.canvas.height), e.fillText(t, 0, 0));
  t = new Uint32Array(
    e.getImageData(0, 0, e.canvas.width, e.canvas.height).data,
  );
  (e.clearRect(0, 0, e.canvas.width, e.canvas.height), e.fillText(n, 0, 0));
  const a = new Uint32Array(
    e.getImageData(0, 0, e.canvas.width, e.canvas.height).data,
  );
  return t.every((e, t) => e === a[t]);
}
function p(e, t) {
  (e.clearRect(0, 0, e.canvas.width, e.canvas.height), e.fillText(t, 0, 0));
  var n = e.getImageData(16, 16, 1, 1);
  for (let e = 0; e < n.data.length; e++) if (0 !== n.data[e]) return !1;
  return !0;
}
function u(e, t, n, a) {
  switch (t) {
    case "flag":
      return n(
        e,
        "\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f",
        "\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f",
      )
        ? !1
        : !n(e, "\ud83c\udde8\ud83c\uddf6", "\ud83c\udde8\u200b\ud83c\uddf6") &&
            !n(
              e,
              "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f",
              "\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f",
            );
    case "emoji":
      return !a(e, "\ud83e\u1fac8");
  }
  return !1;
}
function f(e, t, n, a) {
  let r;
  const o = (r =
      "undefined" != typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope
        ? new OffscreenCanvas(300, 150)
        : document.createElement("canvas")).getContext("2d", {
      willReadFrequently: !0,
    }),
    s = ((o.textBaseline = "top"), (o.font = "600 32px Arial"), {});
  return (
    e.forEach((e) => {
      s[e] = t(o, e, n, a);
    }),
    s
  );
}
function r(e) {
  var t = document.createElement("script");
  ((t.src = e), (t.defer = !0), document.head.appendChild(t));
}
((a.supports = { everything: !0, everythingExceptFlag: !0 }),
  new Promise((t) => {
    let n = (function () {
      try {
        var e = JSON.parse(sessionStorage.getItem(o));
        if (
          "object" == typeof e &&
          "number" == typeof e.timestamp &&
          new Date().valueOf() < e.timestamp + 604800 &&
          "object" == typeof e.supportTests
        )
          return e.supportTests;
      } catch (e) {}
      return null;
    })();
    if (!n) {
      if (
        "undefined" != typeof Worker &&
        "undefined" != typeof OffscreenCanvas &&
        "undefined" != typeof URL &&
        URL.createObjectURL &&
        "undefined" != typeof Blob
      )
        try {
          var e =
              "postMessage(" +
              f.toString() +
              "(" +
              [
                JSON.stringify(s),
                u.toString(),
                c.toString(),
                p.toString(),
              ].join(",") +
              "));",
            a = new Blob([e], { type: "text/javascript" });
          const r = new Worker(URL.createObjectURL(a), {
            name: "wpTestEmojiSupports",
          });
          return void (r.onmessage = (e) => {
            (i((n = e.data)), r.terminate(), t(n));
          });
        } catch (e) {}
      i((n = f(s, u, c, p)));
    }
    t(n);
  }).then((e) => {
    for (const n in e)
      ((a.supports[n] = e[n]),
        (a.supports.everything = a.supports.everything && a.supports[n]),
        "flag" !== n &&
          (a.supports.everythingExceptFlag =
            a.supports.everythingExceptFlag && a.supports[n]));
    var t;
    ((a.supports.everythingExceptFlag =
      a.supports.everythingExceptFlag && !a.supports.flag),
      a.supports.everything ||
        ((t = a.source || {}).concatemoji
          ? r(t.concatemoji)
          : t.wpemoji && t.twemoji && (r(t.twemoji), r(t.wpemoji))));
  }));
