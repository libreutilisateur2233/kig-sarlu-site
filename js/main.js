document.getElementById('burgerBtn').addEventListener('click', function () {
  document.getElementById('mainNav').classList.toggle('open');
});

function readContactFields() {
  const name = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();
  if (!name || !phone) {
    alert('Merci de renseigner votre nom et votre téléphone.');
    return null;
  }
  return { name, phone, subject, message };
}

document.getElementById('sendWhatsapp').addEventListener('click', () => {
  const d = readContactFields();
  if (!d) return;
  const text = `Bonjour KIG-SARLU,%0AJe suis ${encodeURIComponent(d.name)} (${encodeURIComponent(d.phone)}).%0AObjet : ${encodeURIComponent(d.subject)}%0A${encodeURIComponent(d.message)}`;
  window.open(`https://wa.me/224628625663?text=${text}`, '_blank');
});

// Le formulaire est un vrai formulaire Netlify (data-netlify="true" + action="/merci.html"
// fonctionnent même sans JavaScript). Ce script intercepte juste l'envoi pour afficher
// une confirmation sans recharger la page.
function encodeFormData(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', function (e) {
  const d = readContactFields();
  if (!d) { e.preventDefault(); return; }

  e.preventDefault();
  const payload = {
    'form-name': 'contact',
    name: d.name,
    phone: d.phone,
    subject: d.subject,
    message: d.message,
    'bot-field': contactForm.querySelector('[name="bot-field"]').value
  };

  formStatus.textContent = 'Envoi en cours…';
  formStatus.style.color = '#555';

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      formStatus.textContent = 'Message envoyé — nous vous recontactons rapidement. Merci !';
      formStatus.style.color = '#1F5C3E';
      contactForm.reset();
    })
    .catch(() => {
      formStatus.textContent = "L'envoi a échoué. Réessayez, ou utilisez le bouton WhatsApp ci-dessus.";
      formStatus.style.color = '#a33';
    });
});
