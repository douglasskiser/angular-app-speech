# angular-app-speech
Angular service, based on the annyang.js library, that adds voice commands to your app using speech recognition

## Setup
1. Include `src/app-speech.service.js` or `dist/app-speech.min.js` in your `index.html`.
2. Add `dk.appSpeech` as a module dependency to your app.
```js
angular.module('app', ['dk.appSpeech']);
```
## Usage
This module exposes an `AppSpeech` service.

### Basic Example
```js
angular.module('app')
  .controller('AppCtrl', function($scope, AppSpeech) {
  
    $scope.name = '';
    
    // check for support
    if (AppSpeech.isSupported) {
    
      // define commands
      var commands = {
        'hello': function() {
          alert('hello, how are you');
        },
        'my name is :name': function(name) {
          // changes to the scope will need to be applied
          $scope.$apply(function() {
            $scope.name = name;
          });
        }
      };
      
      // add commands then start listening
      AppSpeech
        .addCommands(commands)
        .run();
    }
  });
```

## API

##isSupported()
Returns boolean specifying whether SpeechRecognition is supported by the browser.
###Return:
- **Boolean** *isSupported* - Is SpeechRecognition available.

##start([options])
Start listening.
Recieves an optional options object which supports the following options:
- `autoRestart` (Boolean, default: true) Should AppSpeech restart itself if it is closed indirectly.
- `continuous` (Boolean, default: undefined) Allow forcing continuous mode on or off.

### Examples:

```js
// only needs to be called once throughout an app.
AppSpeech.start();

// Start listening, don't restart automatically
AppSpeech.start({autoRestart: false});

// Start listening, don't restart automatically, stop recognition after first phrase recognized
AppSpeech.start({autoRestart: false, continuous: false});
```

### Params:
* **Object** *[options]* - Optional options.

##run([options])
Alias of start()

##abort()
Stop listening.

##debug([newState=true])
Turn on output of debug messages to the console.

###Params:
- **Boolean** *[newState=true]* - Turn on/off debug messages

##setLanguage(language)
Set the language the user will speak in. If this method is not called, defaults to 'en-US'.

###Params:
- **String** *language* - The language (locale)

##getLanguage()
Returns the current language being used by AppSpeech if set.

###Return:
- **String** *language* - The language (locale)

##addCommands(commands)
Add commands that AppSpeech will respond to. Commands can be added in multiple controllers or services.

###Examples:
```js
angular.module('app')
  .controller('AppCtrl', function($scope, AppSpeech) {
    $scope.name = '';
    
    AppSpeech.addCommands({
      'my name is :name': function(name) {
        // must apply scope changes
        $scope.$apply(function() {
          $scope.name = name;
        });
      })
      // only needs to be called once throughout an app
      .run();
  })
  
  .controller('AnotherCtrl', function($scope, AppSpeech) {
    AppSpeech.addCommands({
      'hello': function() {
        alert('hello');
      });
  });
```
###Params:
- **Object** *commands* - Commands that AppSpeech should listen to.

##removeCommands([commandsToRemove])
Remove existing commands by passing a single command phrase, an array of command phrases, or by passing no parameters in which all commands are removed.

###Examples:
```js
var commands = {'hello': helloFunction, 'hi': helloFunction };

// Remove all exisiton commands
AppSpeech.removeCommands();

// Add some commands
AppSpeech.addCommands(commands);

// Remove 'hello' command
AppSpeech.removeCommands('hello');

// Remove 'hello' and 'hi'
AppSpeech.removeCommands(['hello', 'hi']);
```

### Todo
Finish API in readme.md with addCallback()
