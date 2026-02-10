/*
 * script.js
 *
 * Responsável por adicionar interatividade ao guia:
 *  - gerenciamento de favoritos com armazenamento local
 *  - carregamento de mapa com Leaflet e filtragem de categorias
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==== FAVORITOS ====
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favoritesListEl = document.getElementById('favorites-list');

    // Mapeamento de IDs de itens para descrições amigáveis
    const itemDescriptions = {
        'roteiro3-dia1': 'Roteiro 3 Dias – Dia 1: Estocolmo cultural',
        'roteiro3-dia2': 'Roteiro 3 Dias – Dia 2: Arquipélago de Estocolmo',
        'roteiro3-dia3': 'Roteiro 3 Dias – Dia 3: Bem‑estar e gastronomia',
        'roteiro5-dia12': 'Roteiro 5 Dias – Dias 1–2: Estocolmo detalhada',
        'roteiro5-dia3': 'Roteiro 5 Dias – Dia 3: Arquipélago',
        'roteiro5-dia45': 'Roteiro 5 Dias – Dias 4–5: Gotemburgo',
        'roteiro7-dia123': 'Roteiro 7 Dias – Dias 1–3: Estocolmo',
        'roteiro7-dia4': 'Roteiro 7 Dias – Dia 4: Natureza',
        'roteiro7-dia56': 'Roteiro 7 Dias – Dias 5–6: Gotemburgo',
        'roteiro7-dia7': 'Roteiro 7 Dias – Dia 7: Visby (Gotland)',
        'frantzen': 'Frantzén – Estocolmo',
        'fikafabriken': 'Fika Fabriken – Estocolmo',
        'magasindevin': 'Magasin de Vin – Gotemburgo',
        'bacchanale': 'Bacchanale – Visby',
        'ekstedt': 'Ekstedt – Estocolmo',
        'koka': 'Koka – Gotemburgo',
        'aira': 'AIRA – Estocolmo',
        'icebar': 'Icebar – Estocolmo',
        'dalanisse': 'DalaNisse – Estocolmo',
        'checa': 'Checa – Estocolmo',
        'bord27': 'Bord 27 – Gotemburgo',
        'ostergatan': 'Östergatan No. 25 – Malmö'
        ,
        'tjoget': 'Tjoget – Estocolmo'
        ,
        'feskekorka': 'Feskekôrka – Gotemburgo'
    };

    // Carrega favoritos do localStorage
    function loadFavorites() {
        const saved = JSON.parse(localStorage.getItem('mariah_favorites') || '[]');
        favoritesListEl.innerHTML = '';
        // Atualiza estado dos botões
        favoriteButtons.forEach(btn => {
            const itemId = btn.dataset.item;
            if (saved.includes(itemId)) {
                btn.classList.add('active');
                btn.textContent = '❤️';
            } else {
                btn.classList.remove('active');
                btn.textContent = '♡';
            }
        });
        // Popula lista de favoritos no DOM
        saved.forEach(id => {
            const li = document.createElement('li');
            li.textContent = itemDescriptions[id] || id;
            favoritesListEl.appendChild(li);
        });
    }

    // Adiciona ou remove item dos favoritos
    function toggleFavorite(itemId) {
        let saved = JSON.parse(localStorage.getItem('mariah_favorites') || '[]');
        if (saved.includes(itemId)) {
            saved = saved.filter(id => id !== itemId);
        } else {
            saved.push(itemId);
        }
        localStorage.setItem('mariah_favorites', JSON.stringify(saved));
        loadFavorites();
    }

    // Evento de clique em botões de favorito
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.item;
            toggleFavorite(itemId);
        });
    });

    // Carrega favoritos iniciais na exibição
    loadFavorites();

    // ==== MAPA (opcional) ====
    const mapSection = document.getElementById('mapa');
    const mapEl = document.getElementById('map');
    const mapNavLinkLi = document.querySelector('a[href="#mapa"]')?.closest('li');

    function hideMap() {
        if (mapSection) mapSection.style.display = 'none';
        if (mapNavLinkLi) mapNavLinkLi.style.display = 'none';
        document.querySelectorAll('.map-focus-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // Se Leaflet não carregou (sem internet), esconda o mapa e siga.
    if (!mapEl || typeof L === 'undefined') {
        hideMap();
    } else {
        // Inicializa o mapa centrado na Suécia
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([60.1282, 18.6435], 5);
        // Camada base do mapa (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        // Define pontos de interesse com categoria
        const points = [
            {
                id: 'gamla_stan',
                name: 'Gamla Stan (Estocolmo)',
                coords: [59.325, 18.071],
                category: 'cidade',
                description: 'Centro histórico de Estocolmo com ruas de paralelepípedo e arquitetura medieval.'
            },
            {
                id: 'museu_vasa',
                name: 'Museu Vasa (Estocolmo)',
                coords: [59.327, 18.091],
                category: 'cidade',
                description: 'Museu dedicado ao navio de guerra Vasa, do século XVII.'
            },
            {
                id: 'arquipelago',
                name: 'Arquipélago de Estocolmo',
                coords: [59.391, 18.735],
                category: 'natureza',
                description: 'Milhares de ilhas com paisagens naturais e vilarejos tranquilos.'
            },
            {
                id: 'fotografiska',
                name: 'Fotografiska (Estocolmo)',
                coords: [59.317, 18.084],
                category: 'cidade',
                description: 'Museu de fotografia contemporânea com vistas panorâmicas.'
            },
            {
                id: 'sauna_central',
                name: 'Sauna Tradicional',
                coords: [59.332, 18.118],
                category: 'bemestar',
                description: 'Experiência de spa e sauna no estilo sueco, seguida de banho gelado.'
            },
            {
                id: 'haga',
                name: 'Haga (Gotemburgo)',
                coords: [57.698, 11.957],
                category: 'cidade',
                description: 'Bairro histórico e charmoso de Gotemburgo, conhecido por cafés e lojinhas.'
            },
            {
                id: 'gotemburgo_arquipelago',
                name: 'Arquipélago de Gotemburgo',
                coords: [57.66, 11.66],
                category: 'natureza',
                description: 'Ilhas e praias rochosas próximas à cidade, perfeitas para relaxar.'
            },
            {
                id: 'visby',
                name: 'Visby (Gotland)',
                coords: [57.635, 18.294],
                category: 'cidade',
                description: 'Cidade medieval murada, patrimônio mundial da UNESCO, repleta de história.'
            },
            {
                id: 'frantzen_marker',
                name: 'Frantzén (Restaurante)',
                coords: [59.334, 18.057],
                category: 'gastronomia',
                description: 'Restaurante três estrelas Michelin em Estocolmo.'
            },
        {
            id: 'ekstedt_marker',
            name: 'Ekstedt (Restaurante)',
            coords: [59.334, 18.074],
            category: 'gastronomia',
            description: 'Restaurante com cozinha no fogo em Estocolmo.'
        },
        {
            id: 'aira_marker',
            name: 'AIRA (Restaurante)',
            coords: [59.323, 18.102],
            category: 'gastronomia',
            description: 'Restaurante à beira de Djurgården, em Estocolmo.'
        },
        {
            id: 'icebar_marker',
            name: 'Icebar (Experiência)',
            coords: [59.332, 18.058],
            category: 'gastronomia',
            description: 'Bar de gelo em Estocolmo para uma noite diferente.'
        },
        {
            id: 'fika_fabriken_marker',
            name: 'Fika Fabriken (Café)',
            coords: [59.314, 18.072],
            category: 'gastronomia',
            description: 'Parada perfeita para um fika com cinnamon bun.'
        },
            {
                id: 'magasin_de_vin_marker',
                name: 'Magasin de Vin',
                coords: [57.703, 11.965],
                category: 'gastronomia',
                description: 'Bar de vinhos em Gotemburgo com ambiente aconchegante.'
            },
        {
            id: 'koka_marker',
            name: 'Koka (Restaurante)',
            coords: [57.701, 11.973],
            category: 'gastronomia',
            description: 'Restaurante Michelin em Gotemburgo com menu degustação sazonal.'
        },
            {
                id: 'bacchanale_marker',
                name: 'Bacchanale (Visby)',
                coords: [57.64, 18.3],
                category: 'gastronomia',
                description: 'Bistrô charmoso em Gotland com coquetéis autorais.'
            },
            {
                id: 'sauna_gotemburgo',
                name: 'Sauna & Spa (Gotemburgo)',
                coords: [57.704, 11.986],
                category: 'bemestar',
                description: 'Spa moderno com sauna e tratamentos revitalizantes.'
            }
        ,
        // Novos restaurantes a partir das recomendações de guias
        {
            id: 'dalanisse_marker',
            name: 'DalaNisse',
            coords: [59.335, 18.063],
            category: 'gastronomia',
            description: 'Restaurante tradicional sueco em Estocolmo, famoso pelo "dagens rätt".'
        },
        {
            id: 'checa_marker',
            name: 'Checa',
            coords: [59.336, 18.06],
            category: 'gastronomia',
            description: 'Cozinha peruana contemporânea com influências nórdicas em Södermalm.'
        },
        {
            id: 'bord27_marker',
            name: 'Bord 27',
            coords: [57.708, 11.974],
            category: 'gastronomia',
            description: 'Restaurante intimista em Gotemburgo com pratos sazonais e vinhos naturais.'
        },
        {
            id: 'ostergatan_marker',
            name: 'Östergatan No. 25',
            coords: [55.605, 13.001],
            category: 'gastronomia',
            description: 'Gastrobar em Malmö com pratos sazonais e ambiente descontraído.'
        }
        ,
        {
            id: 'tjoget_marker',
            name: 'Tjoget',
            coords: [59.318, 18.07],
            category: 'gastronomia',
            description: 'Bar e restaurante premiado em Södermalm, Estocolmo, conhecido pelos coquetéis e ambiente vibrante.'
        }
        ,
        {
            id: 'feskekorka_marker',
            name: 'Feskekôrka',
            coords: [57.704, 11.958],
            category: 'gastronomia',
            description: 'Mercado de frutos do mar em Gotemburgo, famoso por ostras, lagostas e peixes frescos.'
        }
        ];

        // Armazena marcadores para permitir filtro e foco por id
        const markers = [];
        const markerById = {};
        points.forEach(point => {
            const marker = L.marker(point.coords);
            marker.category = point.category;
            marker.bindPopup(`<strong>${point.name}</strong><br>${point.description}`);
            marker.addTo(map);
            markers.push(marker);
            markerById[point.id] = marker;
        });

        // Se houver erro ao carregar tiles, esconda completamente o mapa
        map.on('tileerror', () => {
            hideMap();
        });

        // Botões "Ver no mapa": foca e abre o popup do ponto
        document.querySelectorAll('.map-focus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-map-id');
                const marker = markerById[id];
                if (!marker) return;
                map.setView(marker.getLatLng(), 13, { animate: true });
                marker.openPopup();
            });
        });

        // Função para atualizar visibilidade dos marcadores com base nos filtros
        function updateMarkers() {
            // Obtém categorias selecionadas
            const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
            markers.forEach(marker => {
                if (selectedCategories.includes(marker.category)) {
                    marker.addTo(map);
                } else {
                    marker.remove();
                }
            });
        }

        // Liga updateMarkers aos checkboxes de categoria
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
        categoryCheckboxes.forEach(cb => {
            cb.addEventListener('change', updateMarkers);
        });
        // Chama uma vez após inicialização
        updateMarkers();

    }
});