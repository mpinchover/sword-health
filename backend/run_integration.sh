#!/bin/sh

export DEV_ENV=TEST
export TASK_MANAGER_SQL_PORT=3308
export TASK_MANAGER_REDIS_URL=redis://localhost:6380
export TASK_MANAGER_SQL_HOST=localhost
export TASK_MANAGER_USER=root 
export TASK_MANAGER_PASSWORD=root
export TASK_MANAGER_DATABASE=test
export APP_PORT=5001

# check to see if the container with the name exists.
existingMySQLContainer=$(docker ps -a -q -f name="integration-test-mysql-db")
existingRedisContainer=$(docker ps -a -q -f name="integration-test-redis")

if [ -z "$existingMySQLContainer" ]
then
    # container has been found so tear it down for a clean database
    docker run --name integration-test-mysql-db -d -p 3308:3306 -e MYSQL_ROOT_HOST=% -e MYSQL_ROOT_PASSWORD=root mysql:8
    echo "Loading MySQL docker image, this may take 20 seconds"
    sleep 20
    existingMySQLContainer=$(docker ps -a -q -f name="integration-test-mysql-db")
fi

if [ -z "$existingRedisContainer" ]
then
    # container has been found so tear it down for a clean database
    docker run -d --name integration-test-redis -p 6380:6379 redis/redis-stack-server:latest 
    echo "Loading Redis docker image, this may take 10 seconds"
    sleep 10
fi

echo "CLEARING DATABASE"

docker cp ./src/scripts/schemas.sql $existingMySQLContainer:/schemas.sql
# run the docker container

docker exec -it $existingMySQLContainer bash -c "mysql -u root -proot < schemas.sql" 
npm run start