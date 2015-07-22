var server = "http://mediacenter.lucasguibert.com:8000/";

app.controller('SettingsController', ['$scope', '$http','superCache', function($scope, $http, superCache){
    var cache = superCache.get('settings');

    if(cache){
        $scope.settings = cache;
    }else{
        $http.get(server+'settings/', {cache: true})
            .success(function(data){
                $scope.settings = data;
                superCache.put('settings', data);
            })
            .error(function(data){
                displayMessage(data, 'error');
            });
    }

    $scope.deleteSetting = function(input){
        var testable = ['folder', 'video', 'audio'];
        for (var i = 0; i < testable.length; i++){
            if(input[testable[i]]){
                var final = input[testable[i]];
                var category = testable[i];
                break;
            }
        }

        $http.get(server + 'settings/delete/'+category+'/'+encodeURIComponent(final))
            .success(function(data){
                superCache.put('settings', data);
                $scope.settings = data;
            })
            .error(function(data){
               displayMessage(data, 'error');
            });

    }

    $scope.submit = function(){
        var value = encodeURIComponent($scope.newData);
        var category = $scope.category;

        console.log(value);

        $http.get(server+'settings/add/'+category+'/'+value+"")
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
