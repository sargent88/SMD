angular.module('app').service('mainSrv', function($http, config) {

    this.getWeather = () => {
        return $http({
            method: 'get',
            url: `http://api.openweathermap.org/data/2.5/weather?zip=${config.weatherZipCode},us&APPID=${config.weatherAPI}&units=imperial`

        })
    };
})