FROM nginx
USER root

RUN mkdir /app
COPY ./nginx.config /etc/nginx/conf.d/default.conf
COPY ./dist/ /usr/share/nginx/html/
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]