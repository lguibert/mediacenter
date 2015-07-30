app.factory('FilesFactory', ['$http', '$q', function ($http, $q) {

    var factory = {
        files: false,
        getFiles: function () {
            var deferred = $q.defer();
            $http.get(server + 'files/', {cache: true})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(null);
                });
            return deferred.promise;
        }
    }
    return factory;
}]);


app.controller('FilesController', ['$scope', '$rootScope', 'superCache', 'FilesFactory', 'LoadingState', function ($scope, $rootScope, superCache, FilesFactory, LoadingState) {
    var cache = superCache.get('files');

    if (cache) {
        $scope.files = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        $scope.files = FilesFactory.getFiles().then(function (data) {
            $scope.subfolders = data[0];
            $scope.files = data[1][0];

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }

    $scope.findChildren = function (data) {
        console.log(data);
    };
}]);