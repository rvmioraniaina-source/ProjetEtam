# J’ETAM Live Show 2025 – Page évènementielle

Test technique d’intégration web (alternance Etam) : intégration responsive de la page évènementielle du **Live Show Etam du 30 septembre 2025**, avec un jeu concours en popin.

> Réalisé par **[Prénom Nom]** – [date]

## Aperçu rapide

- **Technologies :** HTML5, CSS3, JavaScript natif (aucune librairie, aucun framework)
- **Polices :** Bodoni Moda (titres) et Jost (textes), via Google Fonts
- **Responsive :** mobile et desktop, avec un seuil à `48rem` (768 px)
- **Lancer le projet :** ouvrir `index.html` dans un navigateur récent (aucune installation)

## Structure du projet

```
├── index.html      Structure de la page
├── main.css        Styles (variables, composants, sections, mobile/desktop)
├── script.js       Popin, formulaire, barre fixe, galerie
├── images/         Visuels exportés de la maquette Figma
└── README.md
```

## Ce qui est intégré

| Section | Description |
|---|---|
| **Header** | Image de fond (une autre version mobile via `<picture>`), logo et titre superposés avec une animation d’apparition |
| **Intro** | Texte d’accroche hiérarchisé (repère, accroche, explication, lien) |
| **Card** | Image et infos de l’évènement (date, heure, lieu) en liste de définition `<dl>` |
| **Manifeste** | Deux photos superposées avec un fondu en boucle (CSS), lien « Shop the look » |
| **Galerie** | Desktop : les images défilent horizontalement quand on scrolle. Mobile : swipe natif avec points de navigation |
| **Distribution** | Crédits de la campagne et image du clap |
| **Jeu concours** | Section d’appel à l’action avec bouton ouvrant la popin |
| **Barre fixe** | Barre « Jeu concours · 2 places VIP » qui apparaît après le header |
| **Popin** | Formulaire d’inscription (prénom, nom, email, téléphone, règlement) avec validation |

Le header de navigation n’est pas codé (comme indiqué dans le sujet) : il est présent via l’image de la maquette.

## Choix techniques

**HTML sémantique**
- `<dl>` pour les informations clé/valeur (infos de l’évènement, crédits).
- `<dialog>` natif pour la popin : le fond sombre, le focus et la touche Échap sont gérés par le navigateur.
- Un seul `<h1>`, puis des `<h2>` pour les grandes sections.

**CSS**
- Variables CSS (`:root`) pour les couleurs et les polices.
- Tailles de texte fluides avec `clamp()`.
- Un bloc pour le desktop (`min-width: 48rem`) et un bloc pour le mobile (`max-width: 47.99rem`), pour retrouver facilement chaque adaptation.
- Animations en CSS pur (apparition du titre, fondu des images) ; elles sont désactivées si l’utilisateur a réduit les animations dans son système (`prefers-reduced-motion`).

**JavaScript** (fonctions courtes et commentées)
- Popin : ouverture et fermeture (bouton, croix, clic sur le fond, Échap).
- Validation du formulaire champ par champ, avec messages d’erreur sous chaque champ.
- Barre fixe : affichée après le header, masquée quand la section jeu concours est visible.
- Galerie desktop : la section est rendue plus haute pour que le scroll vertical fasse glisser les images. Les mesures sont faites une seule fois et le déplacement passe par `requestAnimationFrame` avec `translate3d`, pour rester fluide.
- Galerie mobile : défilement natif en CSS (`scroll-snap`), le JS ne fait que mettre à jour les points.

## Accessibilité

- Textes alternatifs sur les images informatives, images décoratives avec `alt=""`.
- Formulaire avec `<label>`, `autocomplete`, messages d’erreur annoncés (`aria-live`).
- Points de la galerie en vrais `<button>` avec `aria-label`.
- Barre fixe masquée avec `visibility: hidden` pour ne pas être atteignable au clavier quand elle est cachée.
- Zones de clic suffisantes sur mobile pour les boutons principaux.

## Performance

- `loading="lazy"` sur les images sous la ligne de flottaison (sauf la galerie, qui doit être prête au défilement).
- `fetchpriority="high"` sur l’image du header, `decoding="async"` sur les images.
- `preconnect` vers Google Fonts, et seulement les graisses de police utilisées.

## Libertés prises sur le design

La maquette est une base ; j’ai voulu une page évènementielle qui reste dans l’univers e-commerce d’Etam :
- barre fixe vers le jeu concours pour garder l’action visible ;
- lien « Shop the look » sur le visuel du manifeste, pour relier la page à la boutique ;
- galerie interactive plutôt qu’une simple grille ;
- section jeu concours simplifiée autour d’un appel à l’action unique.

## Limites et pistes d’amélioration

- **Envoi du formulaire :** la validation est faite côté navigateur, mais aucune donnée n’est envoyée. Avec un back-end, il faudrait un `fetch` en `POST` dans `script.js` au moment de la validation, avec une gestion des erreurs réseau.
- **Images :** les visuels sont exportés de Figma. En production, je les convertirais en WebP/AVIF avec des tailles adaptées (`srcset`) et des attributs `width`/`height`.
- **Navigation :** le header est une image ; il faudrait un vrai menu avec burger sur mobile.
- **Organisation du CSS :** à terme, passer l’ensemble en mobile-first et harmoniser la convention de nommage des classes (BEM).
- **Tests :** à compléter par des tests sur navigateurs et appareils réels, et un audit Lighthouse.
