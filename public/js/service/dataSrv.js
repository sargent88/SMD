angular.module('app').service('dataSrv', function($http) {

    this.getPatients = () => {
        return $http({
            url: '/api/getPatients',
            method: 'GET'
        })
    }

})