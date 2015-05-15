/**
 * Created by Lucas on 12/05/2015.
 */
function displayMessage(message, type){
    if (message == null){
        message = "Une erreur est survenue.";
    }
    var act = $("div.message");
    act.addClass(type);
    act.html(message).addClass("bounceIn").show();
    setTimeout(function(){
        act.removeClass("bounceIn").addClass("bounceOut").delay(700).hide(0);
        refactorMessageContainer(act);
    },5000);
}

function refactorMessageContainer(target){
    setTimeout(function(){
        target.html('').removeClass().addClass('message');
    },700);
}