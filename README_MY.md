

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
Adresa za proveru https://social-json-backend.herokuapp.com/







