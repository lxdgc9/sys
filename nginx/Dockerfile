FROM nginx:alpine

RUN rm /etc/nginx/nginx.conf

COPY ssl/ /home/ssl/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443