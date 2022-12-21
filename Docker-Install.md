# Using Docker to install Loris
A pretty simplified Docker Compose workflow that sets up a LAMP network of containers for local Loris development and deployment. 

## Usage

To get started, make sure you have [Docker installed](https://docs.docker.com/docker-for-mac/install/) on your system, and then clone Loris repository.

Next, navigate in your terminal to the directory you cloned Loris, and spin up the containers for the web server by running 
1. `make docker-install`                                   - install Loris dependencies and the upload folders

2. 
   a. `docker-compose up -d --build site mysql`            - run Loris with docker database (optional)  user: root password: secret host: mysql
   b. `docker-compose up -d --build site mysql phpmyadmin` - run loris, docker database and phpmyadmin (optional)  user: root password: secret 

- **apache**      - `:8081`
- **mysql**       - `:3306`
- **phpmyadmin**  - `:8089`

Three additional containers are included that handle Composer and NPM commands *without* having to have these platforms installed on your local computer. Use the following command examples from your Loris root, modifying them to fit your particular use case.

- `docker-compose run --rm composer install`
- `docker-compose run --rm npm install`
- `docker-compose run --rm npm run compile` 

## Persistent MySQL Storage in Docker 

If your run 2.b or 2.c, by default it has persistent data that remains after bringing containers down and back up.

1. The persistent data is under the 'mysql' folder.  
2. Run "docker-compose exec mysql bash -l" to login mysql container. 
