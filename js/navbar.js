document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el nombre de la página actual
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        
        if (page === '' || page === 'index.html') {
            return 'inicio';
        }
        return page.replace('.html', '');
    }
    
    // Configuración de los enlaces de navegación
    const navConfig = [
        { id: 'inicio', href:"index.html", icon: '🏠', text: 'Inicio' },
        { id: 'galeria', href:"/views/galeria.html", icon: '🖼️', text: 'Galería' },
        { id: 'presupuesto', href:"/views/presupuesto.html", icon: '💰', text: 'Presupuesto' },
        { id: 'contacto', href:"/views/contacto.html", icon: '📞', text: 'Contacto' }
    ];
    
    // Función para crear la barra de navegación
    function crearNavbar() {
        const navElement = document.querySelector('nav');
        if (!navElement) return;
        
        const currentPage = getCurrentPage();
        
        // Crear contenedor
        const navContainer = document.createElement('div');
        navContainer.className = 'nav-container';
        
        // Crear elementos de navegación
        navConfig.forEach(item => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'nav-link';
            
            // Verificar si es la página actual
            if (currentPage === item.id) {
                link.classList.add('active');
                // Añadir atributo aria-current para accesibilidad
                link.setAttribute('aria-current', 'page');
            }
            
            // Icono
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon';
            iconSpan.textContent = item.icon;
            
            // Texto
            const textSpan = document.createElement('span');
            textSpan.className = 'nav-text';
            textSpan.textContent = item.text;
            
            // Añadir elementos al enlace
            link.appendChild(iconSpan);
            link.appendChild(textSpan);
            
            // Añadir indicador de página activa (opcional)
            if (currentPage === item.id) {
                const indicator = document.createElement('span');
                indicator.className = 'nav-indicator';
                link.appendChild(indicator);
            }
            
            // Evento de clic para tracking (opcional)
            link.addEventListener('click', function(e) {
                if (this.classList.contains('active')) {
                    e.preventDefault(); // Prevenir recarga si ya estás en la página
                    return;
                }
                console.log(`Navegando a: ${item.text}`);
                // Aquí puedes agregar tracking analítico
            });
            
            navItem.appendChild(link);
            navContainer.appendChild(navItem);
        });
        
        // Reemplazar el contenido del nav
        navElement.innerHTML = '';
        navElement.appendChild(navContainer);
    }
    
    // Función para actualizar la página activa (útil para SPA o navegación dinámica)
    function updateActivePage() {
        const currentPage = getCurrentPage();
        const allLinks = document.querySelectorAll('.nav-link');
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            const pageId = href ? href.replace('.html', '') : '';
            
            if (pageId === currentPage || 
                (currentPage === 'inicio' && pageId === 'index')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                
                // Añadir indicador si no existe
                if (!link.querySelector('.nav-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'nav-indicator';
                    link.appendChild(indicator);
                }
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                
                // Remover indicador
                const indicator = link.querySelector('.nav-indicator');
                if (indicator) {
                    indicator.remove();
                }
            }
        });
    }
    
    // Función para añadir efecto de scroll suave (opcional)
    function addSmoothScroll() {
        // Solo para enlaces internos (si existen en la misma página)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Función para mostrar notificación de página activa en consola (debug)
    function logCurrentPage() {
        const currentPage = getCurrentPage();
        console.log(`Página actual: ${currentPage}`);
        
        // Mostrar título de la página
        const pageTitles = {
            'inicio': 'Inicio - Mi Sitio Web',
            'galeria': 'Galería - Mi Sitio Web',
            'presupuesto': 'Presupuesto - Mi Sitio Web',
            'contacto': 'Contacto - Mi Sitio Web'
        };
        
        if (pageTitles[currentPage]) {
            document.title = pageTitles[currentPage];
        }
    }
    
    // Inicializar
    crearNavbar();
    addSmoothScroll();
    logCurrentPage();
    
    // Observador para cambios en la URL (útil para navegación con hash)
    window.addEventListener('hashchange', function() {
        updateActivePage();
    });
    
    // Exportar funciones para uso externo si es necesario
    window.Navbar = {
        updateActivePage: updateActivePage,
        getCurrentPage: getCurrentPage
    };
});
