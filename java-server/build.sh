cd ../client
npm run build
cp -r public/* ../java-server/src/main/resources/static/
cd ../java-server
./gradlew bootRun
#./gradlew build && cp ./build/libs/rmnp-camping-backend-0.1.0.jar ./deploy
