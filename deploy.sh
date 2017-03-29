cd java-server
./build.sh
cd ..
heroku deploy:jar java-server/build/libs/rmnp-camping-backend-0.1.0.jar --app rmnp-camping
