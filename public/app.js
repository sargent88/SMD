angular.module('app', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.infiniteScroll', 'ui.grid.expandable'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/home.html',
                user: function(usersSrv) {
                    usersSrv.getUserByAuthId().then(response => {
                        console.log('user data: ', response)
                    })
                }
            })
            .state('users', {
                url: '/users',
                templateUrl: './views/users.html',
                controller: 'usersCtrl',
                resolve: {
                    authenticate: function(usersSrv, $state) {
                        usersSrv.getUserByAuthId().then(response => {
                            console.log('data: ', response)
                            if (response.data === 'unauthorized') {
                                $state.go('home')
                            }
                            return response.data
                        })
                    }
                }
            })
            .state('data', {
                url: '/data',
                templateUrl: './views/data.html',
                controller: 'dataCtrl',
                resolve: {
                    authenticate: function(usersSrv, $state) {
                        usersSrv.getUserByAuthId().then(response => {
                            if (response.data === 'unauthorized') {
                                $state.go('home')
                            }
                            return response.data
                        })
                    }
                }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: './views/contact.html'
            })
    })