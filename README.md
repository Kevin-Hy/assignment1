## Deployment
#### Heroku link
`https://young-reef-86978.herokuapp.com/`

***note: this was actually torture ._.***

#### dev-local
`npm run start` - start the react app
on a seperate cmd...

`cd ./backend` then `npm run start:server` - start the backend server

Frontend - `http://localhost:3000`

Backend - `http://localhost:3001`

#### Express API
- GET - `/api/history`
  - Returns a JSON object of the list of all chat history
- POST - `/api/roomhistory` 
  - Requires a `roomname` in the post request, then returns a JSON object of the list of all chat history in that room
- GET -`/api/eventlog`
  - Returns a JSON object of all the eventlog made by the system

## MEME-bers
### Hard working plebs
Igor Teixeira Belem - 100907699

Klifford Agujar ü - 101145584

Kevin Hy - 101078240

### EMAILS:

kevin.hy@georgebrown.ca

klifford.agujar@georgebrown.ca

igor.teixeirabelem@georgebrown.ca

## Branches
- Master : `https://github.com/Kevin-Hy/assignment1/tree/master` or (forked) `https://github.com/AshenCat/assignment1/tree/master`
  - Build we finished
- Heroku  : `https://github.com/Kevin-Hy/assignment1/tree/heroku` or (forked) `https://github.com/AshenCat/assignment1/tree/master`
  - Build we used for heroku deployment
  
## (HOT FIXED) ~~Design Flaw (on a non-required feature)~~
~~The app doesn't logout the user on force close (e.g. close browser tab).~~ 

~~What effect does it have? The userlist on the server will never remove the username on the userlist, making the username unavailable till server reset~~

~~What steps have we taken? We tried socket emitting on the hook: componentWillUnmount. But apparently, socket object is destroyed before it can emit(?). Thinking of using axios to make a delete request to the api, but we're guessing it wouldn't work too...~~


## Requirements

### 1 - Teams
 Since this is a three man project, the UI bonus section is required. The team used React as the front-end framework.

### 2 - Backend server
- [x] Node.js
- [x] Express
- [x] Socket.io
- [x] Node packages

### 3 - Database
 The database connection is configured to check if it can connect to the cloud db, if not, connect locally or ***CRASH***

- [x] Hosted on mongodb cloud atlast

### 4 - User Interface
 The user interface? Html/css/react/bootstrap

### 5 - Specification
- [x] Chat app
- [ ] Game app

### 6 - Socket.io
1. - [x] Listen for when a new socket is created
   
   - [x] save when a socket connection is created in history

2. - [x] Listen for when a new user joins a room

   - [:thought_balloon:] echo to the client that they have connected ~~(via emit).~~ The team has decided to let react handle this

   - [x] echo to everyone in the room that a person has connected

   - [-] save to ~~history~~ ("Event") event that a new socket connection is made with timestamp

   - [x] save to history the username and room joined

3. - [x] Listen for client input

   - [x] update the room of the new input

4. - [x] Listen for switching room

   - [x] leave the room and join a new room

   - [x] echo to the user the new room connected

   - [x] send a message to the old room that the user has left

   - [x] update to history the username and room joined

5. - [x] Listen for the user disconnect

   - [x] update the list of users in the chat the user has disconnected

   - [x] save in event log user disconnected with timestamp

### 7 - Express Api
6. - [x] Get a list of all Chat History

   - [x] GET request `/api/history`

   - [x] Returns a JSON list of chat or game history records

7. - [x] Get a list Chat by room name

   - [x] POST request `/api/roomhistory`

   - parameters: roomname

   - [x] Returns a JSON list of chat for specific room name

8. - [x] Get a list of all Events

   - [x] GET request `/api/eventlog`

   - [x] returns a JSON list of all events in the event log

### 8 - Mongoose ORM and MongoDb
- [x] Store data in mongoDb using mlabs..

- [x] Build a model and schema to save user history

- [x] Build model and scheme to save socket.io events

- [:thought_balloon:] Write a mongoose query to retrieve all user history

- [:thought_balloon:] Write a mongoose query to retrieve all user history by room name

- [:thought_balloon:] Write a mongoose query to retrieve all event logs


## Dependencies

#### Front End
|Dependency|Used for|
|---|---|
|react-bootstrap|Core css design of the project|
|socket.io-client|requirement|

#### Back end
|Dependency|Used for|
|---|---|
|body-parser|simplifies post request objects (overkill but good stuff)|
|cors|cross origin request set to \*:\* by default|
|express| *requirement*|
|helmet|modifies http headers for security|
|mongoose| *requirement*|
|morgan|logs all the requests made to the express app|
|socket.io|*requirement*|