const express = require('express');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const app = express();

app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 3000 },
    saveUninitialized: false
}))

// Built in middleware
// app.use(cookieParser());
app.use(express.json);
app.use(express.urlencoded({ extended: false }));

// Middleaware
app.use((req, res, next) => {
    console.log(`${req.method}` - `${req.url}`);
    next();
})

const users = [
    { name: 'kharis', age: '22'},
    { name: 'blesson', age: '25'},
    { name: 'john', age: '30'}
];

const posts = [
    { title: 'This is title one' },
    { title: 'This is title two' },
    { title: 'This is title three' }
]

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Hello',
        user: 'kharis'
    });
});

app.get('/users', (req, res) => {
    res.status(200).send(users);
});

//Dynamic Route Parameter
app.get('/users/:name', (req, res) => {
    // Object Destructuring
    const { name } = req.params;
    const user = users.find((user) => user.name === name);
    if (user) {
        res.status(200).send(user);
    } else {
        res.send.status(404).send('Not found');
    }
});

app.get('/posts', (req, res) => {
    console.log(req.query)
    const { title } = req.query;
    if (title) {
        const post = posts.find((post) => post.title === title);
        if (post) {
            res.status(200).send(post);
        } else {
            res.status(404).send('Not found')
        }
    }
    res.status(200).send(posts);
})

// Post Request
app.post('/', (req, res) => {
    const user = req.body;
    user.push(users);
    res.status(201).send('User Created');
})

// function validateAuthToken(req, res, next) {
//     console.log('Inside validate Auth Token');
//     const { authorization } = req.headers;
//     if (authorization && authorization === process.env.AUTHORIZATION_KEY) {
//         next();
// } else {
//     res.status(403).send('Forbidden')
// }
// }

const validateAuthToken = require('./middleware')

app.post('/posts', validateAuthToken, (req, res) => {
    // console.log(req.headers)
        const post = req.body;
        posts.push(post);
        res.status(201).send(post);  
});

function validateCookies(req, res, next) {
    const { cookies } = req;
    console.log(cookies)
    next();
}

app.get('/signin', validateCookies, (req, res) => {
    res.cookie('session_id', '12345');
    res.status(200).json({ msg: 'Logged In.' })
})

app.get('/login', (req, res) => {
    console.log('Hello');
    res.send(200);
})

// Start server
const PORT = process.env.PORT || 8080
app.listen(PORT, (error) => {
    if(error) {
        console.log('Something went wrong');
    } else {
         console.log(`Server running on port ${PORT}`);
    }
});