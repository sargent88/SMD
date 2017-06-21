module.exports = {
    getPatients: function(req, res) {
        req.app.get('db').getAllPatients().then(function(response) {
            // console.log(response)
            response.map(e => {
                console.log(e.dob)
                e.dob = e.dob.toString().substring(4, 15)
            })
            res.send(response)
        })
    }
}