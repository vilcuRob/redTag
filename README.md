# redTag.js
* Helper class created to facilitate a/b testing development process;
* Contains methods that that are dependent of jQuery and Optimizely

# Installation
* Add redTag.js library to your page

# Dependencies
* redTag.js requires jQuery and Optimizely in order to work

# Usage
1. Configurate redTag.js 
`redTag.config({
`optiLog: true, // Default false - Shows optimizely's log on startup`
`tagErrors: true, // Default false - Shows redTag errors on startup `
`goalsQa: true // Default false - Logs to console custom events triggered`
`});`
2. Utilities
`redTag.ajaxFin(function(){`
`console.log('Ajax finished'); // - Callback - Similar to ajaxComplete function`
`});`
