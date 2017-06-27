angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.infiniteScroll', 'ui.grid.expandable'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/home.html'
            })
            .state('users', {
                url: '/users',
                templateUrl: './views/users.html',
                controller: 'usersCtrl'
            })
            .state('data', {
                url: '/data',
                templateUrl: './views/data.html',
                controller: 'dataCtrl'
            })
            .state('location', {
                url: '/location',
                templateUrl: './views/location.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: './views/register.html',
                controller: 'usersCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: './views/login.html'
            })
            .state('change-password', {
                url: '/change-password',
                templateUrl: './views/changePassword.html',
                controller: 'usersCtrl'
            })
            .state('change-username', {
                url: '/change-username',
                templateUrl: './views/changeUsername.html',
                controller: 'usersCtrl'
            })
    })