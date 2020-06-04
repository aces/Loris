## Quick install for Developer in Ubuntu
```
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
 sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
 sudo apt-get update
 sudo apt-get -y install docker-ce
 sudo docker run hello-world
 sudo apt install docker-compose
 sudo docker-compose build
 sudo apt install npm
 sudo composer install
 sudo npm run tests:integration
```
Make sure to get lastest version of docker-compose (1.22.0 or higher)
