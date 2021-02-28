# Arthv-Ed Backend Demo

### This is a my first PERN stack app built in just 4 days for showcasing in a hiring challenge.

### An Event management app where admin can add, delete and see all the participants in a certain event

### Users get the list of events active, and They can register for it

[Deployed here](https://arthv-ed-demo.netlify.app)

[Front-end here](https://github.com/ak2783934/athrv-ed-frontend-demo)

---

## Getting started

This is the backend part of app deployed in [heroku](https://athrv-ed-demo.herokuapp.com)

---

## Dependencies

- express
- nodemon
- pg
- cors
- dotenv
- jsonwebtoken

---

Database used : Heroku postgres

### 3 Schemas used are

1. Registrations
   - name
   - age
   - college
   - phone
   - email
   - rid
2. Users
   - name
   - email
   - password
   - uid
   - isadmin
3. Events
   - name
   - date
   - eid
   - isactive

---

## Application Structure

- `index.js` Entry point for applications from where we have routed to other files

- `routes.js` Storing all the routes that the frontend may call for. With the routes, I have implement the whole connection with data base here. All the queries made to postgress is here.
- `middleware.js` Storing some middle ares which will be used for checking the user if he/she is admin or is signed in

---

## Routes

- `/registration` Called for making new registrations from users end to particapate in a certain event

- `/postevent/:userId` Called for posting events by a user of userid=userId. Here user must be logged in for doing it

- `/signup` For making signup request

- `/signin` For making signin request

- `/signout` For making signout request

- `/eventedit/:userId/:eventno` Put requrest made for making an event **active** or **inactive**

- `/events` For getting all the events listed

- `/getlist/:userId/:eventno` Get route for getting the list of registered peoples in a certain event
