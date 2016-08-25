 if [ -z "$1" ]
   then
    echo "No commit message supplied"
    exit 1
fi
cd client
./build.sh
cd ..
cd java-server
./build.sh
cd ..
git add .
git commit -m "${1}"
git subtree push --prefix client  heroku-frontend master
git subtree push --prefix java-server  heroku-backend master
#heroku logs -t --app rmnp-camping-backend
