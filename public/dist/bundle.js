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
    }).state('data', {
        url: '/data',
        templateUrl: './views/data.html',
        controller: 'dataCtrl'
    }).state('location', {
        url: '/location',
        templateUrl: './views/location.html'
    }).state('register', {
        url: '/register',
        templateUrl: './views/register.html',
        controller: 'usersCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: './views/login.html'
    }).state('change-password', {
        url: '/change-password',
        templateUrl: './views/changePassword.html',
        controller: 'usersCtrl'
    }).state('change-username', {
        url: '/change-username',
        templateUrl: './views/changeUsername.html',
        controller: 'usersCtrl'
    });
});
"use strict";
'use strict';

angular.module('app').controller('dataCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv, $window) {

    var gridApi;

    $scope.selectedArray = [];
    // $scope.selectedSubArray = []
    console.log($scope.selectedArray);

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
            subGridVariable: 'subGridScopeVariable',
            clickMeSub: function clickMeSub(row) {
                alert('hi ' + row.entity.name);
            }
        },
        columnDefs: [{ name: 'id', displayName: 'ID', enableCellEdit: false, width: '5%' }, { name: 'firstname', displayName: 'First Name', width: '17%' }, { name: 'lastname', displayName: 'Last Name', width: '17%' }, { name: 'email', displayName: 'e-mail', width: '20%' }, { name: 'phone_num', displayName: 'Phone #', width: '12%' }, { name: 'dob', displayName: 'DOB' }, {
            name: 'gender',
            displayName: 'Gender',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'gender',
            editDropdownOptionsArray: [{ id: 1, gender: 'male' }, { id: 2, gender: 'female' }]
        }],
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

            $scope.receiveVisits = function (id, i) {
                dataSrv.getVisits(id).then(function (response) {

                    $scope.gridOptions.data[i].subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        columnDefs: [{ name: 'id', cellTemplate: '<button class="btn primary" ng-click="grid.appScope.clickMeSub(row)">Click Me</button>', width: '7%' }, { name: 'visit_id', displayName: 'Visit ID', enableCellEdit: false, width: '9%' }, { name: 'date', displayName: 'Date', width: '12%' }, { name: 'area_hurt', displayName: 'Area Hurt', width: '11%' }, { name: 'reason', displayName: 'Reason', width: '10%' }, { name: 'prescription', displayName: 'Prescription', width: '13%' }, { name: 'followup', displayName: 'Follow Up', width: '11%' }, { name: 'notes', displayName: 'Notes' }],
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

angular.module('app').controller('usersCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, usersSrv, $state) {

    $scope.addUser = function (user) {
        usersSrv.addNewUser(user).then(function (response) {
            if (response.data = []) {
                $state.go('home');
            } else {
                alert('Try again.');
            }
        });
    };

    $scope.changePassword = function (user) {
        usersSrv.updatePassword(user).then(function (response) {
            if (response.data = []) {
                $state.go('home');
            } else {
                alert('Try again.');
            }
        });
    };

    $scope.changeUsername = function (user) {
        usersSrv.updateUsername(user).then(function (response) {
            if (response.data = []) {
                $state.go('home');
            } else {
                alert('Try again.');
            }
        });
    };

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
                    $scope.gridOptions = {
                        data: response.data,
                        columnDefs: [{ name: 'id', enableCellEdit: false }, { name: 'username' }, {
                            name: 'type',
                            editableCellTemplate: 'ui-grid/dropdownEditor',
                            editDropdownValueLabel: 'type',
                            editDropdownOptionsArray: [{ id: 1, type: 'a' }, { id: 2, type: 'b' }, { id: 3, type: 'c' }, { id: 4, type: 'd' }]
                        }]
                    };
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
            url: '/api/deletePatient/' + id,
            method: 'DELETE'
        });
    }, this.removeVisit = function (visit_id) {
        return $http({
            url: '/api/deleteVisit/' + visit_id,
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
            url: '/api/deleteUser/' + id,
            method: 'DELETE'
        });
    }, this.addNewUser = function (user) {
        return $http({
            url: '/api/addUser',
            method: 'POST',
            data: user
        });
    }, this.updatePassword = function (user) {
        return $http({
            url: '/api/updatePassword',
            method: 'PUT',
            data: user
        });
    }, this.updateUsername = function (user) {
        return $http({
            url: '/api/updateUsername',
            method: 'PUT',
            data: user
        });
    };
});
//# sourceMappingURL=bundle.js.map
