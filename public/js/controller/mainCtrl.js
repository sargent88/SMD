angular.module('app').controller('mainCtrl', function($scope, mainSrv) {
    $scope.weather = mainSrv.weather
})