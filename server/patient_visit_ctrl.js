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
    },
    addNewPatient: function(req, res) {
        // console.log(addP)
        req.app.get('db').addPatient().then(function(response) {
            res.status(200).send(response)
        })
    },
    addNewVisit: function(req, res) {
        // console.log(addV)
        req.app.get('db').addVisit([+req.params.id, new Date().toISOString()]).then(function(response) {
            res.status(200).send(response)
        })
    },
    changePatient: function(req, res) {
        const updateP = [+req.body.id,
            req.body.firstname,
            req.body.lastname,
            req.body.email, +req.body.phone_num,
            req.body.dob,
            req.body.gender
        ];
        req.app.get('db').updatePatient(updateP).then(function(response) {
            res.status(200).send('Patient Updated')
        })
    },
    changeVisit: function(req, res) {
        const updateV = [
            req.body.date,
            req.body.area_hurt,
            req.body.reason,
            req.body.prescription,
            req.body.followup,
            req.body.notes,
            req.params.id
        ];
        req.app.get('db').updateVisit(updateV).then(function(response) {
            res.status(200).send('Visit Updated')
        })
    },
    removePatient: function(req, res) {
        req.app.get('db').deletePatient([req.params.id]).then(function(response) {
            res.status(200).send('Patient Removed')
        })
    },
    removeVisit: function(req, res) {
        req.app.get('db').deleteVisit([req.params.id]).then(function(response) {
            res.status(200).send('Visit Removed')
        })
    }
}