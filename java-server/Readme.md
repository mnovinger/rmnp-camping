#### The Java server back end to the RMNP availability site
### To run from gradle (hot swapping)
1. gradle bootRun

### To compile and run just the java server
1. ./gradlew build
2.  PORT=8080 java -jar ./build/libs/rmnp-camping-1.1.jar

#### To compile, build the java server and run the client (served from the java server)
1. ./build-all.sh
2. PORT=8080 java -jar ./deploy/rmnp-camping-backend-0.1.0.jar
