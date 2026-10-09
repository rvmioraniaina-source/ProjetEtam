/* ==========================================================
   script.js – 4 fonctionnalités :
   1. Ouvrir / fermer la popin
   2. Vérifier le formulaire
   3. Afficher la barre « Je tente ma chance » au scroll
   4. La galerie (défilement desktop + points sur mobile)
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
    for (const champ of formulaire.querySelectorAll('input')) {
        effacerErreur(champ);       // on retire les erreurs d'une ouverture précédente
    }
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

/* ---------- 4. La galerie ---------- */

const galerie = document.querySelector('.galerie');
const piste = document.querySelector('.galerie_track');
const images = piste.querySelectorAll('img');
const points = document.querySelectorAll('.galerie_dot');

function estDesktop() {
    return window.matchMedia('(min-width: 48rem)').matches;   // même seuil que le CSS
}


/* ----- Desktop : les images défilent de droite à gauche quand on scrolle ----- */

let distanceHorizontale = 0;   // de combien de pixels la piste doit glisser
let cible = 0;                 // position que la piste doit atteindre
let actuelle = 0;              // position actuelle (elle rattrape la cible)
let animationEnCours = false;

function mesurer() {
    if (!estDesktop()) {
        galerie.style.height = '';       // sur mobile on enlève les réglages du JS
        piste.style.transform = '';
        return;
    }
    distanceHorizontale = Math.max(0, piste.scrollWidth - window.innerWidth);
    galerie.style.height = (distanceHorizontale + window.innerHeight) + 'px';
    calculerCible();
    actuelle = cible;
    dessiner();
}

function calculerCible() {
    if (distanceHorizontale === 0) {
        cible = 0;
        return;
    }
    const haut = galerie.getBoundingClientRect().top;
    let progression = -haut / distanceHorizontale;     // 0 = début, 1 = fin
    if (progression < 0) { progression = 0; }
    if (progression > 1) { progression = 1; }
    cible = progression * distanceHorizontale;
}

function dessiner() {
    piste.style.transform = 'translate3d(' + (-actuelle) + 'px, 0, 0)';
}

function animer() {
    actuelle = actuelle + (cible - actuelle) * 0.15;   // on avance de 15 % de la distance restante
    if (Math.abs(cible - actuelle) < 0.5) {
        actuelle = cible;
    }
    dessiner();

    if (actuelle !== cible) {
        requestAnimationFrame(animer);
    } else {
        animationEnCours = false;
    }
}

function auScrollDesktop() {
    if (!estDesktop()) { return; }
    calculerCible();
    if (!animationEnCours) {
        animationEnCours = true;
        requestAnimationFrame(animer);
    }
}


/* ----- Mobile : slide dots ----- */

// Allume le point numéro n et éteint les autres
function afficherPoint(n) {
    for (const point of points) {
        point.classList.remove('is-active');
    }
    points[n].classList.add('is-active');
}

// Quand on swipe : on cherche quelle image est au centre
function auSwipe() {
    const pas = images[1].offsetLeft - images[0].offsetLeft;   // distance entre 2 images
    let numero = Math.round(piste.scrollLeft / pas);

    const finDeLaPiste = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 5;
    if (finDeLaPiste) {
        numero = images.length - 1;                              // tout au bout : dernière image
    }
    afficherPoint(numero);
}

// Quand on clique sur un point : on fait défiler jusqu'à l'image
function auClicSurPoint(n) {
    images[n].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

piste.addEventListener('scroll', auSwipe, { passive: true });

points.forEach(function (point, n) {
    point.addEventListener('click', function () {
        auClicSurPoint(n);
    });
});


/* ----- Écouteurs ----- */

window.addEventListener('scroll', auScrollDesktop, { passive: true });
window.addEventListener('scroll', mettreAJourBarre, { passive: true });   // barre « Jeu concours »
window.addEventListener('resize', mesurer);
window.addEventListener('load', mesurer);
mesurer();
mettreAJourBarre();   // état correct dès le chargement