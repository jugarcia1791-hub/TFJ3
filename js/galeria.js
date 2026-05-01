
        // Datos de los perfumes (imágenes de Unsplash - perfumes y fragancias)
        const perfumes = [
          {
            id: 1,
            nombre: "Aurora Bloom",
            descripcion: "Notas florales con toques de jazmín y vainilla",
            imagen: "../img/perfume1.jpg",
            precio: "€89",
          },
          {
            id: 2,
            nombre: "Midnight Oud",
            descripcion: "Aroma amaderado con esencias de oud y ámbar",
            imagen: "../img/perfume2.jpg",
            precio: "€120",
          },
          {
            id: 3,
            nombre: "Citrus Dream",
            descripcion: "Frescura cítrica con notas de bergamota y limón",
            imagen: "../img/perfume3.jpg",
            precio: "€75",
          },
          {
            id: 4,
            nombre: "Velvet Rose",
            descripcion: "Romántica rosa mezclada con pimienta rosa",
            imagen: "../img/perfume4.jpg",
            precio: "€95",
          },
          {
            id: 5,
            nombre: "Ocean Breeze",
            descripcion: "Brisa marina con toques de sal y algas",
            imagen: "../img/perfume5.jpg",
            precio: "€82",
          },
        ];

        // Variables del carrusel
        let currentIndex = 0;
        let autoSlideInterval;

        // Elementos del DOM
        const carousel = document.getElementById("carousel");
        const indicatorsContainer = document.getElementById("indicators");
        const thumbnailsContainer = document.getElementById("thumbnails");
        const modal = document.getElementById("modal");
        const modalImage = document.getElementById("modalImage");
        const modalInfo = document.getElementById("modalInfo");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const closeModal = document.querySelector(".close-modal");

        // Función para renderizar el carrusel dinámicamente
        function renderCarousel() {
          carousel.innerHTML = "";
          perfumes.forEach((perfume, index) => {
            const slide = document.createElement("div");
            slide.className = `carousel-slide ${index === currentIndex ? "active" : ""}`;
            slide.innerHTML = `
                    <img src="${perfume.imagen}" alt="${perfume.nombre}" data-id="${perfume.id}">
                    <div class="slide-info">
                        <h3>${perfume.nombre}</h3>
                        <p>${perfume.descripcion}</p>
                        <p style="color: #b8860b; font-weight: bold; margin-top: 5px;">${perfume.precio}</p>
                    </div>
                `;
            carousel.appendChild(slide);
          });
        }

        // Función para renderizar los indicadores
        function renderIndicators() {
          indicatorsContainer.innerHTML = "";
          perfumes.forEach((_, index) => {
            const indicator = document.createElement("div");
            indicator.className = `indicator ${index === currentIndex ? "active" : ""}`;
            indicator.addEventListener("click", () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
          });
        }

        // Función para renderizar la galería en miniatura
        function renderThumbnails() {
          thumbnailsContainer.innerHTML = "";
          perfumes.forEach((perfume) => {
            const thumbnail = document.createElement("div");
            thumbnail.className = "thumbnail";
            thumbnail.innerHTML = `
                    <img src="${perfume.imagen}" alt="${perfume.nombre}" data-id="${perfume.id}">
                    <div class="thumbnail-info">
                        <h4>${perfume.nombre}</h4>
                        <p>${perfume.precio}</p>
                    </div>
                `;
            thumbnail.addEventListener("click", () => openModal(perfume));
            thumbnailsContainer.appendChild(thumbnail);
          });
        }

        // Función para ir a un slide específico
        function goToSlide(index) {
          const slides = document.querySelectorAll(".carousel-slide");
          const indicators = document.querySelectorAll(".indicator");

          slides[currentIndex].classList.remove("active");
          indicators[currentIndex].classList.remove("active");

          currentIndex = (index + perfumes.length) % perfumes.length;

          slides[currentIndex].classList.add("active");
          indicators[currentIndex].classList.add("active");

          // Resetear el auto-slide
          resetAutoSlide();
        }

        // Función para siguiente slide
        function nextSlide() {
          goToSlide(currentIndex + 1);
        }

        // Función para slide anterior
        function prevSlide() {
          goToSlide(currentIndex - 1);
        }

        // Función para auto-slide
        function startAutoSlide() {
          autoSlideInterval = setInterval(() => {
            nextSlide();
          }, 5000);
        }

        function resetAutoSlide() {
          clearInterval(autoSlideInterval);
          startAutoSlide();
        }

        // Función para abrir el modal con la imagen ampliada
        function openModal(perfume) {
          modalImage.src = perfume.imagen;
          modalImage.alt = perfume.nombre;
          modalInfo.innerHTML = `
                <h3>${perfume.nombre}</h3>
                <p>${perfume.descripcion}</p>
                <p style="color: #ffd700; margin-top: 5px;">${perfume.precio}</p>
            `;
          modal.classList.add("active");
          document.body.style.overflow = "hidden";
        }

        // Función para cerrar el modal
        function closeModalFunc() {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        }

        // Evento para abrir modal desde el carrusel (delegación de eventos)
        function setupModalEvents() {
          // Para imágenes del carrusel
          carousel.addEventListener("click", (e) => {
            const img = e.target.closest("img");
            if (img && img.dataset.id) {
              const perfumeId = parseInt(img.dataset.id);
              const perfume = perfumes.find((p) => p.id === perfumeId);
              if (perfume) openModal(perfume);
            }
          });

          // Para imágenes de las miniaturas (ya tienen evento individual, pero por si acaso)
          thumbnailsContainer.addEventListener("click", (e) => {
            const img = e.target.closest("img");
            if (img && img.dataset.id) {
              const perfumeId = parseInt(img.dataset.id);
              const perfume = perfumes.find((p) => p.id === perfumeId);
              if (perfume) openModal(perfume);
            }
          });
        }

        // Inicializar la página
        function init() {
          renderCarousel();
          renderIndicators();
          renderThumbnails();
          setupModalEvents();
          startAutoSlide();

          // Eventos de los botones
          prevBtn.addEventListener("click", prevSlide);
          nextBtn.addEventListener("click", nextSlide);

          // Evento para cerrar modal
          closeModal.addEventListener("click", closeModalFunc);
          modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModalFunc();
          });

          // Pausar auto-slide al hacer hover en el carrusel
          carousel.addEventListener("mouseenter", () => {
            clearInterval(autoSlideInterval);
          });

          carousel.addEventListener("mouseleave", () => {
            startAutoSlide();
          });
        }

        // Ejecutar cuando el DOM esté listo
        document.addEventListener("DOMContentLoaded", init);
   