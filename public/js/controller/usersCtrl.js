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

    $scope.changePassword = (user) => {
        usersSrv.updatePassword(user).then((response) => {
            if (response.data = []) {
                $state.go('home')
            } else {
                alert('Try again.')
            }
        })
    }

    $scope.changeUsername = (user) => {
        usersSrv.updateUsername(user).then((response) => {
            if (response.data = []) {
                $state.go('home')
            } else {
                alert('Try again.')
            }
        })
    }


    var gridApi;

    $scope.selectArray = []
    console.log('array: ', $scope.selectArray)

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
                console.log("chart: ", row)
                if (row.isSelected) {
                    $scope.selectArray = [row.entity.id]
                    console.log(row.entity.id)
                }
            })

            // gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //     console.log(rowEntity, 'you')
            //     console.log(colDef, 'better')
            //     console.log(newValue, 'work')
            //     console.log(oldValue, 'man')
            //     usersSrv.changePatient(rowEntity);
            // })

            $scope.receiveUsers = () => {
                usersSrv.getUsers().then((response) => {
                    $scope.gridOptions.data = response.data;
                })
            }
            $scope.receiveUsers();

        }

    };






    // $scope.addPatient = () => {
    //     dataSrv.addNewPatient().then((response) => {})
    //     $scope.receivePatients();
    // };


    $scope.removeUser = (id) => {
        usersSrv.removeUser(id[0]).then((response) => {})
        $scope.receiveUsers();
    };




});