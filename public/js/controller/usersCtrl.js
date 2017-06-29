angular.module('app').controller('usersCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, usersSrv, $state) {


    $scope.addUser = (user) => {
        usersSrv.addNewUser(user).then((response) => {
            if (response.data = []) {
                $state.go('home')
            } else {
                alert('Try again.')
            }
        })

    }



    var gridApi;

    $scope.selectArray = []

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
        onRegisterApi: function(gridApi) {
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected) {
                    $scope.selectArray = [row.entity.id]
                }
            })

            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                usersSrv.changeUsers(rowEntity);
            })

            $scope.receiveUsers = () => {
                usersSrv.getUsers().then((response) => {
                    $scope.gridOptions = {
                        data: response.data,
                        columnDefs: [
                            { name: 'id', enableCellEdit: false },
                            { name: 'username', enableCellEdit: false },
                            {
                                name: 'type',
                                editableCellTemplate: 'ui-grid/dropdownEditor',
                                editDropdownValueLabel: 'type',
                                editDropdownOptionsArray: [
                                    { id: 1, type: 1 },
                                    { id: 2, type: 2 },
                                    { id: 3, type: 3 },
                                    { id: 4, type: 4 }
                                ]
                            }
                        ]
                    };
                })
            }
            $scope.receiveUsers();

        }

    };



    $scope.removeUser = (id) => {
        usersSrv.removeUser(id[0]).then((response) => {})
        $scope.receiveUsers();
    };




});