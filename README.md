# TechAGram

## Deployment
1. Dockerise
    - Create a Dockerfile
    ``` 
    FROM node:20-slim AS builder
    WORKDIR /app


    COPY package.json package-lock.json* ./
    RUN npm ci --no-audit --no-fund

    COPY . .

    ENV MONGODB_URI="mongodb://placeholder-for-build"
    ENV NEXTAUTH_SECRET="placeholder-for-build"

    RUN npm run build

    FROM node:20-slim AS runner
    WORKDIR /app
    ENV NODE_ENV=production

    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public

    EXPOSE 3000

    CMD ["npm", "start"]
    ```
    - Create a .dockerignore to keep docker image small
    ```
    Dockerfile
    .dockerignore
    node_modules
    npm-debug.log
    README.md
    .git
    .next
    dist
    .env
    .vscode
    .idea
    *.log
    *.tsbuildinfo
    coverage
    .gitignore
    .env.local
    .env.development
    .env.production
    .env.testing
    .DS_Store
    .cache
    *.pem
    *.crt
    *.key
    *.swp
    *.swo
    *.bak
    ```
    - Now build and run docker image to test this on your local machine(here we pass env at runtime)
    ```
    docker build -t myapp:latest .
    docker ps
    docker run -d -p 3000:3000 --env-file .env.local --name myapp-container myapp:latest
    ```
    - for windows we will be needing docker desktop which creates a linux hyperviser layer on your windows

    - Now deploy your image on docker hub and so create a repository there
    ```
    docker tag myapp:latest yourdockerhubusername/myapp:latest
    docker login
    docker push yourdockerhubusername/reponame:tagname
    docker pull yourdockerhubusername/reponame:tagname
    ```
2. Deployment on Azure VM(can use student credits)
    - First we have to setup our vm on azure
    - 
