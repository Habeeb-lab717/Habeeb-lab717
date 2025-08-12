FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
RUN npm run build || true
EXPOSE 5173
CMD ["npm", "run", "dev"]
