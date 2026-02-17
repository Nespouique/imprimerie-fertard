# Imprimerie Fertard

Site vitrine statique pour l'**Imprimerie Fertard**, imprimeur artisanal depuis 1813 à Janzé (Ille-et-Vilaine, Bretagne).

## Aperçu

Site single-page avec une esthétique éditoriale premium mêlant héritage imprimeur et design moderne. Entièrement statique (HTML/CSS/JS), sans framework ni dépendance côté client.

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | Plein écran avec image Pantone, badge "Depuis 1813", CTAs |
| **Savoir-faire** | Grille bento asymétrique présentant les 3 métiers : Création, Impression, Finition |
| **Process bar** | 6 étapes du projet : Consultation → Création → BAT → Impression → Finition → Livraison |
| **Galerie** | "Dans les coulisses" — grille 4 colonnes de photos d'atelier sur fond gradient navy |
| **Produits** | Onglets Particuliers / Professionnels avec cartes produits et images |
| **À propos** | Storytelling patrimonial, statistiques (1813 / 4 générations / 2 sites / 200+ ans), Journal Clins d'Œil |
| **Devis** | Formulaire complet de demande de devis + sidebar contact + Google Maps |
| **Footer** | Logo, liens rapides, barre CMYK, copyright |

## Stack technique

- **HTML5** sémantique avec ARIA (navigation, tabs, modal, formulaire)
- **CSS3** — Custom properties, Grid, Flexbox, animations, media queries mobile-first
- **JavaScript** vanilla — IntersectionObserver, parallax, formulaire, modale avec focus trap
- **Google Fonts** — Playfair Display (titres) + DM Sans (corps)
- **Formspree** — Envoi du formulaire de devis par email (AJAX, sans redirection)

## Design

- **Palette** : navy deep `#0f1b2d`, cream `#f5f0e8`, gold `#c8a55a`, accents CMYK (cyan `#00a0d2`, magenta `#e4007c`, jaune `#ffed00`)
- **Gradients** : sections sombres en `linear-gradient(160deg, #0d1220, #1e2a42)`
- **Typographie** : Playfair Display italique pour les titres display, DM Sans pour le corps
- **Textures** : grain papier subtil en arrière-plan des sections claires

## Fonctionnalités JS

- **Scroll reveal** — Animations au défilement via IntersectionObserver avec stagger delays
- **Parallax** — Effet de profondeur sur le hero et les photos À propos
- **Navigation sticky** — Fond blur au scroll, hamburger plein écran sur mobile
- **Onglets produits** — Changement de panel avec ARIA tabs (aria-selected)
- **Formulaire de devis** — Checkboxes produit activant les champs quantité, validation native, envoi Formspree
- **Modale Journal** — Focus trap, fermeture Escape/backdrop, retour du focus
- **Toast notification** — Position fixed en bas à droite, auto-dismiss après 6s

## Structure des fichiers

```
├── index.html          # Page unique du site
├── styles.css          # Styles complets (~2200 lignes)
├── script.js           # Comportements et animations (~310 lignes)
├── assets/
│   └── images/         # Photos d'atelier, logo, hero
├── sitemap.xml         # Sitemap pour le SEO
├── robots.txt          # Configuration robots
└── README.md
```

## SEO & Accessibilité

- Open Graph (7 balises) + Twitter Card
- Schema.org JSON-LD (LocalBusiness)
- `<meta name="theme-color">`, favicon, apple-touch-icon
- Font preload pour les performances
- ARIA : `role=navigation`, `role=dialog`, `role=tablist/tab/tabpanel`, `aria-expanded`, `aria-modal`, `aria-selected`
- Focus visible avec outline gold sur `:focus-visible`
- Champs obligatoires avec `required` et indicateurs visuels `*`

## Déploiement

Site statique — servir les fichiers avec n'importe quel serveur web (Nginx, Apache, Caddy...).

Exemple avec Nginx :

```nginx
server {
    listen 80;
    server_name imprimerie-fertard.fr www.imprimerie-fertard.fr;
    root /var/www/imprimerie-fertard;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache des images
    location /assets/images/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Contact

- **Adresse** : ZA de la Chauvelière, 35150 Janzé
- **Téléphone** : 02 99 47 06 74
- **Email** : ifertard@club-internet.fr
- **Second site** : Bain-de-Bretagne (35)
