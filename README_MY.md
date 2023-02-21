# Novi backend 2023 februar 18.
- Od 2023 februar 18. ne koristimo json-server pa se folder json-server-db moze ignorisati.
- takodje se ne koristi heroku jer je heroku prestao da hostuje json-server.
- Novi backend se sada nalazi na hostingu u folderu https://socialapp.bojangolic.com/api
a lokalna kopija tih fajlova od backenda se nalazi ovde u folderu json-server-php-backend.


# HOW TO START json-server backend
// https://www.npmjs.com/package/json-server#alternative-port
You must be in folder \social-app\json-server-db 
Then type:

json-server --watch db.json --port 3033


Then check in your browser, for example:
http://localhost:3033/posts


## Beleske za kacenje json-server backenda na heroku

https://dashboard.heroku.com/apps/social-json-backend/deploy/heroku-git

https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli

npm install -g heroku

heroku --version

heroku git:remote -a social-json-backend

git add .
commit -am "make it better"
git push heroku main

// PRORADILO IZ PRVE!
Adresa za proveru https://social-json-backend.herokuapp.com

## Kad se izmeni verzija da se nova verzija pojavi na heroku

git status
git add .
git commit -m "new version"
git push
git status

git add .
commit -am "make it better"
git push heroku main

// PRORDAIO I OVAJ UPDATE IZ PRVE!
// Takodje je proradio na hotgatoru frontend povezan sa heroku backendom
Adresa za proveru http://socialapp.bojangolic.com/
