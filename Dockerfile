FROM node:8 as build-env
COPY . /tomoswap/
WORKDIR /tomoswap
RUN npm install && npm run build

FROM node:8-slim
COPY --from=build-env /tomoswap /tomoswap
WORKDIR /tomoswap
EXPOSE 3000
CMD ["npm", "start"]
