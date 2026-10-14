# Ajouter une formation

1. Créer un fichier Markdown dans `src/content/trainings/`.
2. Renseigner les champs validés :

```yaml
---
title: Titre du programme
objective: Objectif confirmé
audience: [Public concerné]
format: [Présentiel]
approvalStatus: draft
---
## Programme
Contenu pédagogique validé.
```

3. Ajouter seulement si connus : `prerequisites`, `duration`, `assessment`, `trainer` et `reference`. Les champs absents sont masqués. Le programme Markdown est rendu dans la fiche.
4. Pour un programme historique, expliquer son contexte dans `reference`. Ne pas transformer une date passée en annonce de session à venir.
5. Laisser `draft` jusqu'à validation. `dev:preview` montre les brouillons signalés ; le build public les exclut.
6. Après validation documentée, passer à `approved`, puis contrôler la fiche et le préremplissage de la demande.

Les profils se gèrent dans `src/content/experts/`. Le champ `trainer` doit correspondre exactement au nom d'un profil approuvé pour afficher un lien vers lui. Confirmer sa disponibilité pour chaque nouvelle mission.

Les prestations d'entreprise sont sur devis. Un prix de session ne doit être affiché qu'avec une édition et des conditions actuelles confirmées. Ne pas inventer de prérequis, durée, évaluation ou certification.
