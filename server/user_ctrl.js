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
}