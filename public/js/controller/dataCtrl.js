angular.module('app').controller('dataCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv, $window) {

    var gridApi;

    $scope.selectedArray = []


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
            clickMeSub: function(row) {
                alert(`Visit #${row.entity.visit_id} deleted`);
                dataSrv.removeVisit(row.entity.visit_id)
            }
        },
        columnDefs: [
            { name: 'id', displayName: 'ID', enableCellEdit: false, width: '5%' },
            { name: 'firstname', displayName: 'First Name', width: '17%' },
            { name: 'lastname', displayName: 'Last Name', width: '17%' },
            { name: 'email', displayName: 'e-mail', width: '20%' },
            { name: 'phone_num', displayName: 'Phone #', width: '12%' },
            { name: 'dob', displayName: 'DOB' },
            {
                name: 'gender',
                displayName: 'Gender',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownValueLabel: 'gender',
                editDropdownOptionsArray: [
                    { id: 1, gender: 'male' },
                    { id: 2, gender: 'female' }
                ]
            }
        ],
        onRegisterApi: function(gridApi) {
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected) {
                    $scope.selectedArray = [row.entity.id]
                }
            })

            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                dataSrv.changePatient(rowEntity);
            })

            $scope.receivePatients = () => {
                dataSrv.getPatients().then((response) => {
                    $scope.gridOptions.data = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.receiveVisits(response.data[i].id, i)
                    }
                })
            }
            $scope.receivePatients();



            $scope.receiveVisits = (id, i) => {
                dataSrv.getVisits(id).then((response) => {


                    $scope.gridOptions.data[i].subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        onRegisterApi: function(gridApi) {
                            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                                dataSrv.changeVisit(rowEntity);
                            })
                        },
                        columnDefs: [
                            { name: 'Del', cellTemplate: `<button class="btn primary" ng-click="grid.appScope.clickMeSub(row)">Delete</button>`, width: '7%' },

                            { name: 'visit_id', displayName: 'Visit ID', enableCellEdit: false, width: '9%' },
                            { name: 'date', displayName: 'Date', width: '12%' },
                            { name: 'area_hurt', displayName: 'Area Hurt', width: '11%' },
                            { name: 'reason', displayName: 'Reason', width: '10%' },
                            { name: 'prescription', displayName: 'Prescription', width: '13%' },
                            { name: 'followup', displayName: 'Follow Up', width: '11%' },
                            { name: 'notes', displayName: 'Notes' }
                        ],
                        data: response.data
                    };
                })
            };

        }

    };


    $scope.addPatient = () => {
        dataSrv.addNewPatient().then((response) => {})
        $scope.receivePatients();
    };

    $scope.addVisit = (id) => {
        dataSrv.addNewVisit(id[0]).then((response) => {})
        $scope.receivePatients();
    };


    $scope.removePatient = (id) => {
        dataSrv.removePatient(id[0]).then((response) => {})
        $scope.receivePatients();
    };




    $scope.toggleFilterRow = function() {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };



});