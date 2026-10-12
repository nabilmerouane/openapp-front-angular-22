# Étape de build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape de service (nginx)
FROM nginx:alpine
COPY --from=build /app/dist/demo-angular-22-v1/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80