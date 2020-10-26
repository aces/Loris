# Web configuration

## Security: Enabling SSL

*Note: SSL is not fully supported for the Data Querying Tool. Individual Loris instances should set up their own SSL for their couchApp hosting.*

###Enable SSL module in apache
`sudo a2enmod ssl`

## Edit `/etc/apache2/sites-available/<project-name>`
VirtualHost port: change to *:443 (ssl) instead of *:80 (http)
Verify: SSL Engine On
SSL certificate: ensure that you have an SSL certificate (contact us if you have questions)

## Restart Apache
`sudo /etc/init.d/apache2 restart`