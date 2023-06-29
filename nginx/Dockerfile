FROM nginx:alpine

RUN rm /etc/nginx/nginx.conf

COPY ./ssl/ /home/ssl/
COPY ./landing-client/ /var/www/domain/html
COPY ./mime.types /etc/nginx/mime.types

RUN chown -R 755 /var/www/domain/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443