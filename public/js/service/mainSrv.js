angular.module('app').service('mainSrv', function($http) {
    let getWeather = () => {
        return $http({
            method: 'get',
            url: `api.openweathermap.org/data/2.5/weather?zip=${config.weatherZipCode},us&APPID=${config.weatherAPI}`
        }).then((res) => {
            this.weather = res.data;
        })
    };
})