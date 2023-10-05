const express = require('express');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const db = require('./db');
const User = require('./models/user');
const Card = require('./models/card');
const Model = require('./model');
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

let sessionMiddleware = session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
});

app.use(sessionMiddleware);

io.use(
    sharedSession(sessionMiddleware, {
        autoSave: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/views'));

// Use an object to store player room associations
const players = {};

let rooms = [];
let cards = [];
let names = [];

io.on('connection', async (socket) => {
    console.log(`A user connected! Socket ID: ${socket.id}`);
    players[socket.id] = null; // Initialize with null
    //names[socket.id] = session;
    //const { id, login, games,winned }
    try {
        const { id, login, games, winned } = socket.handshake.session.user;

<<<<<<< HEAD
        if (Object.keys(players).length % 2 === 1) {
            // Create a new room when an odd number of players connect
            names[0] = login;
            const roomID = `room_${socket.id}`;
            socket.join(roomID);
            rooms.push(roomID);
            socket.roomID = roomID;
            players[socket.id] = roomID; // Store the room ID associated with the player
            console.log(`A room was created! Room ID: ${roomID}`);
            console.log(`Login: ${login}`);
            console.log(`Rooms: ${rooms}`);
            console.log(`Players object: ${Object.entries(players)}`);
            io.to(roomID).emit('isPlayerA');
        } else {
            // Assign the second player to the last created room
            names[1] = login;

            cards = await Card.getAllCards();
            const roomID = rooms[rooms.length - 1];
            socket.join(roomID);
            socket.roomID = roomID;
            players[socket.id] = roomID; // Store the room ID associated with the player
            console.log(
                `A user with Socket ID ${socket.id} was added to the room! Room ID: ${roomID}`
            );
            console.log(`Rooms: ${rooms}`);
            console.log(`Players object: ${Object.entries(players)}`);
            io.to(roomID).emit('setRoomId', roomID);
            io.to(roomID).emit('setCards', cards);
            io.to(roomID).emit('setNames', names);
            io.to(roomID).emit('dealCards');
            const randomBoolean = Math.random() < 0.5;
            io.to(roomID).emit('updateTurn', randomBoolean);
            io.to(socket.id).emit('updateTurn', !randomBoolean);
        }
    } catch (err) {
        console.error(err);
=======
    if (Object.keys(players).length % 2 === 1) {
        // Create a new room when an odd number of players connect
        const roomID = `room_${socket.id}`;
        socket.join(roomID);
        rooms.push(roomID);
        socket.roomID = roomID;
        players[socket.id] = roomID; // Store the room ID associated with the player
        console.log(`A room was created! Room ID: ${roomID}`);
        console.log(`Rooms: ${rooms}`);
        console.log(`Players object: ${Object.entries(players)}`);
        io.to(roomID).emit('isPlayerA');
    } else {
        // Assign the second player to the last created room
        cards = await Card.getAllCards();
        const roomID = rooms[rooms.length - 1];
        socket.join(roomID);
        socket.roomID = roomID;
        players[socket.id] = roomID; // Store the room ID associated with the player
        console.log(`A user with Socket ID ${socket.id} was added to the room! Room ID: ${roomID}`);
        console.log(`Rooms: ${rooms}`);
        console.log(`Players object: ${Object.entries(players)}`);
        io.to(roomID).emit('setRoomId', roomID);
        io.to(roomID).emit('setCards', cards);
        io.to(roomID).emit('dealCards');
        // const randomBoolean = true;
        const randomBoolean = Math.random() < 0.5;
        // console.log(randomBoolean);
        io.to(roomID).emit('updateTurn', randomBoolean);
        io.to(socket.id).emit('updateTurn', !randomBoolean);
>>>>>>> refs/remotes/origin/kontakt1
    }

    socket.on('updateTurn', (turn) => {
        io.to(socket.roomID).emit('updateTurn', turn);
        turn = !turn;
        io.to(socket.id).emit('updateTurn', turn);
    });

    socket.on('dealCards', () => {
        io.to(socket.roomID).emit('dealCards');
    });

<<<<<<< HEAD
    socket.on('endGame', (name) => {
        // console.log('I`m here');
        let user = new User();
        try {
            user = user.find(id);
            user.attributes.amount_games++;
            if (name === login) {
                user.attributes.winned++;
            }
            user.save();
        } catch (err) {
            console.error(err);
        }
=======
    socket.on('endGame', () => {
        console.log('I`m here');
>>>>>>> refs/remotes/origin/kontakt1
        io.to(socket.roomID).emit('endGame', `http://localhost:${PORT}`);
    });

    socket.on('endRound', (timesPressed) => {
        timesPressed++;
        io.to(socket.roomID).emit('endRound', timesPressed);
    });

    socket.on('cardPlayed', (index, pos, isPlayerA) => {
        io.to(socket.roomID).emit('cardPlayed', index, pos, isPlayerA);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected! Socket ID: ${socket.id}`);

        if (socket.roomID === undefined) {
            delete players[socket.id];
        } else {
            deletePropertiesByValue(players, socket.roomID);
        }

        rooms = rooms.filter((room) => room !== socket.roomID);
        console.log(`A room was destroyed! Room ID: ${socket.roomID}`);
        console.log(`Rooms: ${rooms}`);
        console.log(`Players object: ${Object.entries(players)}`);
        io.to(socket.roomID).emit('playerLeft');
    });
});

app.get('/', (req, res) => {
    if (req.originalUrl !== '/') {
        res.status(404).send('404 page not found');
        return;
    }
    if (req.session.user) {
        res.redirect('/main');
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
});
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const isValid = await db.validUser(login, password);

    if (isValid.isInBase) {
        req.session.user = {
            id: isValid.id,
            login: login,
            games: isValid.amountGames,
            winned: isValid.winnedGames,
        };
        req.session.user.socketId = req.sessionID;
        console.log('sesId ' + req.sessionID);
        res.redirect('/main');
    } else {
        res.redirect(`/?error=${encodeURIComponent('Login or password is wrong')}`);
    }
});

/*
  app.get('/profile', (req, res) => {
    if (req.session.user) {
        const { login, winned } = req.session.user;
        res.send(`Welcome, ${login}
        <br><a href="/logout">Logout</a>
        <br><a href="/reminder">remind me a pass</a>`);
    } else {
        res.redirect('/');
    }
  });
*/
app.get('/reminder', (req, res) => {
    res.sendFile(__dirname + '/views/emailremainder.html');
});

app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});
app.get('/main', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/views/main.html');
    } else {
        res.redirect('/');
    }
});

app.get('/get-player-name', (req, res) => {
    const { id, login, games, winned } = req.session.user;

    res.json({ name: login, games: games, winned: winned, lost: games - winned });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/password-reminder', async (req, res) => {
    const { email } = req.body;

    const [userRows] = await db.isEmail(email);

    if (userRows.length === 0) {
        return res.status(400).send('User not found.');
    }

    const password = userRows[0].password;

    let testEmailAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testEmailAccount.user,
            pass: testEmailAccount.pass,
        },
    });

    const mailOptions = {
        from: '<ucodemailsend@gmail.com>',
        to: email,
        subject: 'Password reminder',
        text: `Password: ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending', error);
            res.status(500).send('Error sending mail');
        } else {
            console.log('Sended:', info.response);
            res.status(200).send('Sended');
        }
    });
});

app.post('/register', async (req, res) => {
    try {
        const { login, password, rpassword, full_name, email_address } = req.body;
        const userExists = await db.validateUserCredentials(req.body.login, req.body.email_address);

        console.log(userExists.usernameExists);
        if (userExists.usernameExists) {
            res.redirect(`/registration?error=${encodeURIComponent('Login already taken')}`);
            return;
        }

        if (userExists.emailExists) {
            res.redirect(`/registration?error=${encodeURIComponent('Email already used')}`);
            return;
        }

        if (req.body.password == req.body.rpassword) {
            //console.log("Error");
            const user = new User({
                login,
                password,
                full_name,
                email_address,
                amount_games: 0,
                winned_games: 0,
            });
            await user.save();
            res.redirect('/main');
        } else {
            res.redirect(`/registration?error=${encodeURIComponent('Passwords does NOT match')}`);
        }
    } catch (error) {
        console.error(error);
        res.redirect(
            `/registration?error=${encodeURIComponent(
                'An error occurred while registering the user.'
            )}`
        );
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function deletePropertiesByValue(obj, targetValue) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === targetValue) {
            delete obj[key];
        }
    }
}
