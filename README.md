# [LibXD](https://lib-xd.herokuapp.com/)

A 3D webpage for library management in schools and universities

### Features
- Create your own user library with books and students
- Add books to the user library using their respective isbns
- Add details about students before lending books
- Keep track of currently lent out books and the students who borrowed them

### Tech stack
The project is built using Next JS and uses Sequelize ORM to connect to a MySQL database

### Video demo
[![LibXD DEMO](https://img.youtube.com/vi/UWYtzEztrEM/0.jpg)](https://www.youtube.com/watch?v=UWYtzEztrEM)

### Setting up locally
Clone the repo and create a `.env.local` file to configure the site

Configuration variables
```
# mysql db host
DB_HOST=""

# mysql db port
DB_PORT=""

# mysql db name
DB_DBNAME=""

# mysql db username
DB_USERNAME=""

# mysql db password
DB_PASSWORD=""

# secret used for generating JWT tokens
JWT_SECRET=""

# life-time duration of JWT tokens in seconds
TOKEN_DURATION=86400

# google books api 
NEXT_PUBLIC_GOOGLE_BOOKS_API=https://www.googleapis.com/books/v1
```
### Running in development mode
Install required modules using `npm install` and run the site in dev mode using `npm run dev`

```
npm install
npm run dev
```

### Building and deploying 
Build the site using `npm run build` and run it using `npm start`

```
npm run build
npm start
```
