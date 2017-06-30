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
        this.changeUsers = (rowEntity) => {
            return $http({
                url: `/api/updateUsers`,
                method: 'PUT',
                data: rowEntity
            })
        },
        this.getUserByAuthId = () => {
            return $http({
                method: 'GET',
                url: '/security'
            }).catch(err => {
                return err
            })
        }

})