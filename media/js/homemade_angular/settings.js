//var server = "//192.168.146.131:8000/";
//var server = "//192.168.0.22:8000/";
//var server = "//10.133.50.9:8000/";
var server = "http://85.169.162.187:8000/";

app.controller('SettingsController', ['$scope', '$http','superCache', function($scope, $http, superCache){
    var cache = superCache.get('settings');

    if(cache){
        $scope.settings = cache;
    }else{
        $http.get(server+'setting/get/', {cache: true})
            .success(function(data){
                $scope.settings = data;
                superCache.put('settings', data);
            })
            .error(function(data){
                displayMessage(data, 'error');
            });
    }

    $scope.deleteSetting = function(input){
        //FAUDRA VIRER CA
        var testable = ['folder', 'video', 'audio'];
        for (var i = 0; i < testable.length; i++){
            if(input[testable[i]]){
                var final = input[testable[i]];
                var category = testable[i];
                break;
            }
        }
        //JUSQUE LA

        $http.get(server + 'setting/delete/'+category+'/'+final+'/')
            .success(function(data){
                superCache.put('settings', data);
                $scope.settings = data;
            })
            .error(function(data){
               displayMessage(data, 'error');
            });

    }

    function htmlEntities(str) {
        return String(str).replace('/', '//');
    }

    $scope.submit = function(){
        var value = htmlEntities($scope.newData);
        var category = $scope.category;

        $http.get(server+'setting/add/'+category+'/'+value+'/')
            .success(function(data){
                superCache.put('settings', data);
                $scope.settings = data;
                $('div[container="'+category+'"]').find('input[type="text"]').val("");
            })
            .error(function(data){
                displayMessage(data, 'error');
            });
    };
}]);
