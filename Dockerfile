FROM node:20.11.1 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build app/dist/gl-finance-manager-ui /usr/share/nginx/html

EXPOSE 80