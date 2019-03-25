FROM nginx:1.13.9-alpine

ARG TZ=Asia/Ho_Chi_Minh
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /etc/nginx/sites-enabled/*

ADD dockers/web.nginx.conf /etc/nginx/nginx.conf
ADD dockers/conf.d/web.conf /etc/nginx/sites-enabled/site.conf
ADD dockers/ssl /etc/nginx/ssl

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]