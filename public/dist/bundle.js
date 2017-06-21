'use strict';

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html'
    }).state('users', {
        url: '/users',
        templateUrl: './views/users.html'
    }).state('client', {
        url: '/client',
        templateUrl: './views/client.html'
    }).state('data', {
        url: '/data',
        templateUrl: './views/data.html'
        // controller: './js/controller/dataCtrl.js'
    }).state('location', {
        url: 'location',
        templateUrl: './views/location.html'
    });
});
"use strict";
"use strict";
'use strict';

angular.module('app').controller('dataCtrl', function (dataSrv, $scope) {});
'use strict';

angular.module('app').controller('mainCtrl', function ($scope, mainSrv) {
    $scope.weather = mainSrv.weather;
});
"use strict";
"use strict";
'use strict';

angular.module('app').controller('dataCtrl', function ($http) {});
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
//# sourceMappingURL=bundle.js.map
