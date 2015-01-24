(function(window, angular, undefined) {
    'use strict';
  /**
   * AppSpeech
   * an angular service based on the annyang.js library
   * adds voice commands to your app using speech recognition
   **/
  function AppSpeech($window, $timeout, $log) {

    var self = this;

    var SpeechRecognition = $window.SpeechRecognition ||
      $window.webkitSpeechRecognition ||
      $window.mozSpeechRecognition ||
      $window.msSpeechRecognition ||
      $window.oSpeechRecognition;

    var commandsList = [];
    var recognition;
    var callbacks = {
      start: [],
      error: [],
      end: [],
      result: [],
      resultMatch: [],
      resultNoMatch: [],
      errorNetwork: [],
      errorPermissionBlocked: [],
      errorPermissionDenied: []
    };
    var autoRestart;
    var lastStartedAt = 0;
    var debugState = false;

    // The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
    var optionalParam = /\s*\((.*?)\)\s*/g;
    var optionalRegex = /(\(\?:[^)]+\))\?/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#]/g;

    /**
     * Private Methods
     **/
    var commandToRegExp = function(command) {
      command = command.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^\\s]+)';
        })
        .replace(splatParam, '(.*?)')
        .replace(optionalRegex, '\\s*$1?\\s*');
      return new RegExp('^' + command + '$', 'i');
    };

    // This method receives an array of callbacks to iterate over, and invokes each of them
    var invokeCallbacks = function(callbacks) {
      callbacks.forEach(function(callback) {
        callback.callback.apply(callback.context);
      });
    };

    /** 
     * initializes with a list of commands to recognize
     * @param {Object} commands
     * @param {Boolean} resetCommands
     **/
    var init = function(commands, resetCommands) {
      // reset commands defaults to true
      resetCommands = resetCommands === undefined ? true : !! resetCommands;

      // abort any previous instances of recognition
      if (recognition && recognition.abort) {
        recognition.abort();
      }

      // create instance of SpeechRecognition
      recognition = new SpeechRecognition();

      // set the max number of alternative transcripts to try and match with a command
      recognition.maxAlternatives = 5;

      // In HTTPS, turn off continuous mode for faster results.
      // In HTTP,  turn on  continuous mode for much slower results, but no repeating security notices
      recognition.countinuous = $window.location.protocol === 'http:';

      // set default language to 'en-US'.
      recognition.lang = 'en-US';


      recognition.onstart = function() {
        invokeCallbacks(callbacks.start);
      };

      recognition.onerror = function(evt) {

        var notAllowedError = function() {
          // if permission to use mic is denied, cancel restart
          autoRestart = false;
          // determine if permission was denied by user or automatically
          if (new Date().getTime() - lastStartedAt < 200) {
            return invokeCallbacks(callbacks.errorPermissionBlocked);
          } else {
            return invokeCallbacks(callbacks.errorPermissionDenied);
          }
        };

        var errors = {
          'network': function() {
            return invokeCallbacks(callbacks.errorNetwork);
          },
          'not-allowed': function() {
            return notAllowedError();
          },
          'service-not-allowed': function() {
            return notAllowedError();
          }
        };

        invokeCallbacks(callbacks.error);

        errors[evt.error]();
      };

      recognition.onend = function() {
        invokeCallbacks(callbacks.end);

        if (autoRestart) {
          var timeSinceLastStart = new Date().getTime() - lastStartedAt;

          // restart
          if (timeSinceLastStart < 1000) {
            $timeout(self.start, 1000 - timeSinceLastStart);
          } else {
            self.start();
          }
        }
      };

      recognition.onresult = function(evt) {
        invokeCallbacks(callbacks.result);
        var results = evt.results[evt.resultIndex];
        var commandText;

        // go over each of the 5 results and alternative results received (we've set maxAlternatives to 5 above)
        for (var i = 0; i < results.length; i++) {
          commandText = results[i].transcript.trim();

          // log speech recognized
          if (debugState) {
            $log.log('Speech recognized: ' + commandText);
          }

          // try and match recognized text to one of the commands on the list
          for (var j = 0, l = commandsList.length; j < l; j++) {
            var result = commandsList[j].command.exec(commandText);

            if (result) {
              var parameters = result.slice(1);

              if (debugState) {
                $log.log('command matched: ' + commandsList[j].originalPhrase);

                if (parameters.length) {
                  $log.log('with parameters ' + parameters);
                }
              }

              // execute the matched command
              commandsList[j].callback.apply(this, parameters);

              invokeCallbacks(callbacks.resultMatch);

              return true;
            }
          }
        }

        invokeCallbacks(callbacks.resultNoMatch);

        return false;
      };

      if (resetCommands) {
        commandsList = [];
      }

      if (commands.length) {
        self.addCommands(commands);
      }
    };

    // initialize if not already
    var initIfNeeded = function() {
      if (!isInitialized()) {
        init({}, false);
      }
    };

    /** 
     * returns boolean specifying whether app is initialized or not
     * @return {Boolean}
     **/
    var isInitialized = function() {
      return recognition !== undefined;
    };

    /**
     * Public Methods
     **/

    /** 
     * return boolean specifying whether SpeechRecognition is available in window
     * @return {Boolean}
     **/
    this.isSupported = function() {
      return !!SpeechRecognition;
    };

    this.start = function(options) {
      initIfNeeded();
      
      options = options || {};

      if (options.autoRestart !== undefined) {
        autoRestart = !!options.autoRestart;
      } else {
        autoRestart = true;
      }

      if (options.continuous !== undefined) {
        recognition.continuous = !!options.continuous;
      }

      lastStartedAt = new Date().getTime();

      recognition.start();
    };

    this.run = function(options) {
      return self.start(options);
    };

    this.abort = function() {
      autoRestart = false;

      if (isInitialized) {
        recognition.abort();
      }

      return this;
    };

    this.debug = function(newState) {
      if (arguments.length > 0) {
        debugState = !! newState;
      } else {
        debugState = true;
      }

      return this;
    };

    this.setLanguage = function(language) {
      initIfNeeded();
      recognition.lang = language;

      return this;
    };

    this.getLanguage = function() {
        return !!recognition.lang ? recognition.lang : false;
    };

    this.addCommands = function(commands) {
      var cb, command;

      initIfNeeded();

      for (var phrase in commands) {
        if (commands.hasOwnProperty(phrase)) {
          cb = $window[commands[phrase]] || commands[phrase];

          if (typeof cb !== 'function') {
            continue;
          }

          command = commandToRegExp(phrase);

          commandsList.push({
            command: command,
            callback: cb,
            originalPhrase: phrase
          });
        }
      }

      if (debugState) {
        $log.log('commands successgully loaded: ' + commandsList.length);
      }

      return this;
    };

    this.removeCommands = function(commandsToRemove) {
      if (commandsToRemove === undefined) {
        commandsList = [];
        return;
      }

      commandsToRemove = Array.isArray(commandsToRemove) ? commandsToRemove : [commandsToRemove];

      commandsList = commandsList.filter(function(command) {
        for (var i = 0; i < commandsToRemove.length; i++) {
          if (commandsToRemove[i] === command.originalPhrase) {
            return false;
          }
        }
        return true;
      });

      return this;
    };

    this.addCallback = function(type, callback, ctx) {
      if (callbacks[type] === undefined) {
        return;
      }
      var cb = $window[callback] || callback;
      if (typeof cb !== 'function') {
        return;
      }
      callbacks[type].push({
        callback: cb,
        context: ctx || this
      });
    };

    return this;
  } // end AppSpeech

  // inject dependicies
  AppSpeech.$inject = ['$window', '$timeout', '$log'];

  // register module and service
  angular.module('dk.appSpeech', [])
    .service('AppSpeech', AppSpeech);

})(window, window.angular);