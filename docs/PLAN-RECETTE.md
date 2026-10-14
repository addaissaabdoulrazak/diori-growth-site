# Plan de recette — version du 14 octobre 2026

Configuration actuelle : email désactivé, WhatsApp disponible, aucun domaine publié. Les contrôles réels ci-dessous ne valent pas validation visuelle.

| Contrôle | Action / données | Résultat attendu | Statut |
|---|---|---|---|
| TypeScript | npm.cmd run check | Aucune erreur | Réussi : 24 fichiers, 0 erreur, 0 avertissement |
| Production | npm.cmd run build | Build complet | Réussi |
| Preview | npm.cmd run build:preview | Bandeau et brouillons signalés | Réussi |
| Filtre éditorial | Fiche draft temporaire | Visible seulement en preview, non indexable | Réussi ; fiche retirée après recette |
| Pages | GET routes principales | 200 | Réussi |
| Liens | Résoudre les href locaux | Toutes les cibles présentes | Réussi : 338 liens |
| Structure | Lire le HTML généré | Une H1, langue fr, alt/dimensions images | Réussi : 17 pages, 36 images |
| Image mobile | 390 × 844 puis 320 × 568 | Portrait, titres, cartes et formulaire sans débordement | À faire : aucun navigateur connecté |
| Tablette | 768 × 1024 | Mise en page lisible et menu adapté | À faire |
| Ordinateur | 1440 × 900 | Logo et portraits nets, espacements équilibrés | À faire |
| Clavier | Tab, Entrée, Échap | Focus visible, menu et FAQ opérants | Attributs et code présents ; interaction réelle à faire |
| Formation → demande | Ouvrir le CTA IA | Sujet IA sélectionné | Réussi avec DOM simulé ; navigateur à faire |
| WhatsApp composé | Nom, 8 participants, Hybride, accents et & | Texte encodé vers +22790323133, envoi manuel | Réussi avec DOM simulé, aucune navigation externe |
| Téléphone / WhatsApp | Lire les href | tel:+22790323133 ; wa.me/22790323133 | Réussi ; ouverture d'application non effectuée |
| Email non créé | Scanner pages et scripts | Pas de lien email ; pas d'envoi disponible | Réussi |
| Fausse confirmation | GET /contact/?status=sent | Aucun message de succès | Réussi |
| API entrée invalide | POST email invalide | 400 sans envoi | Réussi |
| API sans accord | POST contactPermission vide | 400 | Réussi |
| API sans configuration | Nom/email valides, contactPermission=yes | 503 sans envoi | Réussi |
| Origine étrangère | Origin https://external.example | 403 | Réussi |
| Honeypot | website=robot | 400 | Réussi |
| Taille | Corps > 12 000 octets | 413 | Réussi |
| Débit | Six demandes depuis même IP | 429 après quota | Réussi |
| 404 | URL inexistante | 404 de marque | Réussi |
| SEO sans domaine | Robots, meta, sitemap, canonical | noindex, sitemap vide, canonical absent | Réussi |
| Confidentialité | Politique et texte près du formulaire | Décrit WhatsApp et email indisponible | Présent ; politique complète requise avant activation email |
| Données non validées | Anciens prix, fausses certifications, email, secrets | Aucun élément indûment publié | Vérifications statiques réussies |
| Performance | Node production, loopback, 12 requêtes | Mesure documentée sans score inventé | Environ 461 Ko publics ; médiane chaude 2,40 ms |
| Réception réelle | Après configuration, destination contrôlée | Acceptation fournisseur puis réception vérifiée | À faire ; boîte et clés absentes |
| Panne Resend | Après configuration, refus / timeout | Erreur sans faux succès | À faire |
| Turnstile | Défi réel sur domaine de recette | Jeton valide requis | À faire |
| Idempotence réelle | Répéter le même envoi de recette | Un seul email dans la fenêtre du prestataire | À faire |

Ne pas publier l'aperçu. Compléter cette recette dans un navigateur disponible et les informations listées dans CONTENUS-A-VALIDER.md avant toute mise en ligne.
