document.addEventListener('DOMContentLoaded', function() {
    // Coordenadas de la empresa (ejemplo: Plaza Mayor, Madrid)
    const empresaCoords = [40.416775, -3.703790];
    
    // Inicializar mapa
    const mapa = L.map('mapa').setView(empresaCoords, 13);
    
    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // Marcador de la empresa
    const marcadorEmpresa = L.marker(empresaCoords).addTo(mapa);
    marcadorEmpresa.bindPopup('<b>Mi Sitio Web</b><br>Calle Ejemplo, 123<br>28001 Madrid').openPopup();
    
    // Variable para guardar el control de ruta (para poder eliminarlo después)
    let controlRuta = null;
    
    // Elementos del DOM
    const direccionInput = document.getElementById('direccion-origen');
    const btnGeolocalizar = document.getElementById('btn-geolocalizar');
    const btnCalcularRuta = document.getElementById('btn-calcular-ruta');
    const infoRuta = document.getElementById('info-ruta');
    
    // Función para eliminar la ruta anterior
    function eliminarRutaAnterior() {
        if (controlRuta) {
            mapa.removeControl(controlRuta);
            controlRuta = null;
        }
    }
    
    // Función para mostrar información de la ruta (usando el evento 'routeselected')
    function mostrarInfoRuta(ruta) {
        const instrucciones = ruta.instructions;
        if (instrucciones && instrucciones.length > 0) {
            const distancia = (ruta.summary.totalDistance / 1000).toFixed(2); // km
            const tiempo = Math.round(ruta.summary.totalTime / 60); // minutos
            infoRuta.innerHTML = `
                <strong>Distancia:</strong> ${distancia} km<br>
                <strong>Tiempo estimado:</strong> ${tiempo} minutos
            `;
            infoRuta.classList.add('visible');
        }
    }
    
    // Función para calcular ruta desde un punto origen
    function calcularRuta(origenLatLng) {
        eliminarRutaAnterior();
        
        controlRuta = L.Routing.control({
            waypoints: [
                L.latLng(origenLatLng[0], origenLatLng[1]),
                L.latLng(empresaCoords[0], empresaCoords[1])
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#3498db', weight: 5 }]
            },
            createMarker: function() { return null; } // No crear marcadores adicionales
        }).addTo(mapa);
        
        // Escuchar cuando se calcula la ruta para mostrar info
        controlRuta.on('routeselected', function(e) {
            mostrarInfoRuta(e.route);
        });
    }
    
    // Botón: usar geolocalización
    btnGeolocalizar.addEventListener('click', function() {
        if (navigator.geolocation) {
            infoRuta.innerHTML = 'Obteniendo tu ubicación...';
            infoRuta.classList.add('visible');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const origenCoords = [position.coords.latitude, position.coords.longitude];
                    direccionInput.value = 'Ubicación actual';
                    calcularRuta(origenCoords);
                },
                function(error) {
                    infoRuta.innerHTML = 'Error al obtener tu ubicación. Por favor, introdúcela manualmente.';
                    infoRuta.classList.add('visible');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización.');
        }
    });
    
    // Botón: calcular ruta desde dirección introducida
    btnCalcularRuta.addEventListener('click', function() {
        const direccion = direccionInput.value.trim();
        if (direccion === '') {
            alert('Por favor, introduce una dirección.');
            return;
        }
        
        infoRuta.innerHTML = 'Buscando dirección...';
        infoRuta.classList.add('visible');
        
        // Geocodificación con Nominatim (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    calcularRuta([lat, lon]);
                } else {
                    infoRuta.innerHTML = 'No se encontró la dirección. Intenta con más detalles.';
                }
            })
            .catch(error => {
                infoRuta.innerHTML = 'Error en la búsqueda. Inténtalo de nuevo.';
                console.error(error);
            });
    });
});