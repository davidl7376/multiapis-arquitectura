# Etapa 1: construir la app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear archivo de configuración para Azure
RUN echo "WEBSITES_PORT=80" > /etc/nginx/azure_port.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]