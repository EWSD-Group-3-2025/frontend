FROM node:23-alpine AS build

# Install pnpm manually
RUN npm install -g pnpm

# Rest of the Dockerfile remains the same
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 9999
CMD ["nginx", "-g", "daemon off;"]