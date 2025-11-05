

# Mon Vieux Grimoire
Back-end du site de notation de livres.
Le site permet d'ajouter un livre et de le noter.

## Technologies utilisées
- Node.js
- Express
- MongoDB

## Installation
1. Cloner le dépôt :  
- git clone https://github.com/ppxt-code/mon-vieux-grimoire-backend.git
- cd mon-vieux-grimoire-backend

2. Installer les dépendances :  
npm install

3. Lancer l'application :  
node server     ou      nodemon server

## Structure du projet
- models : modèles mongoose de User et Book 
- controllers : controllers de User et Book 
- middleware : auth (authentification JWT avec jsonwebtoken), multer-config (telechargement des fichiers avec multer)
- routes : routes utilisées pour la gestion de User et Book
- utilities : utilitaire pour verifier le texte en entrée
- images : images converties en .webp avec sharp

## Routes 
 - POST /api/auth/signup : ajout de l'utilisateur à la base de données. 
 corps de la requete { email: string, password: string }
 - POST /api/auth/login : connection de l'utilisateur. 
  corps de la requete { email: string, password: string }
 - GET /api/books : renvoie un tableau de tous les livres de la base de  données.
 - GET /api/books/:id : renvoie le livre avec l’_id fourni.
 - GET /api/books/bestrating : renvoie un tableau des 3 livres ayant la meilleure note moyenne.
 - POST /api/books : après authentification enregistre le livre dans la base de données. 
  corps de la requete { book: string, image: file }
 - PUT /api/books/:id : après authentification met à jour le livre avec l'_id fourni.
corps de la requete Book as JSON
ou                  { book: string, image: file }
 - DELETE /api/books/:id : après authentification supprime le livre avec l'_id fourni ainsi que l’image
 associée.
 - POST /api/books/:id/rating  : après authentification définit la note du livre retourne le livre.
 corps de la requete  { userId: String, rating: Number }
