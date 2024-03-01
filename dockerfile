FROM  node:20.9.0-alpine3.18 AS  base

ENV DIR /project
WORKDIR $DIR


FROM base AS dev

ENV NODE_ENV=development

COPY package*.json $DIR
RUN npm install
COPY tsconfig*.json $DIR
COPY src $DIR/src

EXPOSE $PORT
CMD ["npm", "run", "start:dev"]





FROM base AS build

RUN apk update && apk add --no-cache dumb-init

COPY package*.json $DIR
COPY tsconfig*.json $DIR
COPY src $DIR/src

RUN npm run build && \
    npm prune --production


