document.addEventListener('DOMContentLoaded', function() {
    // Coordenadas de la empresa (Plaza Mayor, Madrid)
    const empresaCoords = [40.416775, -3.703790];
    
    // Verificar que el mapa existe en el DOM
    const mapaElement = document.getElementById('mapa');
    if (!mapaElement) {
        console.error('No se encontró el elemento con id "mapa"');
        return;
    }
    
    // Inicializar mapa
    const mapa = L.map('mapa').setView(empresaCoords, 13);
    
    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // Marcador de la empresa
    L.marker(empresaCoords).addTo(mapa)
        .bindPopup('<b>Mi Sitio Web</b><br>Calle Ejemplo, 123<br>28001 Madrid')
        .openPopup();
    
    let controlRuta = null;
    
    // Elementos del DOM con comprobación
    const direccionInput = document.getElementById('direccion-origen');
    const btnCalcularRuta = document.getElementById('btn-calcular-ruta');
    const infoRuta = document.getElementById('info-ruta');
    
    // Función para eliminar ruta anterior
    function eliminarRuta() {
        if (controlRuta && mapa) {
            try {
                mapa.removeControl(controlRuta);
            } catch(e) {
                console.warn('Error al eliminar ruta:', e);
            }
            controlRuta = null;
        }
    }
    
    // Función para mostrar la ruta
    function mostrarRuta(origenLatLng) {
        eliminarRuta();
        
        // Validar coordenadas
        if (!origenLatLng || origenLatLng.length !== 2 || isNaN(origenLatLng[0]) || isNaN(origenLatLng[1])) {
            console.error('Coordenadas inválidas', origenLatLng);
            if (infoRuta) {
                infoRuta.innerHTML = '❌ Coordenadas de origen inválidas.';
                infoRuta.classList.add('visible');
            }
            return;
        }
        
        try {
            controlRuta = L.Routing.control({
                waypoints: [
                    L.latLng(origenLatLng[0], origenLatLng[1]),
                    L.latLng(empresaCoords[0], empresaCoords[1])
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                lineOptions: { styles: [{ color: '#3498db', weight: 5 }] },
                createMarker: function() { return null; }
            }).addTo(mapa);
            
            controlRuta.on('routeselected', function(e) {
                const distancia = (e.route.summary.totalDistance / 1000).toFixed(2);
                const tiempo = Math.round(e.route.summary.totalTime / 60);
                if (infoRuta) {
                    infoRuta.innerHTML = `<strong>📏 Distancia:</strong >${distancia} km<br><strong>⏱️ Tiempo:</strong> ${tiempo} minutos`;
                    infoRuta.classList.add('visible');
                }
            });
            
            controlRuta.on('routingerror', function(e) {
                console.error('Error en el ruteo:', e);
                if (infoRuta) {
                    infoRuta.innerHTML = '❌ No se pudo calcular la ruta. Verifica tu conexión.';
                    infoRuta.classList.add('visible');
                }
            });
        } catch(e) {
            console.error('Error al crear el control de ruta:', e);
            if (infoRuta) {
                infoRuta.innerHTML = '❌ Error al calcular la ruta.';
                infoRuta.classList.add('visible');
            }
        }
    }
    
    // ============================================
    // 1. Ruta automática al cargar la página
    // ============================================
    if (navigator.geolocation) {
        if (infoRuta) {
            infoRuta.innerHTML = '📍 Solicitando permiso de ubicación...';
            infoRuta.classList.add('visible');
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                mostrarRuta(userCoords);
            },
            function(error) {
                let mensaje = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mensaje = '❌ Permiso denegado. Activa la ubicación y recarga la página.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensaje = '❌ Ubicación no disponible.';
                        break;
                    case error.TIMEOUT:
                        mensaje = '❌ Tiempo de espera agotado.';
                        break;
                    default:
                        mensaje = '❌ Error al obtener tu ubicación.';
                }
                mensaje += ' Puedes buscar una dirección manualmente.';
                if (infoRuta) {
                    infoRuta.innerHTML = mensaje;
                    infoRuta.classList.add('visible');
                }
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        if (infoRuta) {
            infoRuta.innerHTML = '❌ Tu navegador no soporta geolocalización. Introduce una dirección manualmente.';
            infoRuta.classList.add('visible');
        }
    }
    
    // ============================================
    // 2. Búsqueda manual (botón)
    // ============================================
    if (btnCalcularRuta) {
        btnCalcularRuta.addEventListener('click', function() {
            const direccion = direccionInput ? direccionInput.value.trim() : '';
            if (!direccion) {
                alert('Por favor, introduce una dirección.');
                return;
            }
            
            if (infoRuta) {
                infoRuta.innerHTML = '🔍 Buscando dirección...';
                infoRuta.classList.add('visible');
            }
            
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
            
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('Error en la respuesta del servidor');
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        if (!isNaN(lat) && !isNaN(lon)) {
                            mostrarRuta([lat, lon]);
                        } else {
                            throw new Error('Coordenadas inválidas');
                        }
                    } else {
                        if (infoRuta) {
                            infoRuta.innerHTML = '❌ No se encontró la dirección. Intenta con más detalles.';
                            infoRuta.classList.add('visible');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error en geocodificación:', error);
                    if (infoRuta) {
                        infoRuta.innerHTML = '❌ Error en la búsqueda. Verifica tu conexión.';
                        infoRuta.classList.add('visible');
                    }
                });
        });
    }
});