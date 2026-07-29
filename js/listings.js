// Les biens affichés viennent de /content/properties.json.
// Pour ajouter/modifier/supprimer un bien : passez par l'interface d'admin (/admin),
// pas la peine de toucher à ce fichier.
let PROPERTIES = [];
let currentGallery = [];
let currentPhotoIndex = 0;

function renderListings(filter) {
  const grid = document.getElementById('listingGrid');
  grid.innerHTML = '';
  const items = PROPERTIES.filter(p => filter === 'tous' || p.type === filter);
  if (items.length === 0) {
    grid.innerHTML = '<p class="sans" style="color:#777;">Aucun bien dans cette catégorie pour le moment.</p>';
    return;
  }
  items.forEach((p) => {
    const photos = p.photos && p.photos.length ? p.photos : (p.photo ? [p.photo] : []);
    const thumb = photos[0] || '';
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="listing-photo photo">
        <img src="${thumb}" alt="${p.title}" loading="lazy">
        ${photos.length > 1 ? `<span class="photo-count">${photos.length} photos</span>` : ''}
      </div>
      <div class="listing-body">
        <span class="listing-tag">${p.tag}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <span class="listing-price">${p.price}</span>
      </div>`;
    card.addEventListener('click', () => openListingModal(p));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openListingModal(p); });
    grid.appendChild(card);
  });
}

function openListingModal(p) {
  currentGallery = p.photos && p.photos.length ? p.photos : (p.photo ? [p.photo] : []);
  currentPhotoIndex = 0;

  document.getElementById('modalTag').textContent = p.tag;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalPrice').textContent = p.price;

  const specs = [];
  if (p.surface) specs.push(`<span class="spec-chip">${p.surface}</span>`);
  if (p.chambres) specs.push(`<span class="spec-chip">${p.chambres} pièce(s)</span>`);
  if (p.equipements) specs.push(`<span class="spec-chip">${p.equipements}</span>`);
  document.getElementById('modalSpecs').innerHTML = specs.join('');

  const waText = `Bonjour KIG-SARLU, je suis intéressé(e) par : ${p.title}`;
  document.getElementById('modalWhatsapp').href = `https://wa.me/224628625663?text=${encodeURIComponent(waText)}`;

  updateGalleryImage();
  const modal = document.getElementById('listingModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeListingModal() {
  const modal = document.getElementById('listingModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateGalleryImage() {
  const img = document.getElementById('galleryImage');
  const count = document.getElementById('galleryCount');
  const nav = document.querySelectorAll('.gallery-nav');
  if (currentGallery.length === 0) {
    img.src = '';
    count.textContent = '';
    nav.forEach(b => b.style.display = 'none');
    return;
  }
  img.src = currentGallery[currentPhotoIndex];
  count.textContent = currentGallery.length > 1 ? `${currentPhotoIndex + 1} / ${currentGallery.length}` : '';
  nav.forEach(b => b.style.display = currentGallery.length > 1 ? 'flex' : 'none');
}

document.getElementById('listingModalClose').addEventListener('click', closeListingModal);
document.getElementById('listingModalBackdrop').addEventListener('click', closeListingModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeListingModal();
});
document.getElementById('galleryPrev').addEventListener('click', () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentGallery.length) % currentGallery.length;
  updateGalleryImage();
});
document.getElementById('galleryNext').addEventListener('click', () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentGallery.length;
  updateGalleryImage();
});

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
