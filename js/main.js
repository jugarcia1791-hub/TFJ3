document.addEventListener('DOMContentLoaded', function() {
    // Datos de noticias (simulando un archivo JSON externo)
    const noticiasData = [
        {
            titulo: "Nuevos perfumes y fragancias desde marruecos",
            fecha: "2026-01-15",
            contenido: "Hemos mejorado nuestros servicios con las últimas fragancias del mercado."
        },
        {
            titulo: "Lanzamiento de nueva plataforma digital pra hacer tus pedidos",
            fecha: "2026-01-10",
            contenido: "Presentamos nuestra nueva plataforma digital con funcionalidades para hacer pedidos y domicilios."
        },
        {
            titulo: "Reconocimiento internacional",
            fecha: "2026-01-05",
            contenido: "Recibimos reconocimiento por varias franquicias a lo largo de europa."
        },
        {
            titulo: "Nueva innovacion en perfumeria",
            fecha: "2026-01-01",
            contenido: "Damos la bienvenida a nuevos metodos  que renuevan el mercado de la perfumeria."
        }
    ];

    const noticiasContainer = document.getElementById('noticias-container');
    
    noticiasData.forEach(noticia => {
        const noticiaCard = document.createElement('div');
        noticiaCard.className = 'noticia-card';
        
        const fecha = new Date(noticia.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        noticiaCard.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p class="fecha">${fecha}</p>
            <p>${noticia.contenido}</p>
        `;
        
        noticiasContainer.appendChild(noticiaCard);
    });

    
    
        
        
    
});
