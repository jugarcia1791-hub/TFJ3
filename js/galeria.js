document.addEventListener('DOMContentLoaded', function() {
    const imagenes = [
        { src: 'https://picsum.photos/400/300?random=1', titulo: 'Proyecto Web 1', categoria: 'web' },
        { src: 'https://picsum.photos/400/300?random=2', titulo: 'App Móvil 1', categoria: 'app' },
        { src: 'https://picsum.photos/400/300?random=3', titulo: 'Diseño UI 1', categoria: 'diseno' },
        { src: 'https://picsum.photos/400/300?random=4', titulo: 'Proyecto Web 2', categoria: 'web' },
        { src: 'https://picsum.photos/400/300?random=5', titulo: 'App Móvil 2', categoria: 'app' },
        { src: 'https://picsum.photos/400/300?random=6', titulo: 'Diseño UI 2', categoria: 'diseno' },
        { src: 'https://picsum.photos/400/300?random=7', titulo: 'Proyecto Web 3', categoria: 'web' },
        { src: 'https://picsum.photos/400/300?random=8', titulo: 'App Móvil 3', categoria: 'app' },
        { src: 'https://picsum.photos/400/300?random=9', titulo: 'Diseño UI 3', categoria: 'diseno' }
    ];

    const galeria = document.getElementById('galeria');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');
    const filtros = document.querySelectorAll('.filtro-btn');

    function cargarImagenes(categoria = 'todos') {
        galeria.innerHTML = '';
        
        const imagenesFiltradas = categoria === 'todos' 
            ? imagenes 
            : imagenes.filter(img => img.categoria === categoria);

        imagenesFiltradas.forEach(img => {
            const item = document.createElement('div');
            item.className = 'galeria-item';
            item.innerHTML = `
                <img src="${img.src}" alt="${img.titulo}" loading="lazy">
                <div class="overlay">
                    <h3>${img.titulo}</h3>
                </div>
            `;
            
            item.addEventListener('click', function() {
                modal.style.display = 'block';
                modalImg.src = img.src;
                modalImg.alt = img.titulo;
            });
            
            galeria.appendChild(item);
        });
    }

    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            filtros.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            cargarImagenes(this.dataset.categoria);
        });
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    cargarImagenes();
});