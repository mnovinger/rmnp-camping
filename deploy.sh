#git subtree push --prefix client  heroku-frontend master
#heroku deploy:jar java-server/build/libs/rmnp-camping-backend-0.1.0.jar --app rmnp-camping-backend
git subtree push --prefix java-server  heroku-backend master
heroku logs -t --app rmnp-camping-backend
