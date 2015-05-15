app.factory('FilesFactory', ['$http', '$q', function($http, $q){

    var factory = {
        files : false,
        getFiles : function(){
            var deferred = $q.defer();
            $http.get(server+'files/get/', {cache: true})
                .success(function(data){
                    deferred.resolve(data);
                })
                .error(function(data){
                    deferred.reject(null);
                });
            return deferred.promise;
        }
    }
    return factory;
}]);


app.controller('FilesController', ['$scope', 'superCache', 'FilesFactory',  function($scope, superCache, FilesFactory){
    var cache = superCache.get('files');

    if(cache){
        $scope.files = cache;
    }else{
        $scope.loading = true;
       $scope.files = FilesFactory.getFiles().then(function(data){
           $scope.subfolders = data[0][0];
           $scope.files = data[1];
           $scope.loading = false;
       }, function(msg){
           $scope.loading = false;
           displayMessage(msg, "error");
       });
    }

    $scope.findChildren = function(data){
        console.log(data);
    };
}]);