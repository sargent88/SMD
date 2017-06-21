angular.module('app', ['ui.router'])
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
                templateUrl: './views/data.html'
                    // controller: './js/controller/dataCtrl.js'
            })
            .state('location', {
                url: 'location',
                templateUrl: './views/location.html'
            })
    })