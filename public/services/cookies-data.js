    angular.module('services.cookies-data-service', [

    ])
    .service('cookiesData', ['$http', '$q', 'localStorageService','rx', function ($http, $q, localStorageService, rx) {

        //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
        
        var cookiesData = {};

        var _getData = function (filter, offset) {           

            var deferred = $q.defer();

            $http.get('/api/cookies?filter='+filter+'&offset='+ offset)
            	.then(function (response) {
	            	deferred.resolve(response.data);
            	}, 
            	function(error) {
            	  	deferred.reject(error);
            	})

            return deferred.promise;

        };

        var _likeCookies = function(id) {

        	var deferred = $q.defer();

            $http.get('/api/like-cookies/' + id)
            	.then(function (response) {
	            	deferred.resolve();
            	}, 
            	function(error) {
            	  	deferred.reject(error);
            	})

            return deferred.promise;
        };

        var _dislikeCookies = function(id) {

        	var deferred = $q.defer();

            $http.get('/api/dislike-cookies/' + id)
            	.then(function (response) {
	            	deferred.resolve();
            	}, 
            	function(error) {
            	  	deferred.reject(error);
            	})

            return deferred.promise;
        };

        var _сheckLikeCookiesExisting = function(item, userId) {
            var deferred = $q.defer();

            if (!item.likes) {
                item.likes = [];
            };
            console.log(item.likes);
            console.log(userId);
            _observableLikeCookiesExisting(item.likes, userId)
                .then(function() {
                    
                    if (!item.dislikes) {
                        item.dislikes = [];
                    };
                    
                    _observableLikeCookiesExisting(item.dislikes, userId)
                        .then(function() {
                            deferred.resolve();
                        },
                        function() {
                            deferred.reject();
                        })         
                    
                },
                function() {
                    console.log("here1");
                    deferred.reject();
                })     


            return deferred.promise;

        }

        var _observableLikeCookiesExisting = function(items, userId) {

            var deferred = $q.defer();
           
            var existCondition = false;
            
            var observable = rx.Observable
                .from(items)
                .filter(function(item) { 
                   
                    return item == userId
                })
                .subscribe(
                  function onNext(value){
                    if (value) {                        
                        existCondition = true;                        
                    }
                  }, 
                  angular.noop, 
                  function onCompleted() {
                    
                    if (existCondition == true) {
                        console.log("no");
                        deferred.reject();                        
                    }
                    else {
                        console.log("yes");
                        deferred.resolve();
                    }                    
                }); 
           return deferred.promise;
        };

          


        cookiesData.getData = _getData;
        cookiesData.likeCookies = _likeCookies;
        cookiesData.dislikeCookies = _dislikeCookies;
        cookiesData.сheckLikeCookiesExisting = _сheckLikeCookiesExisting
        return cookiesData;
    }])