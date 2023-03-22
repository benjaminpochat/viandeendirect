FROM maven:3.9.0-eclipse-temurin-17

RUN apt-get update

RUN chmod -R a+rwx /usr/share/maven

RUN useradd --create-home viandeendirect

WORKDIR /home/viandeendirect

COPY ./back/pom.xml ./back/pom.xml

RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f ./back/pom.xml dependency:go-offline

COPY ./back ./back
COPY ./openapi ./openapi

RUN mvn clean install spring-boot:repackage -s /usr/share/maven/ref/settings-docker.xml -f ./back/pom.xml

USER viandeendirect

ENTRYPOINT java -jar ./back/target/viandeendirect-back.jar
