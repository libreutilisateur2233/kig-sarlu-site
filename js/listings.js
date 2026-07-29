// Les biens affichés viennent de /content/properties.json.
// Pour ajouter/modifier/supprimer un bien : passez par l'interface d'admin (/admin),
// pas la peine de toucher à ce fichier.
let PROPERTIES = [];

function renderListings(filter) {
  const grid = document.getElementById('listingGrid');
  grid.innerHTML = '';
  const items = PROPERTIES.filter(p => filter === 'tous' || p.type === filter);
  if (items.length === 0) {
    grid.innerHTML = '<p class="sans" style="color:#777;">Aucun bien dans cette catégorie pour le moment.</p>';
    return;
  }
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="listing-photo photo"><img src="${p.photo}" alt="${p.title}" loading="lazy"></div>
      <div class="listing-body">
        <span class="listing-tag">${p.tag}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <span class="listing-price">${p.price}</span>
      </div>`;
    grid.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderListings(btn.dataset.filter);
  });
});

fetch('/content/properties.json')
  .then(res => res.json())
  .then(data => {
    PROPERTIES = data.properties || [];
    renderListings('tous');
  })
  .catch(() => {
    document.getElementById('listingGrid').innerHTML =
      '<p class="sans" style="color:#777;">Impossible de charger les biens pour le moment.</p>';
  });
