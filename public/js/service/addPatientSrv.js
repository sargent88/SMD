angular.module('app').service('addPatientSrv', function($http) {
    this.addPatient = (patient) => {
        return $http({
            url: '/api/addPatient',
            method: 'POST',
            data: patient
        })
    }
})