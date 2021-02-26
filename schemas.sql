-- here we will be creating 3 tables 
-- First is gonna be users
-- second is registrations
-- third is events 

-- Database used is the heroku postgress as a service


CREATE TABLE users
(
    uid SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    isadmin BOOLEAN DEFAULT FALSE,
);

CREATE TABLE registrations
(
    rid SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    college VARCHAR(200) NOT NULL,
    eventno INT NOT NULL,
);

CREATE TABLE event
(
    eid SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL,
    isactive BOOLEAN DEFAULT TRUE,
);
-- This is how 3 tables are created here. 