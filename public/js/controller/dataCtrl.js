angular.module('app').controller('dataCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv) {


    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.receivePatients = () => {
        dataSrv.getPatients().then((response) => {
            console.log(response)
            $scope.gridOptions.data = response.data;
        })
    }
    $scope.receivePatients();
});