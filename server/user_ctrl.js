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
    updatePassword: function(req, res) {
        const newPass = [
            req.body.username,
            req.body.password
        ];
        req.app.get('db').updatePassword(newPass).then(function(response) {
            res.status(200).send(response)
        })
    },
    updateUsername: function(req, res) {
        const newName = [
            req.body.email,
            req.body.username
        ];
        req.app.get('db').updateUsername(newName).then(function(response) {
            res.status(200).send(response)
        })
    }
}