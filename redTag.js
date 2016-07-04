/**
 * redTag library.
 *
 * @ v2.0.0
 * @
 * @ Helper class created to facilitate a/b testing development process;
 * @ Contains methods that that are dependent of jQuery and Optimizely
 * @ Created by Robert Vilcu : http://crafton.ro
 * @ https://github.com/vilcuRob/redTag/
 * @ 02 July 2016
 * @
 */

(function (window, redTag) {
    'use strict';

    // Set the libraries dependencies
    const $ = window.jQuery = window.$ || 'undefined';
    const optimizely = window.optimizely || [];

    // Check if object is empty
    var isEmpty = function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    // If redTag obj is empty return false;
    if(!isEmpty(redTag)){ return false; }

    redTag = function(){

        /* -------------------------------------------------------
        * redTag config and init:
        * Configs static variables and initiates fn
        */

        this.config = function(config){
            var config = config || {};

            /*
            * Public redTag config:
            * optyLog    = bolean = console logs custom optimizely Log
            * tagErrors  = bolean = console logs internal library errors
            * goalsQa    = bolean = console logs the event when is triggered
            */

            this.optyLog    = config.optyLog || false;
            this.tagErrors  = config.tagErrors || false;
            this.goalsQa    = config.goalsQa || false;

            // Check dependencies first
            if(this.tagErrors===true){ checkForDependencies(); }
            if(this.optyLog===true){ this.logOptimizely(); }
        }

        /* -------------------------------------------------------
        * redTag methods:
        * Created to facilitate the work with redTag
        */

        // Private method = check for dependencies
        var checkForDependencies = function(){
            if($ === 'undefined'){
                consoleLog('jQuery is not available');
            }
            if(!optimizely || optimizely.length === 0 || typeof optimizely!== "object" || isEmpty(optimizely)){
                consoleLog('Optimizely is not available');
            }
        }

        // Private method - fancy console log message
        var timesLogged = 0;
        var consoleLog = function(msg){
            timesLogged++;
            console.log('%c['+timesLogged+']'+
                        '%c[redTag]:' +
                        '%c '+msg,
                        'color:black;',
                        'color:red;',
                        'color:blue;');
        };

        /* -------------------------------------------------------
        * Optimizely methods:
        * Created to help interact with Optimizely's API
        */

        // Public method - Set Optimizely Custom Event
        this.triggerEvent = function(eventName){
            optimizely.push(["trackEvent", eventName]);
            if(this.goalsQa === true){
                consoleLog('"'+eventName+'" event was triggered');
            }
        }

        // Public method - Log Optimizely
        this.logOptimizely = function() { optimizely.push('log'); }

        /* -------------------------------------------------------
        * Helper methods:
        * Created to help with common tasks
        */

        // Public method - Set Cookie
        this.setCookie = function(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }

        // Public method - Read Cookie
        this.readCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        // Public method - Delete Cookie
        this.deleteCookie = function(name) {
            this.setCookie(name,"",-1);
        }

        // Public method - Wait for xhr finish
        this.ajaxFin = function(callback){
            var oldSend, i;
            if( XMLHttpRequest.callbacks ) {
                // we've already overridden send() so just add the callback
                XMLHttpRequest.callbacks.push(callback);
            } else {
                // create a callback queue
                XMLHttpRequest.callbacks = [callback];
                // store the native send()
                oldSend = XMLHttpRequest.prototype.send;
                // override the native send()
                XMLHttpRequest.prototype.send = function(){
                    // process the callback queue
                    // the xhr instance is passed into each callback but seems pretty useless
                    // you can't tell what its destination is or call abort() without an error
                    // so only really good for logging that a request has happened
                    for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                        XMLHttpRequest.callbacks[i](this);
                    }
                    // call the native send()
                    oldSend.apply(this, arguments);
                }
            }
        }

        // Public method - When condition is true, do logic
        this.whenTrue = function(config) {
            var config    = config || {},
                count     = 0,
                timeoutFn = '',
                condition = config.condition || function(){ return true; },
                callback  = config.callback || function(){ return true; },
                delay     = config.delay || 50,
                loopTimes = config.loopTimes || 0;

            var checkCondition = function(){
                if(loopTimes > 0 && loopTimes === count){
                    clearTimeout(timeoutFn);
                    return false;
                }else{
                    if(condition()){
                        callback();
                        clearTimeout(timeoutFn);
                        return false;
                    }else{
                        timeoutFn = setTimeout(checkCondition, delay);
                        count++;
                    }
                }
            };
            checkCondition();
        };

        /* -------------------------------------------------------
        * jQuery extends functionality:
        * Created to add new functionality to jQuery
        */
        if($ !== 'undefined'){

            var intervals = {};
            var removeListener = function(selector) {
                if (intervals[selector]) {
                    window.clearInterval(intervals[selector]);
                    intervals[selector] = null;
                }
            };
            var found = 'waitFor.found';

            $.fn.waitFor = function(handler, shouldRunHandlerOnce, isChild){
                var selector = this.selector;
                var $this = $(selector);
                var $elements = $this.not(function() { return $(this).data(found); });
                if (handler === 'remove') {
                    // Hijack and remove interval
                    // immediately if the code requests
                    removeListener(selector);
                } else {
                    // Run the handler on all found elements and mark as found
                    $elements.each(handler).data(found, true);
                    if (shouldRunHandlerOnce && $this.length) {
                        // Element was found, implying the handler already ran for all
                        // matched elements
                        removeListener(selector);
                    }
                    else if (!isChild) {
                        // If this is a recurring search or if the target has not yet been
                        // found, create an interval to continue searching for the target
                        intervals[selector] = window.setInterval(function () {
                            $this.waitFor(handler, shouldRunHandlerOnce, true);
                        }, 50);
                    }
                }
                return $this;
            };

        } // End $ function extends
    } // End redTag function

    /*
    * Append redTag to window
    * by instantiating a new object
    */

    window.redTag = new redTag;

})(window, window.redTag = window.redTag || {});
