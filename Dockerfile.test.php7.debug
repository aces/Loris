FROM php:7.0

RUN apt-get update && \
    apt-get install -y mysql-client zlib1g-dev

RUN yes | pecl install xdebug-2.4.1
RUN echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" > /usr/local/etc/php/conf.d/xdebug.ini
RUN echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/xdebug.ini
RUN echo "xdebug.remote_autostart=on" >> /usr/local/etc/php/conf.d/xdebug.ini

# Install extensions through the scripts the container provides
RUN docker-php-ext-install pdo_mysql zip
