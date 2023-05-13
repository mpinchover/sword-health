## What does this service do?

This service is a task manager that allows a technician to create, update and delete tasks. A technician's manager can also view and delete their tasks.

The service uses Redis pub-sub to notify a manager when a technician has finished their task.

## How does the service work?

The server runs in a dockerized container and communicates with dockerized redis and mysql servers.

In order to create a task, a user must be created and logged in. Once logged in, the service will return a JWT which must be included in the headers of every subsequent request to authorize the user to create a task, delete a task or update a task.

## How to run this service

Use docker compose to run all the services in dockerized containers

```
docker-compose up --build
```

You should see a message from the terminal letting you know the backend service is running on port 5001

You must also set up the mysql schemas before you can use the service.
First, get the CONTAINER ID of the mysql database within the created docker network.
In a new terminal at the root of the project (same level as the docker compose file), run:

```
docker ps -a -q -f name="sword_sqldb_1"
```

Now you need to copy over the scripts to the dockerized mysql server:

```
docker cp ./backend/src/scripts/schemas.sql [CONTAINER_ID]:/schemas.sql
```

Now run the schema script against the mysql server

```
docker exec -it [CONTAINER_ID] bash -c "mysql -u root -proot < schemas.sql"
```

You can now open up an http client and make requests to the service.
For example:

```
curl --location --request POST 'localhost:5001/create-user' \
--header 'Content-Type: application/json' \
--data-raw '{
     "email": "test-user-email-2",
      "password": "test-user-password",
      "confirmPassword": "test-user-password",
      "userRole": "TECHNICIAN"
}'
```

## How to use the service

Here is an example of the flow. Feel free to check the `./backend/integration-tests` directory for more examples.

### Create a user

Set the role to either TECHNICIAN or MANAGER.
If you are creating the role as a TECHNICIAN and want to assign this technician a manager, you need to create a MANAGER first and then asign its uuid in the request to create the TECHNICIAN.

```
curl --location --request POST 'localhost:5001/create-user' \
--header 'Content-Type: application/json' \
--data-raw '{
     "email": "test-user-email-2",
      "password": "test-user-password",
      "confirmPassword": "test-user-password",
      "userRole": "MANAGER"
}'
```

Response:

```
{
    "email": "test-user-email-2",
    "userRole": "MANAGER",
    "uuid": "3e0d6d01-1d22-449b-b5aa-92e44719f1fe",
    "createdAtUTC": "2023-05-13T14:59:45.761Z"
}
```

Now create a TECHNICIAN who reports to this manager

```
curl --location --request POST 'localhost:5001/create-user' \
--header 'Content-Type: application/json' \
--data-raw '{
     "email": "test-user-email-3",
      "password": "test-user-password",
      "confirmPassword": "test-user-password",
      "userRole": "TECHNICIAN",
      "managerUuid":"3e0d6d01-1d22-449b-b5aa-92e44719f1fe"
}'
```

Response:

```
{
    "managerUuid": "3e0d6d01-1d22-449b-b5aa-92e44719f1fe",
    "email": "test-user-email-3",
    "userRole": "TECHNICIAN",
    "uuid": "f9ad34c6-f5da-445a-a20c-1b14b3983b28",
    "createdAtUTC": "2023-05-13T15:01:27.338Z"
}
```

### Log in a user

Log the user in and you will get an auth token in return. The auth token must be used in any request related to tasks.

```
curl --location --request POST 'localhost:5001/login-user' \
--header 'Content-Type: application/json' \
--data-raw '{
     "email": "test-user-email-3",
      "password": "test-user-password"
}'
```

### Create a task

Create a new task using the access token you got back after logging in.

The response will have the newly created task with its uuid. Any update to the task should send back the full task, including the uuid, with any overwrites you want to make

```
curl --location --request POST 'localhost:5001/create-task' \
--header 'Content-Type: application/json' \
--header 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...' \
--data-raw '{
    "task": {
        "summary": "This is my task"
    }
}'
```

Response:

```
{
    "summary": "This is a new task",
    "createdByUuid": "f9ad34c6-f5da-445a-a20c-1b14b3983b28",
    "uuid": "5b35c802-8acf-4a06-99cf-2b6031ffdb4b",
    "createdAtUTC": "2023-05-13T15:09:58.322Z"
}
```

### Update a task

To upate a task, send back the task with it's uuid and all fields. Overwite the fields you want to update otherwise the blank fields will be set to NULL.

Let's update a task to be CLOSED and include the date performed.
Pay close attention to the different syntax for `datePerformed`.

```
curl --location --request POST 'localhost:5001/update-task' \
--header 'Content-Type: application/json' \
--header 'Authorization: bearer eyJhbGciOiJIUzI1NiIsI...' \
--data-raw '{
    "task": {
        "summary": "This is a new task",
        "createdByUuid": "f9ad34c6-f5da-445a-a20c-1b14b3983b28",
        "uuid": "5b35c802-8acf-4a06-99cf-2b6031ffdb4b",
        "createdAtUTC": "2023-05-13T15:09:58.322Z",
        "datePerformed":"2023-05-01",
        "taskStatus":"CLOSED"
    }
}'
```

Because we have now set the task to CLOSED, our Redis server has picked up that the task has been completed and logged out.

```
NOTIFICATION_CHANNEL The tech f9ad34c6-f5da-445a-a20c-1b14b3983b28 performed task 5b35c802-8acf-4a06-99cf-2b6031ffdb4b on date Mon May 01 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
```

### Get tasks

This API will return a list of tasks created by this technician. If the user making this request is a manager, it will return all tasks created by that manager's technician.

```
curl --location --request GET 'localhost:5001/get-tasks' \
--header 'Content-Type: application/json' \
--header 'Authorization: bearer eyJhbGciOiJIUzI1NiIs...' \
--data-raw '{
    "task": {
        "summary": "This is a new task",
        "createdByUuid": "f9ad34c6-f5da-445a-a20c-1b14b3983b28",
        "uuid": "5b35c802-8acf-4a06-99cf-2b6031ffdb4b",
        "createdAtUTC": "2023-05-13T15:09:58.322Z",
        "datePerformed":"2023-05-01",
        "taskStatus":"CLOSED"
    }
}'
```

### Delete a task

```
curl --location --request POST 'localhost:5001/delete-task' \
--header 'Content-Type: application/json' \
--header 'Authorization: bearer eyJhbGciOiJIUzI1NiIsIn...' \
--data-raw '{
    "taskUuid":"052e1707-a933-4eab-8850-dfda77da06a4"
}'
```

## How to run unit tests

```
cd backend
```

```
npm run test
```

## How to run integration tests

```
cd backend
```

Terminal 1:

```
chmod +x run_integration.sh
```

```
./run_integration.sh
```

Terminal 2:

```
npm run test-integration
```

## Common errors

The integration test doesn't remove data from the database. If you want to rerun the tests, you need to quit the running service and rerun `./run_integration.sh` and `npm run test-integration`

Make sure that the server is running and the port on which its running is shown before running `npm run test-integration`

If you have problems running the service try running `docker-compose down` to remove the network first before `docker-compose up --build`

## Known bugs

Tasks must be created with an OPEN status

Updating a task to CLOSED should return the datePerformed as well

In updateTask API, datePerformed should be automatically added by the server.

In updateTask API, datePerformed is in UTC while everything else is in local time.

Need to update all times to be in UTC time.
