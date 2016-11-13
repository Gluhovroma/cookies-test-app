    angular.module('services.auth-service', [

    ])
    .service('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

      
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            userId: ""
        };

        var _login = function (loginData) {           

            var deferred = $q.defer();

            $http.post('/auth/login', loginData)
            	.then(function (response) {
	            	if(response.data.state == 'success') {
                        var user = {
                            userName: response.data.user[0].login,
                            id: response.data.user[0].id
                        }
						localStorageService.set('authorizationData', user);
	                	_authentication.isAuth = true;
	                	_authentication.userName = user.userName;
	                	_authentication.userId = user.id;
	                	deferred.resolve(response);
	            	}
	            	else {
	            		_logOut();
                        console.log(response.data);
	                	deferred.reject(response.data.message);
	            	}
            	}, 
            	function(error) {
            		_logOut();
                	deferred.reject(response.data.message);
            	})

            return deferred.promise;

        };

        var _logOut = function () {
            $http.get('/auth/signout')
                .then(function (response) {
                    localStorageService.remove('authorizationData');
                    _authentication.isAuth = false;
                    _authentication.userName = "";
                })
            

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                console.log(authData);
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.userId = authData.id;
            }

        }

     
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }])