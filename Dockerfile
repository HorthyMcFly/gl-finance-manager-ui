FROM node:20.11.1 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/*

RUN locale-gen hu_HU.UTF-8
ENV LANG hu_HU.UTF-8
ENV LANGUAGE hu_HU:hu
ENV LC_ALL hu_HU.UTF-8

COPY --from=build app/dist/gl-finance-manager-ui /usr/share/nginx/html

EXPOSE 80