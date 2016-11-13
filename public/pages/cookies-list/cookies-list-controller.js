/* Setup general page controller */
angular.module('MetronicApp').controller('CookiesListController', ['$rootScope', '$scope', 'settings', '$http', 'cookiesData', 'authService', 'rx', '$state','notify', function($rootScope, $scope, settings, $http, cookiesData, authService, rx, $state, notify) {
    
    $scope.$on('$viewContentLoaded', function() {   
    
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    
    });

    var cookiesList = this;

    cookiesList.offset;
    cookiesList.filter = 1;
    cookiesList.cookies = [];    

    cookiesList.load = function(filter) {
        cookiesList.filter = filter;
        cookiesList.offset = 0;
        cookiesData.getData(cookiesList.filter, cookiesList.offset)
            .then(function(data) {
                cookiesList.cookies = data;                
            },
            function(err) {
                notify({
                    message: err,
                    templateUrl: '',
                    position: 'right',
                    classes: ".alert-danger",
                    duration: 5000
                });                
            })
        
    }
    cookiesList.getOffset = function() {
        cookiesList.offset++;
        cookiesData.getData(cookiesList.filter, cookiesList.offset)
            .then(function(data) {
                cookiesList.cookies =  cookiesList.cookies.concat(data);
            },
            function(err) {
                notify({
                    message: err,
                    templateUrl: '',
                    position: 'right',
                    classes: ".alert-danger",
                    duration: 5000
                });
            })
    }   

    cookiesList.likeCookies = function(item) {
        if (authService.authentication.isAuth) {
            cookiesData.сheckLikeCookiesExisting(item, authService.authentication.userId)
                .then(function() {
                    cookiesData.likeCookies(item.id)
                                .then(function() {
                                    console.log(authService.authentication.userId);
                                    item.likes.push(authService.authentication.userId)
                                }, 
                                function(err) {
                                    if (err.status == 401) {
                                        notify({
                                            message: "Для голосования необходимо авторизоваться!",
                                            templateUrl: '',
                                            position: 'right',
                                            classes: ".alert-danger",
                                            duration: 5000
                                        });
                                        authService.logOut();
                                    }                    
                                })    
                },
                function() {
                    notify({
                        message: "Вы уже сделали свой выбор!",
                        templateUrl: '',
                        position: 'right',
                        classes: ".alert-danger",
                        duration: 5000
                    });
                })
                        
        }
        else {
            notify({
                message: "Для голосования необходимо авторизоваться!",
                templateUrl: '',
                position: 'right',
                classes: ".alert-danger",
                duration: 5000
            });
        }       
    }

    cookiesList.dislikeCookies = function(item) {
        if (authService.authentication.isAuth) {
             cookiesData.сheckLikeCookiesExisting(item, authService.authentication.userId)
                .then(function() {
                    cookiesData.dislikeCookies(item.id)
                                .then(function() {
                                    item.dislikes.push(authService.authentication.userId)
                                }, 
                                function(err) {
                                    if (err.status == 401) {
                                        notify({
                                            message: "Для голосования необходимо авторизоваться!",
                                            templateUrl: '',
                                            position: 'right',
                                            classes: ".alert-danger",
                                            duration: 5000
                                        });
                                        authService.logOut();
                                    }                    
                                })    
                },
                function() {
                     notify({
                        message: "Вы уже сделали свой выбор!",
                        templateUrl: '',
                        position: 'right',
                        classes: ".alert-danger",
                        duration: 5000
                    });
                })
        
        }
        else {
            notify({
                message: "Для голосования необходимо авторизоваться!",
                templateUrl: '',
                position: 'right',
                classes: ".alert-danger",
                duration: 5000
            });
        }      
    }

    cookiesList.countLikes = function(item) {
        if (!item)
            return 0
        else 
            return item.length
    }
    cookiesList.openAddCookiesPage = function() {
        if (authService.authentication.isAuth) {
            $state.go('add-cookies');
        }
        else {
            // show toast
            notify({
                message: "Вы не имеете доступа к данной странице. Пожалуйста авторизуйтесь.",
                templateUrl: '',
                position: 'right',
                classes: ".alert-danger",
                duration: 5000
            });
            
        }
    }

    cookiesList.load(cookiesList.filter);

}]);
