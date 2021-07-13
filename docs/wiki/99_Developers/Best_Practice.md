# Best Practice

### Enable SSL module in apache
`sudo a2enmod ssl`

### Edit `/etc/apache2/sites-available/<project-name>`
VirtualHost port: change to *:443 (ssl) instead of *:80 (http)
Verify: SSL Engine On
SSL certificate: ensure that you have an SSL certificate (contact us if you have questions)