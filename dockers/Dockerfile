FROM node:8

# Create app directory
RUN mkdir -p /tomoswap/
WORKDIR /tomoswap/

ENV PATH /tomoswap/node_modules/.bin:$PATH

# Install NPM
COPY package.json /tomoswap/package.json
RUN npm install --silent && npm cache clean --force

EXPOSE 3000
# start app
WORKDIR /tomoswap/
CMD ["npm", "start"]