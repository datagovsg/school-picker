FROM node:6-slim

WORKDIR /datagovsg-school-picker

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV production

COPY src ./src
COPY public ./public
COPY dist ./dist
COPY node_modules ./node_modules

COPY package.json ./

EXPOSE 8080
CMD ["npm", "start"]
