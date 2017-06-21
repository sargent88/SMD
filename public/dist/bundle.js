'use strict';

angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html'
    }).state('users', {
        url: '/users',
        templateUrl: './views/users.html'
    }).state('client', {
        url: '/client',
        templateUrl: './views/client.html'
    }).state('data', {
        url: '/data',
        templateUrl: './views/data.html',
        controller: 'dataCtrl'
    }).state('location', {
        url: 'location',
        templateUrl: './views/location.html'
    });
});
"use strict";
"use strict";
'use strict';

angular.module('app').controller('dataCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv) {

    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.receivePatients = function () {
        dataSrv.getPatients().then(function (response) {
            console.log(response);
            $scope.gridOptions.data = response.data;
        });
    };
    $scope.receivePatients();
});
'use strict';

angular.module('app').controller('mainCtrl', function ($scope, mainSrv) {
    $scope.weather = mainSrv.weather;
});
"use strict";
"use strict";
'use strict';

angular.module('app').service('dataSrv', function ($http) {

    this.getPatients = function () {
        return $http({
            url: '/api/getPatients',
            method: 'GET'
        });
    };
});
'use strict';

angular.module('app').service('mainSrv', function ($http) {
    var _this = this;

    var getWeather = function getWeather() {
        return $http({
            method: 'get',
            url: 'api.openweathermap.org/data/2.5/weather?zip=' + config.weatherZipCode + ',us&APPID=' + config.weatherAPI
        }).then(function (res) {
            _this.weather = res.data;
        });
    };
});
//# sourceMappingURL=bundle.js.map
