angular.module('MetronicApp', ['ngFileUpload', 'ui.router'])
	.controller('CookiesAddController', ['$rootScope', '$scope', 'settings', '$http','$state', 'Upload', 'authService', 'notify',  function($rootScope, $scope, settings, $http, $state, Upload, authService, notify) {
	    $scope.$on('$viewContentLoaded', function() {   
	    	
	    	$rootScope.settings.layout.pageContentWhite = true;
	        $rootScope.settings.layout.pageBodySolid = false;
	        $rootScope.settings.layout.pageSidebarClosed = false;
	    });
	    var cookiesAdd = this;
	    cookiesAdd.cookies = {
	    	'title': "",
	    	'description': "",
	    	"img": null
	    };
	   
	    

	    cookiesAdd.save = function(form) {
	    	
	    	if (form.$valid) { 
	    		
	    		var formData = new FormData();                     
	       
		        formData.append("photo_file", cookiesAdd.cookies.img);          
		        formData.append("title", cookiesAdd.cookies.title);            
		        formData.append("description", cookiesAdd.cookies.description);

		        $http.post('http://localhost:8000/api/add-cookies', formData, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        })
		        .then(function(response){
			       	notify({
	                    message: "Печенька успешно добавлена.",
	                    templateUrl: '',
	                    position: 'right',
	                    classes: ".alert-danger",
	                    duration: 5000
	                });
		            $state.go("cookies");
		        }, function(err) {
		        	if (err.status == 401) {
                        notify({
		                    message: "Ошибка авторизации, пожалуйста, авторизуйтесь повторно!",
		                    templateUrl: '',
		                    position: 'right',
		                    classes: ".alert-danger",
		                    duration: 5000
	                	});
                        authService.logOut();
                        $state.go("login");
                    }
                    else {
                    	notify({
		                    message: "Произошла ошибка",
		                    templateUrl: '',
		                    position: 'right',
		                    classes: ".alert-danger",
		                    duration: 5000
	                	});
                    }
		        })   
	    	}


	  
	          
	    }
	}]);
