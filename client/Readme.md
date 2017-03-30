#### rmnp-camping client app

#### to install
1. `npm install`
2. `npm run webpack`
3. `cp ./public/* ../java-server/src/main/resources/static`

#### to develop using local node proxy server
1. start the java server - 
    1. `cd ../java-server/`
    2. `PORT=8080 java -jar ./deploy/rmnp-camping-backend-0.1.0.jar`
2. webpack and run local proxy
    1. `npm run dev`
