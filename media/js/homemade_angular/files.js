app.factory('FilesFactory', ['$http', '$q', '$sce', function ($http, $q, $sce) {
    //var idtocheck = 3;
    var factory = {
        files: false,
        getFiles: function () {
            var deferred = $q.defer();
            $http.get(server + 'files/', {cache: true})
                .success(function (data) {
                    /*for(var i = 0; i < data.length; i++){
                        data[i][idtocheck] = $sce.trustAsHtml(data[i][idtocheck]);
                    }*/

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


app.controller('FilesController', ['$scope', '$rootScope', 'superCache', 'FilesFactory', 'LoadingState', '$sce', '$compile', function ($scope, $rootScope, superCache, FilesFactory, LoadingState, $sce, $compile) {
    var cache = superCache.get('files');

    if (cache) {
        $scope.files = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        $scope.files = FilesFactory.getFiles().then(function (data) {
            $scope.data = data;

            console.debug(data);

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }

    $scope.findChildren = function (folder) {
        console.log('find children: '+ folder);
        FilesFactory.getFile(encodeURL(folder)).then(function (data) {
            $scope.data = data;
        });
    };

    $scope.traceNavigation = function (root){
        console.log(root);
        var splitroot = root.split("/");
        var trace = '';
        var allpath = [];
        var y = 0;
        var path = '';

        for(var i = 0; i < splitroot.length; i++){
            path = path + splitroot[i] + '/';

            if(i <= y){
                allpath.push([path, splitroot[i]]);
            }

            y++;
        }

        for(var i = 0; i < allpath.length; i++){
            trace = trace + "<a href='' ng-click='findChildren(\"" + encodeURL(allpath[i][0]) + "\")'>" + allpath[i][1] + '/' + "</a>";
        }

        return trace;
    };

    function encodeURL(string) {
        var toReplace = [" ", "/"];
        var inReplace = ["+", "%2F"];

        for (var i = 0; i < toReplace.length; i++) {
            var re = new RegExp(toReplace[i], "g");
            string = string.replace(re, inReplace[i]);
        }

        return string;
    }

}]);

app.directive('traceNav', function($compile){
    return {
        restrict: 'AE',
        link: function(scope, element, attrs){
            scope.$watch("data", function(){
                var trace = scope.traceNavigation(attrs.root);
                traced = $compile(trace)(scope);

                element.empty().append(traced);
            });

        }
    }
});