angular.module('app').service('usersSrv', function($http) {

    this.getUsers = () => {
            return $http({
                url: '/api/getUsers',
                method: 'GET'
            })
        },
        this.removeUser = (id) => {
            return $http({
                url: `/api/deleteUser/${id}`,
                method: 'DELETE'
            })
        },
        this.addNewUser = (user) => {
            return $http({
                url: '/api/addUser',
                method: 'POST',
                data: user
            })
        },
        this.updatePassword = (user) => {
            return $http({
                url: '/api/updatePassword',
                method: 'PUT',
                data: user
            })
        },
        this.updateUsername = (user) => {
            return $http({
                url: '/api/updateUsername',
                method: 'PUT',
                data: user
            })
        },
        this.changeUsers = (rowEntity) => {
            return $http({
                url: `/api/updateUsers`,
                method: 'PUT',
                data: rowEntity
            })
        }

})