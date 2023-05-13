DROP DATABASE IF EXISTS test;
CREATE DATABASE test;
USE test;

CREATE TABLE tasks (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    createdAtUTC Datetime,
    updatedAtUTC Datetime,
    deletedAtUTC Datetime,
    summary LONGTEXT,
    createdByUuid VARCHAR(36),
    taskStatus VARCHAR(36),
    datePerformed Datetime
);

CREATE TABLE users (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    email TEXT,
    createdAtUTC Datetime,
    hashedPassword LONGTEXT,
    managerUuid VARCHAR(36),
    userRole VARCHAR(36)
);

