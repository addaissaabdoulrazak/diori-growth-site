# DIORI GROWTH — site professionnel

Version locale complétée le 14 octobre 2026 avec le cahier de contenu, les visuels et les informations légales transmis par le propriétaire. **Aucune publication n'a été effectuée.**

## Contenu intégré

- Identité DIORI GROWTH, slogan « Grandir. Performer. Transformer. », logos et portraits originaux de Malik.
- Implantation : Dar es Salam, Niamey, Niger ; zone actuelle d'intervention : Niger.
- Téléphone et WhatsApp : +227 90 32 31 33.
- Six services, trois programmes, deux descriptifs de formation et deux profils d'experts autorisés avec les affiches de leurs masterclass.
- Informations légales : registre du commerce NE-NIM-01-2026-A10-03969 ; représentant ALI DIORI Abdoul Malik, directeur général.
- Prestations d'entreprise sur devis. Aucune prochaine session ou certification inventée.

**La boîte contact@diorigrowth.com reste à créer**, confirmé par le commanditaire. Elle est masquée sur les pages. Le formulaire prépare un message WhatsApp que le visiteur relit et envoie lui-même. Aucune donnée saisie n'est enregistrée par le site dans ce mode.

Les tarifs et dates des affiches de 2026 ne constituent pas des offres actuelles. Les programmes IA et finance sont présentés comme descriptifs de référence.

## Installation et aperçu

Node.js >= 22.12. Sous PowerShell, utiliser `npm.cmd` si l'exécution de `npm.ps1` est bloquée.

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm.cmd ci
npm.cmd run dev:preview
```

Ouvrir l'adresse locale affichée. Le mode preview montre les contenus `draft` avec leur statut et affiche un bandeau de travail. Il n'assure pas une authentification : le conserver sur la machine locale.

Pour la version destinée à une future publication :

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

Sans domaine configuré, toutes les pages restent en `noindex`, robots bloque l'indexation et le sitemap est vide. `npm.cmd run start` lance le serveur Node construit. Copier `.env.example` vers `.env` uniquement lorsque la configuration doit être renseignée.

## Architecture

Astro et TypeScript strict, Tailwind CSS via Vite, pages éditoriales prégénérées et endpoint Node `POST /api/contact`. Les versions et le verrouillage existants sont conservés.

- `src/config/site.ts` : identité, coordonnées, conditions d'activation et domaine.
- `src/content/` : services, formations, experts en Markdown avec statut `draft` ou `approved`.
- `src/assets/` : logos et portraits fournis, optimisés par Astro en WebP et tailles adaptées.
- `src/components/` : identité visuelle, programmes, contact, menu et footer.
- `src/pages/` : pages, fiches et API.
- `docs/` : traçabilité, éléments restants et recette.

Les fichiers sources PDF et brochures ne sont pas exposés publiquement. Aucun logo client, témoignage, partenaire technique DEEE ou agrément non justifié n'est ajouté. Les ressources éditoriales pourront être ajoutées comme une collection dédiée lorsque des articles validés seront disponibles ; aucun blog vide n'est affiché.

## Formulaire : WhatsApp aujourd'hui, email après configuration

Le bouton actuel ouvre WhatsApp avec un message composé des champs saisis. Le visiteur doit confirmer l'envoi dans WhatsApp. Sans JavaScript, les liens directs téléphone et WhatsApp restent disponibles.

Pour activer ultérieurement l'envoi par email :

1. Créer et vérifier la réception de `contact@diorigrowth.com`, puis définir `PUBLIC_CONTACT_EMAIL_CONFIRMED=true`.
2. Compléter la politique de confidentialité : conservation, destinataires, prestataires, transferts et droits selon l'organisation réellement retenue. Définir `PUBLIC_PRIVACY_POLICY_URL` et `PUBLIC_PRIVACY_POLICY_APPROVED=true`.
3. Configurer le domaine canonique HTTPS dans `PUBLIC_SITE_URL` (dans `.env` ou l'environnement de build). Le serveur utilise cette adresse pour les domaines de confiance ; sans domaine il autorise uniquement localhost et 127.0.0.1.
4. Configurer Resend : `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` et domaine expéditeur vérifié.
5. Configurer Turnstile : `PUBLIC_TURNSTILE_SITE_KEY` et `TURNSTILE_SECRET_KEY`.
6. Activer explicitement `PUBLIC_CONTACT_FORM_ENABLED=true` au build et `CONTACT_SEND_ENABLED=true` au runtime. Le mode preview interdit toujours l'email.
7. Reconstruire et tester sur une destination de recette contrôlée, avant toute mise en service.

L'API valide les champs, l'accord de recontact, les offres autorisées, l'origine, un honeypot, la taille maximale de 12 Ko, le débit (5 demandes/15 min/IP) et le défi Turnstile. Elle exige une réponse d'acceptation avec identifiant Resend avant d'annoncer un succès. Cette acceptation ne prouve pas la livraison dans la boîte.

Une empreinte du message sert de clé d'idempotence : Resend évite les doubles envois du même contenu pendant sa fenêtre de 24 h. La limite de débit locale reste en mémoire et n'est pas partagée entre instances. En production, compléter au niveau du proxy et faire supprimer/réécrire les en-têtes d'origine et d'IP transmis par les clients.

Références techniques : [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys) et [domaines autorisés Astro](https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains).

## Déploiement futur

Le propriétaire doit demander explicitement la publication. L'hébergement devra exécuter Node, fournir HTTPS et permettre les requêtes sortantes vers Resend et Cloudflare. Déployer `dist/` avec les variables serveur ; ne jamais exposer `.env`, `.local-tools/` ou `tmp/`. Les variables commençant par `PUBLIC_` sont publiques et fixées au build.

Vérifier les tarifs de l'hébergement, du domaine et des services lors de la souscription. Aucun abonnement, compte, paiement ou déploiement n'est créé par ce travail. Une évolution vers un CMS unique est possible si le propriétaire souhaite éditer sans développeur.

Voir [les éléments restants](docs/CONTENUS-A-VALIDER.md), [le rapport de mise à jour](docs/RAPPORT-MISE-A-JOUR.md) et [la recette](docs/PLAN-RECETTE.md).
