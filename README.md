# redTag.js
* Helper class created to facilitate a/b testing development process

# Installation
* Add redTag.js library to your page

# Dependencies
* redTag.js requires jQuery and Optimizely in order to work

# Usage
```HTML
// redTag.js - Configuration
redTag.config({
      optiLog: true, // Default false - Shows optimizely's log on startup
      tagErrors: true, // Default false - Shows redTag errors on startup
      goalsQa: true // Default false - Logs to console custom events triggered
});
```
```HTML
// Helpers - Created to help with common tasks
redTag.setCookie(name,value,days); // - Set a cookie to the current document
redTag.readCookie(name); // - Read a cookie by name - returns value
redTag.deleteCookie(name); // - Delete a cookie by name
redTag.ajaxFin(function(){
      console.log('Ajax finished'); // - Callback - Similar to ajaxComplete function
});
redTag.whenTrue({
      delay: 150, // Repeat loop every milliseconds
      condition: function(){ return variable === true }, // Condition to test
      callback: function(){
          alert('variable is true'); // - Callback - Logic after condition is true
      }
});
```
```HTML
// Optimizely shortcuts - requires optimizely.js
redTag.logOptimizely(); // - Show optimizely's log even if config.optiLog == false
redTag.triggerEvent('event_name_from_optimizely'); // Triggers event to Optimizely
```
```HTML
// jQuery extend helpers - requires jQuery.js
$('.element').waitFor(function(){
      console.log('.element was created in the DOM'); // - Callback - When element is created
});
```
