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

    $scope.selectedArray = [];
    console.log($scope.selectedArray);
    // $scope.row.entity.subGridOptions = {
    //     enableCellEditOnFocus: true,
    //     enableColumnResizing: true,
    //     enableFiltering: true,
    //     enableGridMenu: true,
    //     infiniteScrollRowsFromEnd: 25,
    //     infiniteScrollUp: true,
    //     infiniteScrollDown: true,
    //     enableRowSelection: true,
    //     multiSelect: false,
    //     onRegisterApi: function(gridApi) {
    //         let subgridApi = gridApi;
    //         subgridApi.selection.on.rowSelectionChanged($scope, function(row) {
    //             console.log("inner: ", row)
    //             if (row.isSelected) {
    //                 $scope.selectedArray = [row.entity.id]
    //             }
    //         })
    //     }
    // }

    $scope.gridOptions = {
        enableCellEditOnFocus: true,
        enableColumnResizing: true,
        enableFiltering: true,
        enableGridMenu: true,
        infiniteScrollRowsFromEnd: 25,
        infiniteScrollUp: true,
        infiniteScrollDown: true,
        enableRowSelection: true,
        multiSelect: false,
        expandableRowTemplate: './views/expandableRow.html',
        expandableRowHeight: 150,
        onRegisterApi: function onRegisterApi(gridApi) {
            gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                console.log("outter: ", row);
                if (row.isSelected) {
                    $scope.selectedArray = [row.entity.id];
                }
            });
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                console.log(rowEntity, 'row');
                console.log(colDef, 'your');
                console.log(newValue, 'boat');
                console.log(oldValue, 'ok');
                dataSrv.changePatient(rowEntity);
            });
        }

    };

    $scope.test = function () {
        console.log(document.getElementsByClassName('ui-grid-row-selected'));
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
            // response.data.map(e => {
            //     e['delete?'] = 'x'
            // })
            $scope.gridOptions.data[i].subGridOptions = {
                data: response.data
            };
        });
    };

    // const deleteCell = document.getElementsByClassName('ui-grid-coluiGrid-0093');
    // const deleteVisitFn = () => {
    //     alert('This works')
    // }
    // console.log(deleteCell)
    // deleteCell.map(e => {
    //     e.addEventListener('click', deleteVisitFn)
    // })

    $scope.addPatient = function () {
        dataSrv.addNewPatient().then(function (response) {});
        $scope.receivePatients();
    };

    $scope.addVisit = function (id) {
        dataSrv.addNewVisit(id[0]).then(function (response) {});
        $scope.receivePatients();
    };

    $scope.removePatient = function (id) {
        dataSrv.removePatient(id[0]).then(function (response) {});
        $scope.receivePatients();
    };

    $scope.toggleFilterRow = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
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
    }, this.changePatient = function (rowEntity) {
        return $http({
            url: '/api/updatePatient',
            method: 'PUT',
            data: rowEntity
        });
    }, this.changeVisit = function (visit_id) {
        return $http({
            url: '/api/updateVisit/' + visit_id,
            method: 'PUT'
        });
    }, this.removePatient = function (id) {
        return $http({
            url: 'api/deletePatient/' + id,
            method: 'DELETE'
        });
    }, this.removeVisit = function (visit_id) {
        return $http({
            url: 'api/deleteVisit/' + visit_id,
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
