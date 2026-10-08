/* ==========================================================
   script.js – 3 fonctionnalités :
   1. Ouvrir / fermer la popin
   2. Vérifier le formulaire
   3. Afficher la barre « Je tente ma chance » au scroll
   ========================================================== */


/* ---------- 1. La popin ---------- */

// On récupère les éléments de la page dont on a besoin
const popin = document.getElementById('popin');
const formulaire = document.getElementById('form');
const messageMerci = document.querySelector('.popin__ok');
const boutonsOuvrir = document.querySelectorAll('[data-open-form]');
const boutonsFermer = document.querySelectorAll('[data-close]');

function ouvrirPopin() {
  formulaire.hidden = false;    // on affiche le formulaire
  messageMerci.hidden = true;   // on cache le message de remerciement
  popin.showModal();            // showModal() ouvre la popin (fonction native du <dialog>)
}

function fermerPopin() {
  popin.close();
}

// Chaque bouton « Je tente ma chance » ouvre la popin
for (const bouton of boutonsOuvrir) {
  bouton.addEventListener('click', ouvrirPopin);
}

// Chaque bouton « Fermer » (croix, bouton final) ferme la popin
for (const bouton of boutonsFermer) {
  bouton.addEventListener('click', fermerPopin);
}

// Le clic sur le fond sombre ferme aussi la popin
popin.addEventListener('click', function (event) {
  if (event.target === popin) {
    fermerPopin();
  }
});
// Remarque : la touche Échap ferme déjà la popin toute seule grâce au <dialog>.


/* ---------- 2. Le formulaire ---------- */

function afficherErreur(champ, message) {
  const label = champ.closest('label');                // le <label> qui entoure le champ
  label.querySelector('small').textContent = message;  // on écrit l'erreur sous le champ
  label.classList.add('invalid');                      // la classe met la bordure en rouge
}

function effacerErreur(champ) {
  const label = champ.closest('label');
  label.querySelector('small').textContent = '';
  label.classList.remove('invalid');
}

// Vérifie UN champ. Renvoie true s'il est correct, false sinon.
function verifierChamp(champ) {
  const valeur = champ.value.trim();   // trim() enlève les espaces au début et à la fin

  if (champ.name === 'prenom' && valeur.length < 2) {
    afficherErreur(champ, 'Merci de renseigner ton prénom');
    return false;
  }

  if (champ.name === 'nom' && valeur.length < 2) {
    afficherErreur(champ, 'Merci de renseigner ton nom');
    return false;
  }

  // Un email correct contient un @ suivi d'un point
  if (champ.name === 'email' && (!valeur.includes('@') || !valeur.includes('.'))) {
    afficherErreur(champ, 'Adresse email invalide');
    return false;
  }

  // Un téléphone correct : 10 chiffres une fois les espaces enlevés
  if (champ.name === 'tel' && valeur.replaceAll(' ', '').length < 10) {
    afficherErreur(champ, 'Numéro de téléphone invalide');
    return false;
  }

  // La case du règlement doit être cochée
  if (champ.name === 'rgpd' && !champ.checked) {
    afficherErreur(champ, 'Merci d’accepter le règlement');
    return false;
  }

  effacerErreur(champ);   // tout est bon : on retire l'erreur éventuelle
  return true;
}

// Quand on clique sur « Valider mon inscription »
formulaire.addEventListener('submit', function (event) {
  event.preventDefault();   // empêche le rechargement de la page

  let formulaireValide = true;
  for (const champ of formulaire.querySelectorAll('input')) {
    if (verifierChamp(champ) === false) {
      formulaireValide = false;
    }
  }

  if (formulaireValide) {
    // Dans un vrai projet, on enverrait ici les données au serveur
    formulaire.hidden = true;       // on cache le formulaire
    messageMerci.hidden = false;    // on affiche « Merci ! »
    formulaire.reset();             // on vide les champs
  }
});


/* ---------- 3. La barre « Jeu concours » au scroll ---------- */

const barre = document.getElementById('sticky-cta');
const header = document.querySelector('.header');
const sectionJeu = document.getElementById('jeu');

function mettreAJourBarre() {
  // getBoundingClientRect() donne la position d'un élément par rapport à l'écran
  const headerEstPasse = header.getBoundingClientRect().bottom < 0;
  const jeuEstVisible = sectionJeu.getBoundingClientRect().top < window.innerHeight;

  // On affiche la barre une fois le header passé, sauf si la section jeu est déjà à l'écran
  if (headerEstPasse && !jeuEstVisible) {
    barre.classList.add('visible');
  } else {
    barre.classList.remove('visible');
  }
}

/* ---------- 4. La galerie : Comportement hybride ---------- */
const galerie = document.querySelector('.galerie');
const piste = document.querySelector('.galerie_track');

let distanceHorizontale = 0;
let cible = 0;
let actuelle = 0;
let animationEnCours = false;

function mesurer() {
  // --- MODE MOBILE ---
  if (window.innerWidth < 768) {
    galerie.style.height = '';    // On nettoie les styles en ligne du JS
    piste.style.transform = '';
    return; // On arrête là pour le mobile, le CSS gère le défilement !
  }
  
  // --- MODE DESKTOP ---
  distanceHorizontale = Math.max(0, piste.scrollWidth - window.innerWidth);
  galerie.style.height = (distanceHorizontale + window.innerHeight) + 'px';
  calculerCible();
  actuelle = cible;
  dessiner();
}

function calculerCible() {
  if (distanceHorizontale === 0) { cible = 0; return; }
  const haut = galerie.getBoundingClientRect().top;
  let progression = -haut / distanceHorizontale;
  if (progression < 0) { progression = 0; }
  if (progression > 1) { progression = 1; }
  cible = progression * distanceHorizontale;
}

function dessiner() {
  if (window.innerWidth >= 768) {
    piste.style.transform = 'translate3d(' + (-actuelle) + 'px, 0, 0)';
  }
}

function animer() {
  actuelle = actuelle + (cible - actuelle) * 0.15;
  if (Math.abs(cible - actuelle) < 0.5) { actuelle = cible; }
  dessiner();

  if (actuelle !== cible && window.innerWidth >= 768) {
    requestAnimationFrame(animer);
  } else {
    animationEnCours = false;
  }
}

function auScroll() {
  if (window.innerWidth < 768) return; // Ne rien faire sur mobile
  calculerCible();
  if (!animationEnCours) {
    animationEnCours = true;
    requestAnimationFrame(animer);
  }
}

window.addEventListener('scroll', auScroll, { passive: true });
window.addEventListener('resize', mesurer);
window.addEventListener('load', mesurer);
mesurer();

// --- GESTION DES DOTS AU SWIPE (Mobile) ---
const imagesGalerie = piste.querySelectorAll('img');
const dots = document.querySelectorAll('.galerie_dot');

if ('IntersectionObserver' in window && piste && dots.length) {
  const observateur = new IntersectionObserver((entries) => {
    entries.forEach((entree) => {
      if (entree.isIntersecting) {
        const index = Array.from(imagesGalerie).indexOf(entree.target);
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
        });
      }
    });
  }, { root: piste, threshold: 0.6 });

  imagesGalerie.forEach((img) => observateur.observe(img));
}

// 5. À chaque scroll : on recalcule la cible et on lance l'animation si besoin
function auScroll() {
  calculerCible();
  if (!animationEnCours) {
    animationEnCours = true;
    requestAnimationFrame(animer);
  }
}

window.addEventListener('scroll', auScroll, { passive: true });
window.addEventListener('resize', mesurer);
window.addEventListener('load', mesurer);   // on remesure quand toutes les images sont chargées
mesurer();

window.addEventListener('scroll', mettreAJourBarre, { passive: true });   // barre « Jeu concours »