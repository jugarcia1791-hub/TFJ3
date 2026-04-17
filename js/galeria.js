document.addEventListener('DOMContentLoaded', function() {
    // Array de imágenes
    const imagenes = [
        { src: 'https://picsum.photos/id/1/800/600', titulo: 'Paisaje de montaña', categoria: 'web' },
        { src: 'https://picsum.photos/id/10/800/600', titulo: 'Naturaleza', categoria: 'app' },
        { src: 'https://picsum.photos/id/15/800/600', titulo: 'Camino rural', categoria: 'diseno' },
        { src: 'https://picsum.photos/id/20/800/600', titulo: 'Escritorio de trabajo', categoria: 'web' },
        { src: 'https://picsum.photos/id/26/800/600', titulo: 'Ciudad moderna', categoria: 'app' },
        { src: 'https://picsum.photos/id/30/800/600', titulo: 'Café y trabajo', categoria: 'diseno' },
        { src: 'https://picsum.photos/id/42/800/600', titulo: 'Piano', categoria: 'web' },
        { src: 'https://picsum.photos/id/55/800/600', titulo: 'Atardecer', categoria: 'app' },
        { src: 'https://picsum.photos/id/66/800/600', titulo: 'Montañas', categoria: 'diseno' }
    ];

    // Variables
    let indiceActual = 0;
    const carruselImagen = document.getElementById('carruselImagen');
    const indicadoresContainer = document.getElementById('indicadores');
    const galeriaMiniaturas = document.getElementById('galeriaMiniaturas');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    
    // Modal
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    const modalAnterior = document.getElementById('modalAnterior');
    const modalSiguiente = document.getElementById('modalSiguiente');

    // Función para actualizar el carrusel
    function actualizarCarrusel() {
        carruselImagen.src = imagenes[indiceActual].src;
        carruselImagen.alt = imagenes[indiceActual].titulo;
        
        // Actualizar indicadores
        const indicadores = document.querySelectorAll('.indicador');
        indicadores.forEach((ind, i) => {
            if (i === indiceActual) {
                ind.classList.add('activo');
            } else {
                ind.classList.remove('activo');
            }
        });
        
        // Actualizar miniatura activa
        const miniaturas = document.querySelectorAll('.miniatura-item');
        miniaturas.forEach((min, i) => {
            if (i === indiceActual) {
                min.classList.add('active');
            } else {
                min.classList.remove('active');
            }
        });
    }

    // Función para cambiar imagen (siguiente/anterior)
    function cambiarImagen(direccion) {
        if (direccion === 'siguiente') {
            indiceActual = (indiceActual + 1) % imagenes.length;
        } else if (direccion === 'anterior') {
            indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        }
        actualizarCarrusel();
    }

    // Crear indicadores
    function crearIndicadores() {
        imagenes.forEach((_, i) => {
            const indicador = document.createElement('div');
            indicador.classList.add('indicador');
            if (i === 0) indicador.classList.add('activo');
            indicador.addEventListener('click', () => {
                indiceActual = i;
                actualizarCarrusel();
            });
            indicadoresContainer.appendChild(indicador);
        });
    }

    // Crear miniaturas
    function crearMiniaturas() {
        imagenes.forEach((img, i) => {
            const miniatura = document.createElement('div');
            miniatura.classList.add('miniatura-item');
            if (i === 0) miniatura.classList.add('active');
            miniatura.innerHTML = `<img src="${img.src}" alt="${img.titulo}">`;
            miniatura.addEventListener('click', () => {
                indiceActual = i;
                actualizarCarrusel();
            });
            galeriaMiniaturas.appendChild(miniatura);
        });
    }

    // Abrir modal con imagen actual
    function abrirModal() {
        modal.style.display = 'block';
        modalImg.src = imagenes[indiceActual].src;
        modalCaption.textContent = imagenes[indiceActual].titulo;
    }

    // Cerrar modal
    function cerrarModal() {
        modal.style.display = 'none';
    }

    // Navegación en modal
    function modalCambiarImagen(direccion) {
        if (direccion === 'siguiente') {
            indiceActual = (indiceActual + 1) % imagenes.length;
        } else if (direccion === 'anterior') {
            indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        }
        modalImg.src = imagenes[indiceActual].src;
        modalCaption.textContent = imagenes[indiceActual].title || imagenes[indiceActual].titulo;
        actualizarCarrusel();
    }

    // Event listeners del carrusel
    btnAnterior.addEventListener('click', () => cambiarImagen('anterior'));
    btnSiguiente.addEventListener('click', () => cambiarImagen('siguiente'));

    // Event listeners del modal
    carruselImagen.addEventListener('click', abrirModal);
    closeBtn.addEventListener('click', cerrarModal);
    modalAnterior.addEventListener('click', () => modalCambiarImagen('anterior'));
    modalSiguiente.addEventListener('click', () => modalCambiarImagen('siguiente'));
    
    // Cerrar modal al hacer clic fuera de la imagen
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Teclado: flechas izquierda/derecha para navegar
    document.addEventListener('keydown', (event) => {
        if (modal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                modalCambiarImagen('anterior');
            } else if (event.key === 'ArrowRight') {
                modalCambiarImagen('siguiente');
            } else if (event.key === 'Escape') {
                cerrarModal();
            }
        } else {
            if (event.key === 'ArrowLeft') {
                cambiarImagen('anterior');
            } else if (event.key === 'ArrowRight') {
                cambiarImagen('siguiente');
            }
        }
    });

    // Inicializar galería
    crearIndicadores();
    crearMiniaturas();
    actualizarCarrusel();
});
