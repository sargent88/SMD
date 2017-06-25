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
        this.changePatient = (rowEntity) => {
            return $http({
                url: `/api/updatePatient`,
                method: 'PUT',
                data: rowEntity
            })
        },
        this.changeVisit = (visit_id) => {
            return $http({
                url: `/api/updateVisit/${visit_id}`,
                method: 'PUT'
            })
        },
        this.removePatient = (id) => {
            return $http({
                url: `api/deletePatient/${id}`,
                method: 'DELETE'
            })
        },
        this.removeVisit = (visit_id) => {
            return $http({
                url: `api/deleteVisit/${visit_id}`,
                method: 'DELETE'
            })
        }
})