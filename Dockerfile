FROM openjdk:8

# assumes the client is already built
COPY ./java-server/ /usr/src/myapp/
COPY ./client/public/* /usr/src/myapp/java-server/src/main/resources/static/
WORKDIR /usr/src/myapp/
RUN ./gradlew build

EXPOSE 8080
CMD PORT=8080 java -jar ./deploy/rmnp-camping-backend-0.1.0.jar
