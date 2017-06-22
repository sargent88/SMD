module.exports = {
    getPatients: function(req, res) {
        req.app.get('db').getAllPatients().then(function(response) {
            response.map(e => {
                e.dob = e.dob.toString().substring(4, 15)
            })
            res.send(response)
        })
    },
    getVisits: function(req, res) {
            req.app.get('db').joinPatientToVisit([req.params.id]).then(function(response) {
                response.map(e => {
                    e.date = e.date.toString().substring(4, 15)
                })
                res.send(response)
            })
        }
        // addNewPatient: function(req, res) {
        //     const add = [
        //         req.body.firstname,
        //         req.body.lastname,
        //         req.body.email,
        //         req.body.phone_num,
        //         req.body.dob,
        //         req.body.gender
        //     ];
        //     console.log(add)
        //     req.app.get('db').addPatient(add).then(function(response) {
        //         res.status(200).send('Added')
        //     })
        // }
}