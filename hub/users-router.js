const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../auth/auth-middleware.js');

const Hub = require('./users-model.js');

router.post('/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 12);
    creds.password = hash
    Hub.add(creds)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({message: 'error registering username'})
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Hub.findBy({username})
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `Welcome ${user.username}`})
        } else {
            res.status(401).json({message: 'Invalid Credentials'});
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })

})

router.get('/users', auth, (req, res) => {
    Hub.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: 'error returning users'})
    })
})

module.exports = router