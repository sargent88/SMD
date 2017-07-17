angular.module('app').service('mainSrv', function($http) {

    this.getWeather = () => {
        return $http({
            method: 'get',
            url: `/api/weather`

        })
    };
})