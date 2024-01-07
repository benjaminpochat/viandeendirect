FROM maven:3.9.2

RUN chmod -R a+rwx /usr/share/maven

RUN useradd --create-home viandeendirect

WORKDIR /home/viandeendirect

COPY ./backend/pom.xml ./backend/pom.xml
COPY ./backend/gen/pom.xml ./backend/gen/pom.xml
COPY ./backend/app/pom.xml ./backend/app/pom.xml
COPY ./backend/model/pom.xml ./backend/model/pom.xml

RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f ./backend/pom.xml dependency:go-offline

COPY ./backend/gen/src ./backend/gen/src
COPY ./backend/app/src ./backend/app/src
COPY ./backend/model/src ./backend/model/src

RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f ./backend/pom.xml clean install

USER viandeendirect

ENTRYPOINT java -jar ./backend/app/target/viandeendirect-backend-app.jar
