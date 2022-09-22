# Course app

Simple shop for buying courses.
You can create, edit, delete, add to cart course.
Regisration with sending email. Password recovery.

[Deploy Heroku](https://coursehunter-node-js.herokuapp.com/)

## Implementation:

- Backend server with NodeJS + Express
- CRUD request
- Cart for orders
- Personal page
- The ability to edit and delete only your own courses
- Create account and change password (OAuth2 + nodemailer Google)
- Validation with [Express-validatior](https://express-validator.github.io/docs/)
- helemet + static comression

## Database used:

- MongoDB + mongoose

## For start app:

- Need to create .env file with next fields:

```bash
PORT=3000
MONGODB_URL='...'
TOKEN_SECRET='...'

APP_BASE_URL='http://localhost:3000'
# https://console.cloud.google.com/apis
GMAIL_EMAIL='...'
GMAIL_CLIENT_ID='...'
GMAIL_SECRET_KEY='...'
# https://developers.google.com/oauthplayground/
GMAIL_REFRESH_TOKEN='...'
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev
```
