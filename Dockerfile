FROM node:8 as build-env
COPY . /yolo/
WORKDIR /yolo
RUN npm install && npm run build

FROM node:8-slim
COPY --from=build-env /yolo /yolo
WORKDIR /yolo
EXPOSE 3000
CMD ["npm", "start"]
