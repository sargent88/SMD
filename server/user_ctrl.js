module.exports = {
    getUsers: function(req, res) {
        req.app.get('db').getAllUsers().then(function(response) {
            res.send(response)
        })
    },
    removeUser: function(req, res) {
        req.app.get('db').deleteUser([req.params.id]).then(function(response) {
            res.status(200).send('Patient Removed')
        })
    },
    addNewUser: function(req, res) {
        const newUser = [
            req.body.username,
            req.body.email,
            req.body.password
        ];
        req.app.get('db').addUser(newUser).then(function(response) {
            res.status(200).send(response)
        })
    },
    changeUsers: function(req, res) {
        const updateType = [+req.body.id,
            req.body.type,
            req.body.username
        ];
        req.app.get('db').updateUser(updateType).then(function(response) {
            res.status(200).send('Patient Updated')
        })
    }
}