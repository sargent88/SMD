angular.module('app').service('usersSrv', function($http) {

    this.getUsers = () => {
            return $http({
                url: '/api/getUsers',
                method: 'GET'
            })
        },
        this.removeUser = (id) => {
            return $http({
                url: `api/deleteUser/${id}`,
                method: 'DELETE'
            })
        }

})