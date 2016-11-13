angular.module('MetronicApp').controller('LoginController', ['$rootScope', '$scope', 'settings', '$http','authService', '$state', function($rootScope, $scope, settings, $http, authService, $state) {
    
    var login = this;

    $scope.$on('$viewContentLoaded', function() {       
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    login.loginData = {username: '', password: ''};
	login.error_message = '';
    login.success_message = '';

	login.submit = function(form) {
	   
       
        if (form.$valid) {
            authService.login(login.loginData).then(function (response) {
                console.log(response);
                login.success_message = "Здравствуйте " + response.data.userName + ", вы успешно авторизовались! Через 3 секунды вы будете перенаправлены на список печенек!";
                
                login.error_message = '';
                setTimeout(function() {
                    $state.go('cookies');
                }, 3000);
            },
            function (err) {    
                login.success_message = '';        
                console.log(err);
                login.error_message = err
            });  
        }
	
	}

}]);