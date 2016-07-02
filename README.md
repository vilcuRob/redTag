# redTag.js
* Helper class created to facilitate a/b testing development process;
* Contains methods that that are dependent of jQuery and Optimizely

# Installation
* Add redTag.js library to your page

# Dependencies
* redTag.js requires jQuery and Optimizely in order to work

# Usage
```HTML
redTag.config({ 
      optiLog: true, // Default false - Shows optimizely's log on startup
      tagErrors: true, // Default false - Shows redTag errors on startup 
      goalsQa: true // Default false - Logs to console custom events triggered
});
```
```HTML
redTag.setCookie(name,value,days); // - Set a cookie to the current document
redTag.readCookie(name); // - Read a cookie by name - returns value
redTag.deleteCookie(name); // - Delete a cookie by name
redTag.ajaxFin(function(){
      console.log('Ajax finished'); // - Callback - Similar to ajaxComplete function
});
redTag.logOptimizely(); // - Shows optimizely's log even if config.optiLog == false on default
redTag.triggerEvent('event_name_from_optimizely'); // Triggers event to Optimizely
```
```HTML
// jQuery extend - requires jQuery.js
$('.element').waitFor(function(){
      console.log('.element was created in the DOM'); // - Callback - Waits for element to exist
});
```
