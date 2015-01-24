# angular-app-speech
Angular service, based on the annyang.js library, that adds voice commands to your app using speech recognition

## Install
1. Include `app-speech.service.js` in your `index.html`.
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

### Todo
Finsh readme.md
