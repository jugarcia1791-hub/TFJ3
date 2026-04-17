// Función para obtener la ruta base del sitio
function getBasePath() {
    const path = window.location.pathname;
    // Si estamos en la raíz (index.html), la base es ./
    if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
        return './';
    }
    // Si estamos en views/, la base es ../
    return '../';
}

// Función para obtener la página actual
function getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
        return 'inicio';
    }
    if (path.includes('galeria.html')) return 'galeria';
    if (path.includes('presupuesto.html')) return 'presupuesto';
    if (path.includes('contacto.html')) return 'contacto';
    return 'inicio';
}

// Configuración de la navegación
const navConfig = [
    { id: 'inicio', nombre: 'Inicio', icono: '🏠', ruta: 'index.html', enViews: false },
    { id: 'galeria', nombre: 'Galería', icono: '🖼️', ruta: 'galeria.html', enViews: true },
    { id: 'presupuesto', nombre: 'Presupuesto', icono: '💰', ruta: 'presupuesto.html', enViews: true },
    { id: 'contacto', nombre: 'Contacto', icono: '📞', ruta: 'contacto.html', enViews: true }
];

// Función para construir la URL correcta
function buildUrl(item) {
    const currentPage = getCurrentPage();
    const basePath = getBasePath();
    
    if (item.id === 'inicio') {
        return basePath === './' ? 'index.html' : '../index.html';
    }
    
    // Para páginas en views/
    if (currentPage === 'inicio') {
        return item.ruta;
    } else {
        return item.ruta.replace('views/', '');
    }
}

// Función para crear la barra de navegación
function crearNavbar() {
    const navElement = document.querySelector('nav');
    if (!navElement) return;
    
    const currentPage = getCurrentPage();
    const basePath = getBasePath();
    
    // Limpiar el nav
    navElement.innerHTML = '';
    
    
    
    // Crear contenedor de enlaces
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-container';
    
    // Crear los enlaces
    navConfig.forEach(item => {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        
        const link = document.createElement('a');
        
        // Construir la URL correcta según dónde estemos
        if (item.id === 'inicio') {
            link.href = basePath === './' ? 'index.html' : '../index.html';
        } else {
            if (currentPage === 'inicio') {
                link.href = item.ruta;
            } else {
                // Si estamos en views/, las rutas son relativas
                link.href = item.ruta.replace('views/', '');
            }
        }
        
        link.className = 'nav-link';
        
        // Marcar página activa
        if (currentPage === item.id) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Icono
        const iconSpan = document.createElement('span');
        iconSpan.className = 'nav-icon';
        iconSpan.textContent = item.icono;
        
        // Texto
        const textSpan = document.createElement('span');
        textSpan.textContent = item.nombre;
        
        link.appendChild(iconSpan);
        link.appendChild(textSpan);
        
        // Evento click con prevención para página actual
        link.addEventListener('click', function(e) {
            if (this.classList.contains('active')) {
                e.preventDefault();
                return;
            }
            
        });
        
        navItem.appendChild(link);
        navContainer.appendChild(navItem);
    });
    
    
    navElement.appendChild(navContainer);
    
   
    
    
}

// Actualizar el título de la página
function updatePageTitle() {
    const currentPage = getCurrentPage();
    const titles = {
        'inicio': 'Inicio - Mi Sitio Web',
        'galeria': 'Galería - Mi Sitio Web',
        'presupuesto': 'Presupuesto - Mi Sitio Web',
        'contacto': 'Contacto - Mi Sitio Web'
    };
    if (titles[currentPage]) {
        document.title = titles[currentPage];
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    crearNavbar();
    updatePageTitle();
});