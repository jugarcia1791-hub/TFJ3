
fetch('data/noticias.json')
        .then(response => response.json())
        .then(data => {
            const noticiasContainer = document.getElementById('noticias-container');
            data.noticias.forEach(noticia => {
                const noticiaCard = document.createElement('div');
                noticiaCard.className = 'noticia-card';
                const fecha = new Date(noticia.fecha).toLocaleDateString('es-ES');
                noticiaCard.innerHTML = `<h3>${noticia.titulo}</h3><p class="fecha">${fecha}</p><p>${noticia.contenido}</p>`;
                noticiasContainer.appendChild(noticiaCard);
            });
        })
        .catch(error => {
            document.getElementById('noticias-container').innerHTML = '<p>Error al cargar noticias</p>';
        });

