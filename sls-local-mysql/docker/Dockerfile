FROM mysql:5.7

ENV MYSQL_DATABASE=test \
    MYSQL_ROOT_PASSWORD=password

COPY ./database-setup.sql /docker-entrypoint-initdb.d/