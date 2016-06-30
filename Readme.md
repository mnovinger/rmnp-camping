## rmnp-camping
#### App to parse the Rocky Mountain National Park Wilderness Office campsite availability pdf

#### to push to heroku: 
1. git subtree push --prefix client  heroku master
#### to run web app
1. cd client
2. npm run dev or npm webpack && npm start
#### to run the pdf parse
1. cd server
2. node src/parse-with-java.js