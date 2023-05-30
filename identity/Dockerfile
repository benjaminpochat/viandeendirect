FROM maven:3.9.2 as builder

COPY ./identity/eventlistener /usr/local/eventlistener
WORKDIR /usr/local/eventlistener
RUN mvn clean install

FROM quay.io/keycloak/keycloak:21.0.1
COPY --from=builder /usr/local/eventlistener/target/identity-eventlistener-1.0-SNAPSHOT.jar /opt/keycloak/providers
ADD ./identity/theme/src/main/resources/themes /opt/keycloak/themes

RUN sh /opt/keycloak/bin/kc.sh build