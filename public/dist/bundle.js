'use strict';

angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.infiniteScroll', 'ui.grid.expandable']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html'
    }).state('users', {
        url: '/users',
        templateUrl: './views/users.html',
        controller: 'usersCtrl'
    }).state('patient', {
        url: '/patient',
        templateUrl: './views/addPatient.html'
    }).state('data', {
        url: '/data',
        templateUrl: './views/data.html',
        controller: 'dataCtrl'
    }).state('location', {
        url: '/location',
        templateUrl: './views/location.html'
    }).state('register', {
        url: '/register',
        templateUrl: './views/register.html'
    }).state('login', {
        url: '/login',
        templateUrl: './views/login.html'
    });
});
"use strict";
'use strict';

angular.module('app').controller('dataCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv, $window) {

    var gridApi;

    $scope.selectedArray = [];
    // $scope.selectedSubArray = []
    console.log($scope.selectedArray);

    // window.onclick = (event) => {
    //     var test = document.getElementsByClassName('ui-grid-row')
    //     console.log(test)
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
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        },
        onRegisterApi: function onRegisterApi(gridApi) {
            // console.log($scope.subGridVariable)
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                // console.log("outter: ", row)
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

            $scope.receivePatients = function () {
                dataSrv.getPatients().then(function (response) {
                    $scope.gridOptions.data = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.receiveVisits(response.data[i].id, i);
                    }
                });
            };
            $scope.receivePatients();
            $scope.test = function () {
                alert('ehy');
                console.log(document.getElementsByClassName("'ui-grid-row-selected': row.isSelected"));
            };

            $scope.subGridScope = {
                clickMeSub: function clickMeSub() {
                    // console.log($event.target.parentElement.parentElement)
                    console.log(this);
                    // alert('hi', $event);
                }
            };

            $scope.receiveVisits = function (id, i) {
                dataSrv.getVisits(id).then(function (response) {
                    // response.data.map(e => {
                    //     e['delete?'] = 'x'
                    // })

                    $scope.gridOptions.data[i].subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        columnDefs: [{ name: 'id', cellTemplate: '<button class="btn primary" ng-click="grid.appScope.clickMeSub()">Click Me</button>' }, { name: 'visit_id' }, { name: 'date' }, { name: 'area_hurt' }, { name: 'reason' }, { name: 'prescription' }, { name: 'followup' }, { name: 'notes' }],
                        data: response.data
                    };
                });
            };

            // gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            //         if (row.isExpanded) {
            //             row.entity.subGridOptions = {
            //                 columnDefs: [
            //                     { name: 'Visit_id' },
            //                     { name: 'Date' },
            //                     { name: 'Area_hurt' },
            //                     { name: 'Reason' },
            //                     { name: 'Prescription' },
            //                     { name: 'Followup' },
            //                     { name: 'Notes' }
            //                 ]
            //             }

            //             let data = []
            //             for (let i = 0; i < $scope.gridOptions.data; i++) {
            //                 data.push($scope.gridOptions.data[i].subGridOptions.data)
            //             }
            //             console.log(data)
            //             row.entity.subGridOptions.data = data;
            //             console.log(row.entity.subGridOptions, 'subgrid')
            //         }
            //     })
            // gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            //     console.log(document.getElementsByClassName("'ui-grid-row-selected': row.isSelected"))
            //     console.log(row.isSelected)
            //     console.log(row.entity.subGridOptions)
            // })
        }

    };

    // $scope.receivePatients = () => {
    //     dataSrv.getPatients().then((response) => {
    //         $scope.gridOptions.data = response.data;
    //         for (var i = 0; i < response.data.length; i++) {
    //             $scope.receiveVisits(response.data[i].id, i)
    //         }
    //     })
    // }
    // $scope.receivePatients();

    // $scope.receiveVisits = (id, i) => {
    //     dataSrv.getVisits(id).then((response) => {
    //         // response.data.map(e => {
    //         //     e['delete?'] = 'x'
    //         // })
    //         $scope.gridOptions.data[i].subGridOptions = {
    //             data: response.data
    //         };
    //     })
    // };

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
'use strict';

angular.module('app').controller('usersCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, usersSrv) {

    var gridApi;

    $scope.selectArray = [];
    console.log('array: ', $scope.selectArray);

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
        onRegisterApi: function onRegisterApi(gridApi) {
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                console.log("chart: ", row);
                if (row.isSelected) {
                    $scope.selectArray = [row.entity.id];
                    console.log(row.entity.id);
                }
            });

            // gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //     console.log(rowEntity, 'you')
            //     console.log(colDef, 'better')
            //     console.log(newValue, 'work')
            //     console.log(oldValue, 'man')
            //     usersSrv.changePatient(rowEntity);
            // })

            $scope.receiveUsers = function () {
                usersSrv.getUsers().then(function (response) {
                    $scope.gridOptions.data = response.data;
                });
            };
            $scope.receiveUsers();
        }

    };

    // $scope.addPatient = () => {
    //     dataSrv.addNewPatient().then((response) => {})
    //     $scope.receivePatients();
    // };


    $scope.removeUser = function (id) {
        usersSrv.removeUser(id[0]).then(function (response) {});
        $scope.receiveUsers();
    };
});
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
    }, this.changeVisit = function () {
        return $http({
            url: '/api/updateVisit',
            method: 'PUT'
            // data: 
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
'use strict';

angular.module('app').service('usersSrv', function ($http) {

    this.getUsers = function () {
        return $http({
            url: '/api/getUsers',
            method: 'GET'
        });
    }, this.removeUser = function (id) {
        return $http({
            url: 'api/deleteUser/' + id,
            method: 'DELETE'
        });
    };
});
//# sourceMappingURL=bundle.js.map
