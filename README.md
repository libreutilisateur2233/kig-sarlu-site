# KIG-SARLU — site vitrine déployable

Site statique (HTML/CSS/JS, sans framework) pour KIG-SARLU. Hébergement prévu : **Netlify**
(gratuit). Gestion des biens et formulaire de contact **sans base de données** :
- Le formulaire de contact est traité par **Netlify Forms** (le serveur de Netlify reçoit
  et stocke chaque message, et vous envoie un e-mail de notification).
- L'ajout/modification/suppression de biens se fait via une interface d'admin
  (**Decap CMS**, accessible sur `/admin`) qui modifie le fichier `content/properties.json`
  sans jamais toucher au code.

## Structure du projet

```
index.html              page d'accueil
merci.html               page affichée après un envoi de formulaire (fallback sans JS)
css/style.css             toute la mise en forme (identique au prototype d'origine)
js/listings.js            charge et affiche les biens depuis content/properties.json
js/main.js                menu mobile, bouton WhatsApp, envoi du formulaire
content/properties.json   catalogue des biens (modifié par l'admin, jamais à la main)
admin/index.html          interface d'admin (Decap CMS)
admin/config.yml          configuration de l'admin (champs du formulaire "bien")
images/                   photos et logo (extraites du prototype d'origine)
netlify.toml              config de déploiement Netlify
```

Le prototype d'origine avait toutes les images encodées en base64 directement dans le HTML
(d'où son poids de 1,5 Mo). Elles ont été extraites en vrais fichiers dans `images/` — le
site charge maintenant en une fraction de ce poids et les images sont mises en cache par le
navigateur.

⚠️ `images/logo.png` fait ~550 Ko pour un logo affiché à 50×50px. Ça fonctionne, mais si vous
avez l'occasion de le ré-exporter en plus petit (ex. 200×200px, compressé) via un outil comme
squoosh.app, le site gagnera en rapidité.

## 1. Tester en local avant de déployer

`index.html` charge `content/properties.json` via `fetch()`, ce qui ne fonctionne pas en
ouvrant simplement le fichier dans le navigateur (`file://`). Il faut un petit serveur local.

Si vous avez Node.js installé :

```bash
npx serve .
```

Sinon, un petit serveur PowerShell est fourni dans le projet (`_devserver.ps1`, ne fait pas
partie du site déployé — vous pouvez le supprimer avant de pousser sur GitHub si vous voulez) :

```powershell
powershell -ExecutionPolicy Bypass -File .\_devserver.ps1
```

Puis ouvrez `http://localhost:8080/`.

## 2. Mettre le code sur GitHub

Netlify se connecte à un dépôt Git pour déployer automatiquement à chaque changement,
et l'interface d'admin (Decap CMS) en a besoin pour enregistrer vos biens.

```bash
cd kig-sarlu-site
git init
git add .
git commit -m "Site KIG-SARLU initial"
```

Créez un dépôt vide sur [github.com/new](https://github.com/new) (ex. `kig-sarlu-site`),
puis :

```bash
git remote add origin https://github.com/<votre-compte>/kig-sarlu-site.git
git branch -M main
git push -u origin main
```

## 3. Déployer sur Netlify

1. Créez un compte sur [app.netlify.com](https://app.netlify.com) (gratuit, "Sign up with GitHub" est le plus simple).
2. **Add new site → Import an existing project → Deploy with GitHub**, choisissez le dépôt `kig-sarlu-site`.
3. Réglages de build : laissez **Build command vide** et **Publish directory = `.`** (déjà configuré dans `netlify.toml`).
4. **Deploy site**. Après ~30 secondes, votre site est en ligne sur une adresse du type
   `https://kig-sarlu-site-xxxx.netlify.app` (vous pourrez la renommer dans
   *Site settings → General → Site details → Change site name*).

## 4. Activer les e-mails du formulaire de contact

Netlify détecte automatiquement le formulaire (`data-netlify="true"` dans `index.html`) au
moment du déploiement — rien à coder. Il ne reste qu'à brancher la notification e-mail :

1. Dans le tableau de bord du site : **Project configuration → Forms → Form notifications**.
2. **Add notification → Email notification**.
3. Adresse e-mail : **goudinoby04@gmail.com**.
4. Enregistrez, puis testez le formulaire sur le site en ligne — vous devez recevoir l'e-mail
   en quelques secondes. Les messages restent aussi consultables dans **Forms** sur Netlify,
   même si l'e-mail arrive en retard ou en spam (à vérifier la première fois).

Le plan gratuit Netlify inclut 100 soumissions de formulaire par mois, largement suffisant
pour démarrer.

## 5. Activer l'interface d'admin (ajout de biens sans toucher au code)

L'admin (`/admin`) utilise **Netlify Identity** (comptes utilisateurs) + **Git Gateway**
(pour que l'admin puisse enregistrer les modifications dans le dépôt Git à votre place).

1. **Project configuration → Identity → Enable Identity**.
2. Toujours dans Identity → **Registration** : passez sur **Invite only** (pour qu'aucun
   inconnu ne puisse créer un compte admin).
3. **Project configuration → Identity → Services → Git Gateway → Enable Git Gateway**.
4. Retour dans l'onglet **Identity → Invite users**, entrez l'adresse e-mail de la personne
   qui gérera les annonces (le gérant de l'agence, par ex. `goudinoby04@gmail.com`).
5. Cette personne reçoit un e-mail d'invitation Netlify, clique sur le lien, choisit un mot
   de passe.
6. Elle peut ensuite se rendre sur `https://<votre-site>.netlify.app/admin`, se connecter, et :
   - cliquer sur **Biens immobiliers → Catalogue des biens**,
   - **Ajouter un bien** à la liste (type, étiquette, titre, description, prix, photo),
   - uploader une photo directement depuis son téléphone/ordinateur,
   - **Publier** — le site se met à jour tout seul en moins d'une minute (Netlify redéploie
     automatiquement à chaque enregistrement depuis l'admin).

Aucune compétence technique requise à partir de cette étape : c'est un formulaire classique.

## 6. Nom de domaine (quand vous serez prêt)

Vous êtes parti·e sur le sous-domaine gratuit `netlify.app` pour l'instant — c'est très bien
pour démarrer. Le jour où vous voudrez un nom comme `kig-sarlu.com` ou `kig-sarlu.gn` :

1. Achetez le domaine chez un registrar (ex. [Namecheap](https://www.namecheap.com),
   [OVH](https://www.ovh.com), [Google Domains]... — quelques euros/an). C'est un achat que
   vous devez faire vous-même avec votre carte.
2. Dans Netlify : **Project configuration → Domain management → Add a domain**, entrez votre
   domaine.
3. Netlify vous donne soit des enregistrements DNS à ajouter chez votre registrar (type `A`
   et `CNAME`), soit propose de reprendre la gestion DNS complète (plus simple). Suivez les
   instructions affichées à l'écran à ce moment-là.
4. Netlify génère automatiquement un certificat HTTPS gratuit (Let's Encrypt) une fois le DNS
   propagé (quelques minutes à quelques heures).

Dites-moi quand vous en serez là si vous voulez de l'aide pour cette étape précise.

## Résumé de ce qui a changé par rapport au prototype

- Images extraites en fichiers séparés (`images/`) au lieu d'être encodées en base64 dans le HTML.
- Biens déplacés de `<script>` vers `content/properties.json`, chargés dynamiquement.
- Formulaire de contact : soumission réelle côté serveur via Netlify Forms (au lieu d'ouvrir
  uniquement WhatsApp/e-mail côté client) — le bouton WhatsApp reste disponible en option rapide.
- Ajout d'une interface d'admin (`/admin`) pour gérer le catalogue de biens sans coder.
- Le texte du footer ("ce site ne collecte aucune donnée") a été corrigé, puisque le
  formulaire transmet désormais réellement les données à Netlify.
