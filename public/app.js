angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/home.html'
            })
            .state('users', {
                url: '/users',
                templateUrl: './views/users.html'
            })
            .state('client', {
                url: '/client',
                templateUrl: './views/client.html'
            })
            .state('data', {
                url: '/data',
                templateUrl: './views/data.html',
                controller: 'dataCtrl'
            })
            .state('location', {
                url: 'location',
                templateUrl: './views/location.html'
            })
    })