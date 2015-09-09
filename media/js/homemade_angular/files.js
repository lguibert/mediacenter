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
        },
        getFile: function (folder) {
            var deferred = $q.defer();
            $http.get(server + 'files/' + folder, {cache: true})
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
            $scope.rootFolder = data[2];

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }

    $scope.findChildren = function (folder) {
        FilesFactory.getFile(encodeURL(folder)).then(function (data) {
            $scope.subfolders = data[0];
            $scope.files = data[1][0];
            $scope.rootFolder = data[2];
        });
    };

    function encodeURL(string) {
        var toReplace = [" ", "/"];
        var inReplace = ["+", "%2F"];

        for (var i = 0; i < toReplace.length; i++) {
            var re = new RegExp(toReplace[i], "g");
            string = string.replace(re, inReplace[i]);
        }

        return string
    }
}]);