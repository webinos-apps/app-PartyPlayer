/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2012, TNO
 *
 *  Based heavily on examples from the book TODO: insert reference to Strophe.js book
 */
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

