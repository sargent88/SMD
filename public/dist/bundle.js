'use strict';

angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.infiniteScroll', 'ui.grid.expandable']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html',
        user: function user(usersSrv) {
            usersSrv.getUserByAuthId().then(function (response) {
                console.log('user data: ', response);
            });
        }
    }).state('users', {
        url: '/users',
        templateUrl: './views/users.html',
        controller: 'usersCtrl',
        resolve: {
            authenticate: function authenticate(usersSrv, $state) {
                usersSrv.getUserByAuthId().then(function (response) {
                    if (response.data === 'unauthorized') {
                        $state.go('home');
                    }
                    return response.data;
                });
            }
        }
    }).state('data', {
        url: '/data',
        templateUrl: './views/data.html',
        controller: 'dataCtrl',
        resolve: {
            authenticate: function authenticate(usersSrv, $state) {
                usersSrv.getUserByAuthId().then(function (response) {
                    if (response.data === 'unauthorized') {
                        $state.go('home');
                    }
                    return response.data;
                });
            }
        }
    }).state('contact', {
        url: '/contact',
        templateUrl: './views/contact.html'
    });
});
'use strict';

angular.module('app').constant('config', {
    weatherAPI: '3c2c06ffa41e54040d66574f915f49cd',
    weatherZipCode: 84150
});
'use strict';

angular.module('app').controller('dataCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv, $window, authenticate) {

    var gridApi;

    $scope.selectedArray = [];

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
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: { fontSize: 9 },
        exporterPdfTableStyle: { margin: [20, 20, 20, 20] },
        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },
        exporterPdfHeader: { text: "SMD", style: 'headerStyle' },
        exporterPdfFooter: function exporterPdfFooter(currentPage, pageCount) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function exporterPdfCustomFormatter(docDefinition) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 600,
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable',
            clickMeSub: function clickMeSub(row) {
                dataSrv.removeVisit(row.entity.visit_id);
                alert('Visit #' + row.entity.visit_id + ' deleted') ? "" : location.reload();
            }
        },
        columnDefs: [{ name: 'id', displayName: 'ID', enableCellEdit: false, width: '5%' }, { name: 'firstname', displayName: 'First Name', width: '17%' }, { name: 'lastname', displayName: 'Last Name', width: '17%' }, { name: 'email', displayName: 'e-mail', width: '20%' }, { name: 'phone_num', displayName: 'Phone #', width: '12%' }, { name: 'dob', displayName: 'DOB' }, {
            name: 'gender',
            displayName: 'Gender',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'gender',
            editDropdownOptionsArray: [{ id: 'M', gender: 'M' }, { id: 'F', gender: 'F' }]
        }],
        onRegisterApi: function onRegisterApi(gridApi) {
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedArray = [row.entity.id];
                }
            });

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
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
                        onRegisterApi: function onRegisterApi(gridApi) {
                            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                                dataSrv.changeVisit(rowEntity);
                            });
                        },
                        columnDefs: [{ name: 'Del', cellTemplate: '<button class="btn primary" ng-click="grid.appScope.clickMeSub(row)">Delete</button>', width: '7%' }, { name: 'visit_id', displayName: 'Visit ID', enableCellEdit: false, width: '9%' }, { name: 'date', displayName: 'Date', width: '12%' }, { name: 'area_hurt', displayName: 'Area Hurt', width: '11%' }, { name: 'reason', displayName: 'Reason', width: '10%' }, { name: 'prescription', displayName: 'Prescription', width: '13%' }, { name: 'followup', displayName: 'Follow Up', width: '11%' }, { name: 'notes', displayName: 'Notes' }],
                        data: response.data
                    };
                });
            };
        }

    };

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

    //only have a limited amount of calls//

    // mainSrv.getWeather().then((res) => {
    //     $scope.weather = res.data;
    // })

});
'use strict';

angular.module('app').controller('usersCtrl', function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, usersSrv, $state, authenticate) {

    $scope.addUser = function (user) {
        usersSrv.addNewUser(user).then(function (response) {
            if (response.data = []) {
                $state.go('home');
            } else {
                alert('Try again.');
            }
        });
    };

    var gridApi;

    $scope.selectArray = [];

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
                if (row.isSelected) {
                    $scope.selectArray = [row.entity.id];
                }
            });

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                usersSrv.changeUsers(rowEntity);
            });

            $scope.receiveUsers = function () {
                usersSrv.getUsers().then(function (response) {
                    $scope.gridOptions = {
                        data: response.data,
                        columnDefs: [{ name: 'id', enableCellEdit: false }, { name: 'username', enableCellEdit: false }, {
                            name: 'type',
                            editableCellTemplate: 'ui-grid/dropdownEditor',
                            editDropdownValueLabel: 'type',
                            editDropdownOptionsArray: [{ id: 1, type: 1 }, { id: 2, type: 2 }, { id: 3, type: 3 }, { id: 4, type: 4 }]
                        }]
                    };
                });
            };
            $scope.receiveUsers();
        }

    };

    $scope.removeUser = function (id) {
        usersSrv.removeUser(id[0]).then(function (response) {});
        $scope.receiveUsers();
    };
});
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
    }, this.changeVisit = function (rowEntity) {
        return $http({
            url: '/api/updateVisit',
            method: 'PUT',
            data: rowEntity
        });
    }, this.removePatient = function (id) {
        return $http({
            url: '/api/deletePatient/' + id,
            method: 'DELETE'
        });
    }, this.removeVisit = function (visit_id) {
        // console.log(visit_id)
        return $http({
            url: '/api/deleteVisit/' + visit_id,
            method: 'DELETE'
        });
    };
});
'use strict';

angular.module('app').service('mainSrv', function ($http, config) {

    this.getWeather = function () {
        return $http({
            method: 'get',
            url: 'http://api.openweathermap.org/data/2.5/weather?zip=' + config.weatherZipCode + ',us&APPID=' + config.weatherAPI + '&units=imperial'

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
    }, this.changeUsers = function (rowEntity) {
        return $http({
            url: '/api/updateUsers',
            method: 'PUT',
            data: rowEntity
        });
    }, this.getUserByAuthId = function () {
        return $http({
            method: 'GET',
            url: '/security'
        }).catch(function (err) {
            return err;
        });
    };
});
//# sourceMappingURL=bundle.js.map
