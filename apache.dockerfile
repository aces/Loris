FROM php:8.0.1-apache


# copy source code into /var/www/html/
COPY . /var/www/html/

COPY ./docs/config/apache2-site /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's#%LORISROOT%#/var/www/html#g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's#%LOGDIRECTORY%#./#g' /etc/apache2/sites-available/000-default.conf

RUN touch ./loris-error.log


RUN apt-get update && \
    apt-get install -y mariadb-client libzip-dev
RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install zip


RUN  a2enmod rewrite
RUN  service apache2 restart
