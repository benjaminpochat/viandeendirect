FROM node:20.2.0-slim as build

RUN npm set progress=false
RUN apt update
RUN apt install --assume-yes default-jdk
RUN npm install @openapitools/openapi-generator-cli@2.6.0 -g

COPY ./frontend /frontend
COPY ./openapi /openapi
WORKDIR /frontend/app

#ARG REACT_APP_FRONTEND_URL
#ENV REACT_APP_FRONTEND_URL=${REACT_APP_FRONTEND_URL}
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
#ARG REACT_APP_IDENTITY_URL
#ENV REACT_APP_IDENTITY_URL=${REACT_APP_IDENTITY_URL}

RUN npm run generate:api
RUN npm run build:api
RUN npm run install:api
RUN npm run build

FROM httpd:2.4.57

RUN rm /usr/local/apache2/htdocs/index.html
COPY ./frontend/viandeendirect-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build /frontend/app/build /usr/local/apache2/htdocs/
