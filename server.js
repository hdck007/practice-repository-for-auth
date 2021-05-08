/* Importing the required packages  */

const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

// This is a middleware used to parse the incoming
// json payload convert them into objects for the use in the app
app.use(express.json());

users = [];

// Route to get the list of all users
app.get('/users', (req, res) => {
	res.status(200).json(users);
});

// A dummy signup route with no hasshing
app.post('/createUser', (req, res) => {
	try {
		let user = { name: req.body.name, password: req.body.password };
		// console.log(user);
		users.push(user);
		res.status(200).send('User Created');
	} catch (error) {
		console.log(error);
	}
});

// Below I create a route that contains hashing and
// hence it is more reliable and safe
app.post('/signup', async (req, res) => {
	try {
		let name = req.body.name;
		let hashedPassword = req.body.password;
		// The below function creates a hash associated with a salt
		let password = await bcrypt.hash(hashedPassword, 10);
		let user = {
			name,
			password,
		};
		users.push(user);
		res.status(200).send('Secure User created');
	} catch (error) {
		console.log(error);
	}
});

// Now since we have created some users lets try to login some of them
app.post('/login', async (req, res) => {
	try {
		let user = users.find((user) => user.name === req.body.name);
		if (user) {
			if (await bcrypt.compare(req.body.password, user.password)) {
				res.status(200).send(`User ${user.name} logged in`);
			} else {
				res.status(400).send('Wrong Password');
			}
		} else res.status(500).send('No such user');
	} catch (error) {
		console.log(error);
	}
});

app.listen(3000, () => {
	console.log('Server Is running');
});
