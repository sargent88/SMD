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
                controller: 'usersCtrl',
                resolve: {
                    // authenticate: function(usersSrv, $state, $rootScope) {
                    //     usersSrv.getUsers().then(response => {
                    //         if (response === 'NOPE') {
                    //             event.preventDefault()
                    //             $state.go("login")
                    //         }
                    //     })
                    // }
                }
            })
            .state('data', {
                url: '/data',
                templateUrl: './views/data.html',
                controller: 'dataCtrl',
                resolve: {
                    // authenticate: function(usersSrv, $state, $rootScope) {
                    //     usersSrv.getUsers().then(response => {
                    //         if (response === 'NOPE') {
                    //             event.preventDefault()
                    //             $state.go("login")
                    //         }
                    //     })
                    // }
                }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: './views/contact.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: './views/login.html'
            })
    })