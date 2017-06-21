angular.module('app').controller('dataCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv) {

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
        }
    };
    $scope.receivePatients = () => {
        dataSrv.getPatients().then((response) => {
            $scope.gridOptions.data = response.data;
        })
    }
    $scope.receivePatients();

    $scope.toggleFilterRow = function() {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.callsPending = 0;

    var i = 0;
    $scope.refreshData = function() {
        $scope.myData = [];

        var start = new Date();
        var sec = $interval(function() {
            $scope.callsPending++;

            $http.get('/api/getPatients')
                .success(function(data) {
                    $scope.callsPending--;

                    data.forEach(function(row) {
                        row.id = i;
                        i++;
                        row.registered = new Date(row.registered)
                        $scope.myData.push(row);
                    });
                })
                .error(function() {
                    $scope.callsPending--
                });
        }, 200, 10);


        var timeout = $timeout(function() {
            $interval.cancel(sec);
            $scope.left = '';
        }, 2000);

        $scope.$on('$destroy', function() {
            $timeout.cancel(timeout);
            $interval.cancel(sec);
        });
    };

});