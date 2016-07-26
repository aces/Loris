FROM ubuntu:14.04
MAINTAINER Dave MacFarlane <david.macfarlane2@mcgill.ca>
# Stock images come without apt archive -- needs an update
RUN apt-get -qqq update
RUN apt-get -y install php5 php5-json curl git php5-mysql mysql-client
# Eventually remove this.
RUN apt-get -y install php-pear
#RUN git clone https://github.com/aces/Loris.git /var/www/loris
#INCLUDE HOSTNAME REPLACEMENT?
COPY . /var/www/loris

RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer
RUN COMPOSER_HOME=/var/www/loris
RUN cd /var/www/loris && composer install --no-dev
WORKDIR /var/www/loris
RUN mkdir project
RUN sed -e "s#%LORISROOT%#/var/www/loris/#g" \
        -e "s#%PROJECTNAME%#loris#g" \
        -e "s#%LOGDIRECTORY%#/var/log/apache2/#g" \
        < docs/config/apache2-site > /etc/apache2/sites-available/loris.conf
RUN a2dissite 000-default
RUN ls /etc/apache2/sites-available
RUN ls /etc/apache2/sites-enabled
RUN a2ensite loris
RUN mkdir smarty/templates_c
RUN chmod 777 smarty/templates_c

ENV LORIS_SQL_DB=LorisDB
ENV LORIS_SQL_HOST=mysql
ENV LORIS_SQL_USER=loris
ENV LORIS_SQL_PASSWORD=
ENV LORIS_BASEURL=

EXPOSE 80
VOLUME ["/var/www/loris/project", "/var/log/apache2", "/var/lib/php5"]

ADD docs/Docker/LorisWeb-EntryPoint.sh /entrypoint.sh
CMD ["apache2ctl", "-D", "FOREGROUND"]
ENTRYPOINT ["/entrypoint.sh"]
