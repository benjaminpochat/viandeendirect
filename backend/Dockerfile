FROM maven:3.9.0-eclipse-temurin-17

RUN chmod -R a+rwx /usr/share/maven

RUN useradd --create-home viandeendirect

WORKDIR /home/viandeendirect

COPY ./backend/pom.xml ./backend/pom.xml

RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f ./backend/pom.xml dependency:go-offline

COPY ./backend ./backend
COPY ./openapi ./openapi

RUN mvn clean install spring-boot:repackage -s /usr/share/maven/ref/settings-docker.xml -f ./backend/pom.xml

USER viandeendirect

ENTRYPOINT java -jar ./backend/target/viandeendirect-backend.jar
