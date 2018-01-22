FROM node:6-slim

WORKDIR /osrm

COPY package.json ./

RUN npm install

RUN mkdir config
COPY config/singapore.osm.pbf config/

COPY config/custom.lua node_modules/osrm/profiles/
RUN node_modules/osrm/lib/binding/osrm-extract config/singapore.osm.pbf -p node_modules/osrm/profiles/custom.lua
RUN node_modules/osrm/lib/binding/osrm-contract config/singapore.osrm

COPY data/ data/
COPY server.js ./

EXPOSE 5000
CMD ["npm", "start"]
