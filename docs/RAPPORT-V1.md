# Rapport de la V1

## Résumé des hypothèses

- Malik DIORI est présenté comme interlocuteur qui coordonne des projets de formation et la recherche d'intervenants selon le besoin.
- « DIORI GROWTH » est stocké comme nom provisoire mais n'est pas présenté en marque officielle.
- Le téléphone fourni n'est pas utilisé sur les pages publiques tant que sa validation n'est pas configurée.
- Les quatre offres du brief restent des brouillons éditoriaux. Aucun cours, tarif, date, expert, client, diplôme ou résultat chiffré n'a été inventé.
- Le formulaire ne prétend pas envoyer un e-mail tant que le service réel n'est pas explicitement configuré.

## Fonctionnalités, fichiers et limites

| Fonctionnalité | Comportement obtenu | Fichiers principaux | Configuration / limites |
|---|---|---|---|
| Site éditorial responsive | Accueil, services, catalogue, méthode, à propos, contact, 404 et pied de page en français | `src/pages/`, `src/layouts/SiteLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/styles/global.css` | Les contenus et preuves manquants restent masqués ou signalés en prévisualisation. |
| Validation éditoriale | Collections Astro `services`, `trainings`, `experts`; schémas typés et statut `draft`/`approved` | `src/content.config.ts`, `src/content/`, routes dynamiques | Le build public filtre les brouillons. Les offres à valider apparaissent uniquement dans le mode preview, qui ajoute `noindex` et un avertissement. |
| Catalogue de formations | Les fiches approuvées affichent objectif, public, prérequis, durée, modalités, évaluation et intervenant facultatif | `src/pages/formations/`, `src/content/trainings/`, `docs/AJOUTER-UNE-FORMATION.md` | Aucune fiche ni date fictive n'est fournie. |
| Demande de contact | Formulaire étiqueté, champs limités, validation serveur, honeypot, origine, taille et quota par instance | `src/components/ContactForm.astro`, `src/pages/contact.astro`, `src/pages/api/contact.ts` | Requiert Node, Resend, Turnstile et une politique de conservation validée. Aucun envoi n'est actif par défaut. Limite mémoire par processus, à compléter au proxy/hébergeur. |
| Contact téléphone / WhatsApp | Numéro et actions visibles seulement si la variable de confirmation est activée | `src/config/site.ts`, `src/pages/contact.astro`, `src/pages/index.astro` | Numéro à confirmer ; aucune localisation n'est inférée de l'indicatif. |
| SEO et partage | Titres et descriptions par page, Open Graph, carte sociale, robots et sitemap conditionnés au domaine | `src/layouts/SiteLayout.astro`, `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`, `public/social-card.svg` | Le domaine reste à configurer ; le robots.txt bloque l'exploration tant qu'il manque. Les pages preview sont noindex. |
| Identité visuelle | Bleu nuit, or et ivoire ; dessin vectoriel original ; menu mobile et focus clavier | `src/styles/global.css`, `public/favicon.svg`, `public/social-card.svg` | Monogramme typographique provisoire ; pas de photo d'équipe ou de client. |

## Contrôles réellement exécutés

- Versions consultées dans les pages NPM et documentations éditeur le 11 octobre 2026 : Astro 7.3.6, adaptateur Node 11.1.7, Tailwind CSS 4.3.3, `@astrojs/check` 0.9.10, TypeScript 6.0.3. Le projet attend Node 22.12+ ; l'environnement présent indique Node 24.14.0.
- Vérification de la structure initiale : le dossier de travail ne contenait aucun projet existant.
- `npm install` a créé le verrouillage ; `npm ls --depth=0` confirme toutes les versions épinglées.
- `npm run check` : 21 fichiers, 0 erreurs, 0 avertissements et 0 hints. La télémétrie Astro a été désactivée pour les commandes de contrôle, car le profil utilisateur Windows n'est pas accessible en écriture dans ce bac à sable.
- `npm run build` et `npm run build:preview` réussissent avec les pages éditoriales pré-générées. Astro signale les collections `trainings` et `experts` vides, ce qui correspond à l'absence volontaire de programmes et de profils validés.
- Mode preview local : accueil, services, Green IT de travail, contact et document de confidentialité répondent 200 ; routes marquées noindex, bandeau visible, numéro masqué. Un brouillon légal interne a été généré.
- Mode public local : routes principales 200 ; `/services/green-it/`, `/confidentialite/` et `/unknown/` répondent 404. Le dossier `dist/client` contient 12 fichiers pour 64 525 octets non compressés, dont 45 804 octets HTML et 17 138 octets CSS ; aucun titre de service brouillon, numéro, lien téléphone/WhatsApp ou nom de variable secrète n'y apparaît. `robots.txt` interdit l'exploration faute de domaine ; le sitemap est vide et aucune canonical n'est émise.
- API de contact en production locale : formulaire invalide 400 ; demande valide sans configuration 503 ; honeypot 400 ; corps de plus de 12 Ko 413 ; origine externe 403 ; cinquième requête encore sous quota puis dépassement 429 ; formulaire HTML natif redirigé vers l'état `unavailable` (303). Aucun e-mail réel n'a été envoyé.
- Mesure de performance, Node v24.14.0 sur Windows en loopback, serveur Node de production, sans limitation réseau : première réponse `/` 77,55 ms ; cinq requêtes suivantes de 2,68 à 6,31 ms, médiane 2,79 ms. Le HTML de l'accueil fait 13 450 octets et le CSS partagé 17 138 octets. Mesure locale uniquement, sans score Lighthouse ni simulation mobile.
- Vérifications structurelles du build : une balise H1 par page, description SEO présente, lien d'évitement présent, seuils CSS tablette/mobile et règle de réduction des animations présents.
- Le contrôle visuel prévu dans le navigateur intégré n'a pas pu être exécuté : l'appel Browser a été refusé deux fois avec `codex/sandbox-state-meta: missing field sandboxPolicy`. L'interaction clavier, les tailles d'écran réelles et le préremplissage en navigateur restent à vérifier.

## À vérifier avant publication

- Les étapes restantes figurent dans [CONTENUS-A-VALIDER.md](./CONTENUS-A-VALIDER.md).
- Les résultats et les contrôles restants figurent dans [PLAN-RECETTE.md](./PLAN-RECETTE.md).
- La réception d'un e-mail, la validation Turnstile, l'indisponibilité Resend et le quota distribué requièrent un service et un hébergement configurés.
- La vérification visuelle et clavier dans un vrai navigateur reste à exécuter.
- La publication du site n'est pas effectuée.
