# Rapport de mise à jour — DIORI GROWTH

Date : 14 octobre 2026. Travail local, sans publication.

## Objectif et résultat

Compléter la V1 à partir du PDF de trois pages, des affiches et brochures, des logos, des portraits et du message légal transmis. Les contenus provisoires ont été remplacés lorsqu'une source était disponible. Les réserves et les arbitrages sont consignés dans [CONTENUS-A-VALIDER.md](CONTENUS-A-VALIDER.md).

| Fonction | Résultat | Fichiers principaux |
|---|---|---|
| Identité et contact | Nom, slogan, téléphone/WhatsApp, Dar es Salam, Niamey, Niger, RCCM et représentant intégrés | src/config/site.ts |
| Direction visuelle | Logos originaux, monogramme DI dans le bandeau, portrait dans la présentation sur fond clair, second portrait dans À propos | src/assets, Brand.astro, index.astro, a-propos.astro, global.css |
| Services | Formation, commercial, IA, Green IT, experts et séminaires | src/content/services |
| Programmes | Expert Series, Corporate Training, Executive Seminar | Programs.astro |
| Catalogue | Deux fiches avec objectifs, publics, programmes détaillés et référence aux supports passés | src/content/trainings, pages/formations |
| Experts | Sarra Sassi Hamada et Adda Issa Abdoul Razak, biographies, domaines et affiches de leurs masterclass | src/content/experts, pages/experts, src/assets |
| Contact | Message WhatsApp préparé depuis le formulaire ; téléphone direct ; email masqué | ContactForm.astro, ContactDetails.astro |
| Mentions et données | Identité légale connue et description du traitement actuellement disponible | pages/documents/[slug].astro |
| API future | Validation, antispam, limite de débit, idempotence, confirmation après acceptation du fournisseur | pages/api/contact.ts |
| Référencement | Titres, descriptions, favicon DG, image de partage de marque ; indexation bloquée tant que le domaine manque | SiteLayout.astro, public, robots/sitemap |
| Documentation | Configuration actualisée, traçabilité et recette | README.md, .env.example, docs |

## Choix et corrections

### Ajustement après retour visuel du commanditaire

Le portrait à fond noir a été déplacé du bandeau bleu marine vers la section de présentation du cabinet, sur fond ivoire. Le monogramme « DI » occupe de nouveau le visuel du bandeau. Le nom et la fonction sont placés sous le portrait dans un cartouche clair, sans superposition. Le portrait conserve son fichier original et se charge désormais en différé.

Les deux affiches choisies par le commanditaire sont ajoutées aux fiches d'experts : Executive Masterclass IA pour Adda Issa Abdoul Razak et Expert Series Finance & Gestion pour Sarra Sassi Hamada. Elles sont affichées intégralement, optimisées en WebP, chargées en différé et accessibles en taille originale dans un nouvel onglet. Une mention « Archive · 2026 » et une note sur les dates et tarifs historiques accompagnent les visuels. L'affiche finance retenue porte le 12 août ; sa reproduction ne résout pas la contradiction des documents antérieurs et ne confirme pas la tenue effective de l'événement.

L'association entre expert, affiche et fiche de programme est gérée dans le champ optionnel masterclass de la collection experts. Les initiales restent disponibles pour les futurs profils sans affiche.

- La structure Astro existante est conservée. Les pages restent prégénérées et le formulaire email est une route Node.
- Les originaux sont conservés dans src/assets ; Astro produit des variantes WebP adaptées aux écrans. Les affiches anciennes sont présentées comme archives.
- L'email reste désactivé car la boîte n'est pas créée. Les visiteurs peuvent préparer leur demande sur WhatsApp et choisissent eux-mêmes de l'envoyer. Aucun message n'a été envoyé pendant les contrôles.
- Les profils des deux intervenants sont utilisés après autorisation explicite reçue du commanditaire. Pas de portrait extrait des affiches ni de certification publiée.
- Le corps Markdown des formations est désormais affiché. Les données pédagogiques inconnues sont facultatives et masquées.
- Les badges « à valider » sont réservés aux contenus draft ; les profils sont visibles aussi dans l'aperçu.
- Le paramètre ?status=sent n'affiche plus de faux succès. Une réponse HTML sans JavaScript est rendue directement par l'API selon son résultat réel.
- Le contrôle HTTP a révélé une origine locale non reconnue par la configuration Astro. La liste explicite des hôtes locaux, ou du domaine configuré, corrige ce problème en maintenant la vérification d'origine.
- Les fichiers temporaires d'analyse PDF et de recette sont exclus de Git et du périmètre TypeScript.

## Contrôles réalisés

- Astro check : **24 fichiers, 0 erreur, 0 avertissement, 0 indication**.
- Builds production et preview réussis.
- 17 pages HTML : H1 unique, langue française, noindex dans la configuration actuelle.
- 338 liens internes : cibles présentes ; 36 éléments image : attributs alt et dimensions.
- Routes principales servies en HTTP 200, route inexistante en 404.
- Email inactif, anciens tarifs et noms de secrets serveur absents des pages publiques.
- Formulaire non activé : script Turnstile externe absent.
- API : origine étrangère 403, email invalide 400, honeypot 400, corps trop grand 413, accord absent 400, configuration absente 503, quota dépassé 429.
- Script client exécuté avec DOM simulé : formation préremplie, message WhatsApp encodé avec accents et caractères spéciaux, aucune requête email et aucun faux succès. Aucun appel vers WhatsApp n'a été effectué.
- Une fiche draft temporaire apparaît avec son badge et noindex en preview, puis disparaît du build public. La fiche de recette a été retirée des sources.
- Mesure locale Windows / Node 24.14.0, serveur de production sur 127.0.0.1 : environ **461 Ko de fichiers publics**, sans compression de transfert ; médiane chaude **2,40 ms** sur 10 requêtes HTTP après deux échauffements. Ce résultat mesure le serveur en boucle locale, pas le rendu navigateur ni un réseau mobile.

## Limites de vérification

L'outil de navigateur a répondu « Browser is not available: iab » et l'inventaire des navigateurs était vide. **Aucune vérification visuelle ni interaction clavier réelle n'est donc déclarée réussie.** Le responsive, le focus, les contrastes et la navigation doivent être examinés sur mobile, tablette et ordinateur.

La réception email, le défi Turnstile, la panne du prestataire et l'idempotence réelle Resend restent à tester après configuration. Une acceptation Resend n'est pas une preuve de réception en boîte. La limitation en mémoire doit être complétée au niveau de l'hébergement pour un déploiement multi-instance.

## Ce qui reste avant publication

Créer la boîte email si cette voie de contact est souhaitée ; choisir l'hébergement ; compléter les informations juridiques manquantes et la politique de données ; confirmer le domaine ; effectuer la recette visuelle. La publication reste une action distincte à demander explicitement.

L'historique de la première V1 est conservé dans RAPPORT-V1.md. Le présent rapport décrit la version actualisée.

### Retouche de l'affiche IA — suppression de la date et du prix

À la demande du commanditaire, le bloc « 03 au 04 octobre » et le tarif « 79.000 FCFA », avec leurs éléments de présentation, ont été retirés de l'affiche IA via l'outil intégré ImageGen. Le fichier original est conservé ; la carte et son lien d'agrandissement utilisent désormais `src/assets/masterclass-ia-performance-sans-date-tarif.png`. Le résultat a été inspecté visuellement comme image. Le visuel finance reste inchangé.

Mode : outil intégré ImageGen, édition d'une image fournie. Consigne exacte :

```text
Use case: precise-object-edit.
Asset type: existing DIORI GROWTH Executive Masterclass poster used on a website.
Input image: edit target, the supplied original poster (761 x 1080 portrait composition).
Make ONLY these two local removals:
1. Remove the date text "03 au 04 octobre" and its small calendar icon in the lower-left area, approximately x 88–334, y 698–746.
2. Remove the entire price label "Tarifs :" and "79.000 Fcfa" in the lower-left area, approximately x 87–289, y 804–879.
Reconstruct the dark blue/teal background and existing subtle perspective grid naturally in the cleared regions. Do not add replacement words, dates, prices, or graphics.
Preserve all other pixels and layout as closely as possible: both men's exact faces, identities, poses and suits, robot hands, bulb, original logo, all titles, every other text, phone number, name, footer, colors, composition, image edges and original aspect ratio. In particular, KEEP the yellow "Lieu: Zoom ... à:10H GMT" strip between the removed areas unchanged. Keep the full poster uncropped. No redesign, no new content, no global retouching. Opaque output.
```


