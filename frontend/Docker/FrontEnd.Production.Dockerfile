FROM node:12.2.0-alpine as build
WORKDIR /app
RUN apk add --no-cache git
ENV PATH /app/node_modules/.bin:$PATH
COPY ./src /app/src
COPY ./public /app/public
COPY ./package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm run build


# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80:8085
CMD ["nginx", "-g", "daemon off;"]