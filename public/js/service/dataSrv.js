angular.module('app').service('dataSrv', function($http) {

    this.getPatients = () => {
            return $http({
                url: '/api/getPatients',
                method: 'GET'
            })
        },
        this.getVisits = (id) => {
            return $http({
                url: `/api/getVisits/${id}`,
                method: 'GET'
            })
        },
        this.addNewPatient = () => {
            return $http({
                url: '/api/addNewPatient',
                method: 'POST'
            })
        },
        this.addNewVisit = (id) => {
            return $http({
                url: `/api/addNewVisit/${id}`,
                method: 'POST'
            })
        },
        this.changePatient = (id) => {
            return $http({
                url: `/api/updatePatient/${id}`,
                method: 'PUT'
            })
        },
        this.changeVisit = (id) => {
            return $http({
                url: `/api/updateVisit/${id}`,
                method: 'PUT'
            })
        },
        this.removePatient = (id) => {
            return $http({
                url: `api/deletePatient/${id}`,
                method: 'DELETE'
            })
        },
        this.removeVisit = (id) => {
            return $http({
                url: `api/deleteVisit/${id}`,
                method: 'DELETE'
            })
        }
})