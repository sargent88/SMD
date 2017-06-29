angular.module('app').controller('mainCtrl', function($scope, mainSrv) {

    //only have a limited amount of calls//

    mainSrv.getWeather().then((res) => {
        $scope.weather = res.data;
    })

})