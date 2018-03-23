# Streetfleet MQ

## Usage

1. Duplicate `.env.default` into an `.env` file and configure it with the
correct database access data and queue name.
2. Start MongoDB and Redis processes in your machine.
3. Run the server with `yarn start` (after `yarn install`) to accept new messages.
4. Run `node runner.js` to start a new consumer for the message queue. (You can
create as many as you want).
5. Make a post request to add a new message:

```
POST / HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 745bcee3-8c08-ae5c-8b25-d4e4d8bd03f6

{
  "mac_address" : "44-14-22-01-23-45",
  "time": 1521810000000,
  "latitude": 45.2656452,
  "longitude": 2.35653
}
```
