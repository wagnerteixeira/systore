for run printer in linux debian based run 

### `sudo apt install libc6-dev`
### `sudo apt install libgdiplus`

build docker image

### `docker build . -f DockerFile -t systore:dev`

execute detached
docker run -d -p 8085:80 --name systoreapi systore:dev

execute interative
docker run -it -p 8085:80 --name systoreapi systore:dev

stop container
docker stop systoreapi

remove container
docker stop systoreapi

start docker services detached
docker-compose up -d

stop docker services
docker-compose down

deploy stack
docker stack deploy -c docker-compose.yaml systoreapi

remove stack 
docker stack rm systoreapi



docker run -it -p 3306:3300 --name mysql -e MYSQL_ROOT_PASSWORD=12345678 -v D:\mysql\data:/var/lib/mysql  -d mysql/mysql-server:8.0


docker run -it -p 3306:3306 -p 33060:33060 --name mysql -e MYSQL_ROOT_PASSWORD=12345678 -e MYSQL_ROOT_HOST=% -v /var/mysql:/var/lib/mysql mysql/mysql-server:8.0


MYSQL_DATABASE=db
      MYSQL_USERuser'
      MYSQL_PASSWORD: 'pass'
      MYSQL_ROOT_HOST=%