/* Valarotech — site behaviour (no dependencies) */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // Mobile navigation
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) closeNav();
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // Animated counters: <strong data-count="50" data-suffix="+">
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // Services page: highlight the in-page nav item for the section in view
  var serviceLinks = document.querySelectorAll(".service-nav a");
  if (serviceLinks.length && "IntersectionObserver" in window) {
    var map = {};
    serviceLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          serviceLinks.forEach(function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
          map[entry.target.id].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".service-detail").forEach(function (s) { so.observe(s); });
  }

  // Contact form: pre-select service from ?service=... and validate
  var form = document.getElementById("contact-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("service");
    var select = form.querySelector("#service");
    if (preset && select) {
      Array.prototype.forEach.call(select.options, function (o) {
        if (o.value === preset) select.value = preset;
      });
    }

    var status = document.getElementById("form-status");

    function validateField(field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return true;
      var ok = input.checkValidity();
      field.classList.toggle("invalid", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }

    form.querySelectorAll(".field").forEach(function (field) {
      var input = field.querySelector("input, select, textarea");
      if (input) {
        input.addEventListener("blur", function () { validateField(field); });
        input.addEventListener("input", function () {
          if (field.classList.contains("invalid")) validateField(field);
        });
      }
    });

    form.addEventListener("submit", function (e) {
      var allOk = true;
      var firstBad = null;
      form.querySelectorAll(".field").forEach(function (field) {
        if (!validateField(field)) {
          allOk = false;
          if (!firstBad) firstBad = field.querySelector("input, select, textarea");
        }
      });

      if (!allOk) {
        e.preventDefault();
        status.className = "form-status error";
        status.textContent = "Please fix the highlighted fields and try again.";
        if (firstBad) firstBad.focus();
        return;
      }

      // Send via FormSubmit's AJAX endpoint so the visitor stays on the page.
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var ajaxUrl = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      button.disabled = true;
      status.className = "form-status";
      status.textContent = "";

      fetch(ajaxUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (res) {
          if (!res.ok || String(res.data.success) === "false") throw new Error(res.data.message);
          status.className = "form-status success";
          status.textContent = "Thanks! Your message has been sent. We'll reply within one business day.";
          form.reset();
        })
        .catch(function () {
          status.className = "form-status error";
          status.textContent = "Sorry, your message could not be sent. Please email us at karthikeyanp@valarotech.com.";
        })
        .then(function () { button.disabled = false; });
    });

    // Confirmation after a non-JavaScript submission redirects back here
    if (params.get("sent") === "1") {
      status.className = "form-status success";
      status.textContent = "Thanks! Your message has been sent. We'll reply within one business day.";
    }
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
