/* ==============================
   DOM READY
============================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ==============================
     SERVICE WORKER (PWA)
  =============================== */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW error", err));
    });
  }

  /* ==============================
     MENU MOBILE (BURGER)
  =============================== */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  /* ==============================
     SMOOTH SCROLL
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ==============================
     REVEAL ANIMATION
  =============================== */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealItems.forEach((el) => observer.observe(el));
  }

  /* ==============================
     PRODUITS DYNAMIQUES
  =============================== */
  const products = [
    {
      name: "FMX 2026 Pro",
      img: "images/fmx2026.jpeg",
      description: "Performance racing",
    },
    {
      name: "S2Maui Wave",
      img: "images/s2maui.jpeg",
      description: "Vagues & contrôle",
    },
    {
      name: "FMX Invictus",
      img: "images/fmx_invictus.jpeg",
      description: "Tricks & fun",
    },
  ];

  const productContainer = document.getElementById("product-cards");
  if (productContainer) {
    products.forEach((p) => {
      productContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="card reveal">
          <div class="card-inner">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <p>${p.name}</p>
<p>${p.description}</p>
<a href="contact.html?product=${encodeURIComponent(p.name)}"
   class="btn-secondary"
>
  Commander
</a>

          </div>
        </div>`,
      );
    });
  }

  /* ==============================
     GALERIE SWIPE + AUTO-SLIDE
  =============================== */
  const slider = document.getElementById("photo-slider");
  if (slider) {
    const galleryImages = [
      "images/gallery1.png",
      "images/gallery2.jfif",
      "images/gallery3.jpg",
      "images/gallery4.jpg",
      "images/gallery5.jpg",
    ];

    galleryImages.forEach((src) => {
      slider.insertAdjacentHTML(
        "beforeend",
        `<img src="${src}" alt="Galerie Windsurf" loading="lazy">`,
      );
    });

    let index = 0;
    let startX = 0;
    let isDragging = false;

    const updateSlider = () => {
      slider.style.transform = `translateX(-${index * 100}%)`;
    };

    // AUTO-SLIDE
    setInterval(() => {
      index = (index + 1) % slider.children.length;
      updateSlider();
    }, 3000);

    // TOUCH EVENTS
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    slider.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) index++;
      if (endX - startX > 50) index--;
      index = Math.max(0, Math.min(index, slider.children.length - 1));
      updateSlider();
    });

    // MOUSE DRAG
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
    });
    slider.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      const endX = e.clientX;
      if (startX - endX > 50) index++;
      if (endX - startX > 50) index--;
      index = Math.max(0, Math.min(index, slider.children.length - 1));
      updateSlider();
      isDragging = false;
    });
    slider.addEventListener("mouseleave", () => {
      isDragging = false;
    });
  }

  /* ==============================
     INSTALLATION PWA
  =============================== */
  let deferredPrompt;
  const installBtn = document.getElementById("installBtn");

  if (installBtn) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = "block";
    });

    installBtn.addEventListener("click", async () => {
      installBtn.style.display = "none";
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
    });
  }

  /* ==============================
     PAGE TRANSITION
  =============================== */
  document.body.classList.add("page-transition");

  document.querySelectorAll("a").forEach((link) => {
    if (
      link.origin === location.origin &&
      !link.href.includes("#") &&
      !link.hasAttribute("download")
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => (window.location = link.href), 400);
      });
    }
  });

  /* ==============================
     LOGOS PARTENAIRES 3D
  =============================== */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".logo-box").forEach((box) => {
      const img = box.querySelector("img");
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        img.style.transform = `rotateX(${(y / r.height - 0.5) * -10}deg)
                               rotateY(${(x / r.width - 0.5) * 10}deg)
                               scale(1.05)`;
      });
      box.addEventListener("mouseleave", () => {
        img.style.transform = "rotateX(0) rotateY(0) scale(1)";
      });
    });
  }
}); // End DOMContentLoaded

// PARTNERS SLIDER SWIPE (mobile)
const partnersSlider = document.querySelector(".partners-logos");
if (partnersSlider && window.innerWidth <= 720) {
  let isDown = false;
  let startX;
  let scrollLeft;

  partnersSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    partnersSlider.classList.add("active");
    startX = e.pageX - partnersSlider.offsetLeft;
    scrollLeft = partnersSlider.scrollLeft;
  });
  partnersSlider.addEventListener("mouseleave", () => {
    isDown = false;
    partnersSlider.classList.remove("active");
  });
  partnersSlider.addEventListener("mouseup", () => {
    isDown = false;
    partnersSlider.classList.remove("active");
  });
  partnersSlider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - partnersSlider.offsetLeft;
    const walk = (x - startX) * 2; // multiplier pour plus de vitesse
    partnersSlider.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  partnersSlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX - partnersSlider.offsetLeft;
    scrollLeft = partnersSlider.scrollLeft;
  });
  partnersSlider.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX - partnersSlider.offsetLeft;
    const walk = (x - startX) * 2;
    partnersSlider.scrollLeft = scrollLeft - walk;
  });
}

/* ==============================
   FORMULAIRE COMMANDE (EMAILJS PRO)
============================== */
// Affiche un message temporaire au-dessus de la page
function showMessage(text, type = "success") {
  // Crée le div
  const msgDiv = document.createElement("div");
  msgDiv.className = `contact-msg ${type}`;
  msgDiv.innerHTML = `<span class="checkmark"></span>${text}`;

  document.body.appendChild(msgDiv);

  // Force le reflow pour trigger l'animation
  void msgDiv.offsetWidth;
  msgDiv.classList.add("show");

  // Scroll si le message n'est pas visible
  const rect = msgDiv.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    window.scrollTo({
      top: window.scrollY + rect.top - 20,
      behavior: "smooth",
    });
  }

  // Retire après 4s
  setTimeout(() => {
    msgDiv.classList.remove("show");
    setTimeout(() => msgDiv.remove(), 600); // correspond à transition
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs !== "undefined") {
    emailjs.init("CuVOSChqWXcMFd4wV"); // <-- OBLIGATOIRE
  }

  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector("button[type='submit']");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoader = submitBtn.querySelector(".btn-loader");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // ANTI-SPAM (honeypot sécurisé)
    const honeypotField = document.getElementById("company");
    if (honeypotField && honeypotField.value !== "") {
      console.warn("Spam détecté");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const product =
      document.getElementById("order-product")?.value || "Non spécifié";
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // UI LOADER
    submitBtn.disabled = true;

    // NUMÉRO DE COMMANDE UNIQUE
    const orderId = `KB-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const params = {
      from_name: name,
      from_email: email,
      product: product,
      order_id: orderId,
      subject: "Nouvelle commande client",
      message: message,
    };

    // EMAIL ADMIN
    emailjs
      .send("service_i6ceuuc", "template_t90o55y", params)
      .then(() => {
        // EMAIL CLIENT
        return emailjs.send("service_i6ceuuc", "template_6vdfyg6", params);
      })
      .then(() => {
        showMessage(
          `Commande envoyée <br>Numéro : <strong>${orderId}</strong>`,
          "success",
        );
        contactForm.reset();
      })
      .catch((error) => {
        console.error("EmailJS error :", error);
        showMessage(
          "Erreur lors de l'envoi. Veuillez réessayer plus tard.",
          "error",
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
});

/* ==============================
   PRE-REMPLISSAGE PRODUIT COMMANDE
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("order-product");
  if (!productSelect) return;

  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");

  if (product) {
    productSelect.value = product;
  }
});

const slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 5000);
/* =========================
   PARALLAX GALERIE
========================= */
window.addEventListener("scroll", () => {
  const slider = document.querySelector(".photo-slider img");
  if (!slider) return;

  const rect = slider.getBoundingClientRect();
  const offset = rect.top * 0.15;

  slider.style.transform = `translateY(${offset}px)`;
});
/* =========================
   SLIDER AUTO – GALERIE PRO
========================= */
let currentIndex = 0;
const slider = document.querySelector(".photo-slider");
const slide = document.querySelectorAll(".photo-slider img");

if (slider && slides.length > 1) {
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, 5000);
}
/* ==============================
   SWITCH PRODUITS TABS
============================== */

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // retirer active
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    // activer le bon
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});
const boards = [
  { name: "FMX 85L Pro", desc: "Freerace High Performance" },
  { name: "FMX 95L Carbon", desc: "Speed & Control" },
];

const sails = [
  { name: "S2 Maui Venom 7.8", desc: "Race Sail Performance" },
  { name: "S2 Maui Wicked 5.3", desc: "Freestyle Precision" },
];

function createCard(product) {
  return `
    <div class="card">
      <div class="card-inner">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <a href="contact.html" class="btn-secondary">Commander</a>
      </div>
    </div>
  `;
}

document.getElementById("boards-cards").innerHTML = boards
  .map(createCard)
  .join("");

document.getElementById("sails-cards").innerHTML = sails
  .map(createCard)
  .join("");
