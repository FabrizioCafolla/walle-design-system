ARG NODE_VERSION=22-bullseye

FROM mcr.microsoft.com/devcontainers/javascript-node:$NODE_VERSION

WORKDIR /app

COPY lib/website/package.json lib/website/yarn.lock ./lib/website/

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4321

USER node

CMD ["yarn", "dev"]