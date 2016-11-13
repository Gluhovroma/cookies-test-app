
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "LocalStorageModule",
    "services.auth-service",
    "services.cookies-data-service",
    "rx",
    'cgNotify',
]); 


MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout',
    };
    $rootScope.settings = settings;
    return settings;
}]);

MetronicApp.controller('HeaderController', ['$scope', 'authService', function($scope, authService) {
    $scope.authService = authService;
    console.log($scope.authService);
    console.log('HeaderController')
    $scope.logOut = function() {
        authService.logOut();
    }
}]);


MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/cookies");  
    
    $stateProvider

        // AngularJS plugins
        .state('login', {
            url: "/login",
            templateUrl: "public/pages/login/login.html",
            data: {pageTitle: 'Login'},
            controller: "LoginController",
            controllerAs: "login",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([                     
                    {
                        name: 'MetronicApp',
                        files: [
                            'public/pages/login/login-controller.js'
                        ]
                    }]);
                }]
            }
        })
        .state('cookies', {
            url: "/cookies",
            templateUrl: "public/pages/cookies-list/cookies-list.html",
            data: {pageTitle: 'Cookies list'},
            controller: "CookiesListController",
            controllerAs: "cookiesList",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([                    
                    {
                        name: 'MetronicApp',
                        files: [
                            'public/pages/cookies-list/cookies-list-controller.js'
                        ]
                    }]);
                }]
            }
        })
        .state('add-cookies', {
            url: "/add-cookies",
            templateUrl: "public/pages/cookies-add/cookies-add.html",
            data: {pageTitle: 'Add Cookies'},
            controller: "CookiesAddController",
            controllerAs: "cookiesAdd",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([                   
                    {
                        name: 'MetronicApp',
                        files: [
                            'public/pages/cookies-add/cookies-add-controller.js',
                            '../public/assets/global/plugins/angularjs/ngFileUpload.js',
                        ]
                    }]);
                }]
            }
        })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "authService", function($rootScope, settings, $state, authService) {
    
    authService.fillAuthData();
    Layout.initSidebar(); 
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);