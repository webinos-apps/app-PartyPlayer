$(document).ready(function() {
    $('head').append('<link rel=stylesheet href=../common/log.css type=text/css />');
    $('body').append('<h3 id=logtitle>Logging</h3><div id=log></div>');
    $('#logtitle').click(function(){
        $(this).next('#log').slideToggle('fast');
        return true;
    });

    var numlines = 0;
    window.log = function(message) {
        var logline = document.createElement('div');
        numlines++;
        logline.setAttribute('class', 'logline-' + ((numlines%2)?'even':'odd'));
        logline.innerHTML=message;
        var log = document.getElementById('log');
        log.insertBefore(logline, log.firstElementChild);
    };
});

