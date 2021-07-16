FROM php:8.0.1-apache


COPY ./docs/config/apache2-site /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's#%LORISROOT%#/var/www/html#g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's#%LOGDIRECTORY%#./#g' /etc/apache2/sites-available/000-default.conf

RUN touch ./loris-error.log


RUN apt-get update && \
    apt-get install -y mariadb-client libzip-dev
RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install zip


#bulid download folders
RUN mkdir ./data
RUN mkdir ./data/document_repository_uploads/
RUN mkdir ./data/data_release_uploads/
RUN mkdir ./data/publication_uploads/
RUN mkdir ./data/publication_uploads/to_be_deleted/
RUN mkdir ./data/test/
RUN mkdir ./data/issue_tracker/

RUN  a2enmod rewrite
RUN  service apache2 restart
