'use strict';

angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.infiniteScroll', 'ui.grid.expandable']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html'
    }).state('users', {
        url: '/users',
        templateUrl: './views/users.html'
    }).state('patient', {
        url: '/patient',
        templateUrl: './views/addPatient.html'
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
'use strict';

angular.module('app').controller('dataCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv) {

    var gridApi;

    $scope.gridOptions = {
        enableCellEditOnFocus: true,
        enableColumnResizing: true,
        enableFiltering: true,
        enableGridMenu: true,
        infiniteScrollRowsFromEnd: 25,
        infiniteScrollUp: true,
        infiniteScrollDown: true,
        onRegisterApi: function onRegisterApi(registeredApi) {
            gridApi = registeredApi;
        },
        enableRowSelection: true,
        expandableRowTemplate: './views/expandableRow.html',
        expandableRowHeight: 150
    };
    $scope.receivePatients = function () {
        dataSrv.getPatients().then(function (response) {
            $scope.gridOptions.data = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.receiveVisits(response.data[i].id, i);
            }
        });
    };
    $scope.receivePatients();

    $scope.receiveVisits = function (id, i) {
        dataSrv.getVisits(id).then(function (response) {
            $scope.gridOptions.data[i].subGridOptions = {
                data: response.data
            };
        });
    };

    $scope.toggleFilterRow = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.callsPending = 0;

    var i = 0;
    $scope.refreshData = function () {
        $scope.myData = [];

        var start = new Date();
        var sec = $interval(function () {
            $scope.callsPending++;

            $http.get('/api/getPatients').success(function (data) {
                $scope.callsPending--;

                data.forEach(function (row) {
                    row.id = i;
                    i++;
                    row.registered = new Date(row.registered);
                    $scope.myData.push(row);
                });
            }).error(function () {
                $scope.callsPending--;
            });
        }, 200, 10);

        var timeout = $timeout(function () {
            $interval.cancel(sec);
            $scope.left = '';
        }, 2000);

        $scope.$on('$destroy', function () {
            $timeout.cancel(timeout);
            $interval.cancel(sec);
        });
    };
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
    }, this.getVisits = function (id) {
        return $http({
            url: '/api/getVisits/' + id,
            method: 'GET'
        });
    }, this.addNewPatient = function () {
        return $http({
            url: '/api/addNewPatient',
            method: 'POST'
        });
    }, this.addNewVisit = function (id) {
        return $http({
            url: '/api/addNewVisit/' + id,
            method: 'POST'
        });
    }, this.changePatient = function (id) {
        return $http({
            url: '/api/updatePatient/' + id,
            method: 'PUT'
        });
    }, this.changeVisit = function (id) {
        return $http({
            url: '/api/updateVisit/' + id,
            method: 'PUT'
        });
    }, this.removePatient = function (id) {
        return $http({
            url: 'api/deletePatient/' + id,
            method: 'DELETE'
        });
    }, this.removeVisit = function (id) {
        return $http({
            url: 'api/deleteVisit/' + id,
            method: 'DELETE'
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
"use strict";
//# sourceMappingURL=bundle.js.map
