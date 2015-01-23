!function(t,n,e){"use strict";function r(t,n,r){var o,i,a=this,c=t.SpeechRecognition||t.webkitSpeechRecognition||t.mozSpeechRecognition||t.msSpeechRecognition||t.oSpeechRecognition,u=[],s={start:[],error:[],end:[],result:[],resultMatch:[],resultNoMatch:[],errorNetwork:[],errorPermissionBlocked:[],errorPermissionDenied:[]},l=0,h=!1,f=/\s*\((.*?)\)\s*/g,g=/(\(\?:[^)]+\))\?/g,d=/(\(\?)?:\w+/g,p=/\*\w+/g,m=/[\-{}\[\]+?.,\\\^$|#]/g,w=function(t){return t=t.replace(m,"\\$&").replace(f,"(?:$1)?").replace(d,function(t,n){return n?t:"([^\\s]+)"}).replace(p,"(.*?)").replace(g,"\\s*$1?\\s*"),new RegExp("^"+t+"$","i")},v=function(t){t.forEach(function(t){t.callback.apply(t.context)})},k=function(f,g){g=g===e?!0:!!g,o&&o.abort&&o.abort(),o=new c,o.maxAlternatives=5,o.countinuous="http:"===t.location.protocol,o.lang="en-US",o.onstart=function(){v(s.start)},o.onerror=function(t){var n=function(){return i=!1,v((new Date).getTime()-l<200?s.errorPermissionBlocked:s.errorPermissionDenied)},e={network:function(){return v(s.errorNetwork)},"not-allowed":function(){return n()},"service-not-allowed":function(){return n()}};v(s.error),e[t.error]()},o.onend=function(){if(v(s.end),i){var t=(new Date).getTime()-l;1e3>t?n(a.start,1e3-t):a.start()}},o.onresult=function(t){v(s.result);for(var n,e=t.results[t.resultIndex],o=0;o<e.length;o++){n=e[o].transcript.trim(),h&&r.log("Speech recognized: "+n);for(var i=0,a=u.length;a>i;i++){var c=u[i].command.exec(n);if(c){var l=c.slice(1);return h&&(r.log("command matched: "+u[i].originalPhrase),l.length&&r.log("with parameters "+l)),u[i].callback.apply(this,l),v(s.resultMatch),!0}}}return v(s.resultNoMatch),!1},g&&(u=[]),f.length&&a.addCommands(f)},b=function(){S()||k({},!1)},S=function(){return o!==e};return this.isSupported=function(){return!!c},this.start=function(t){b(),t=t||{},i=t.autoRestart!==e?!!t.autoRestart:!0,t.continuous!==e&&(o.continuous=!!t.continuous),l=(new Date).getTime(),o.start()},this.run=function(t){return a.start(t)},this.abort=function(){return i=!1,S&&o.abort(),this},this.debug=function(t){return h=arguments.length>0?!!t:!0,this},this.setLanguage=function(t){return b(),o.lang=t,this},this.getLanguage=function(){return o.lang?o.lang:!1},this.addCommands=function(n){var e,o;b();for(var i in n)if(n.hasOwnProperty(i)){if(e=t[n[i]]||n[i],"function"!=typeof e)continue;o=w(i),u.push({command:o,callback:e,originalPhrase:i})}return h&&r.log("commands successgully loaded: "+u.length),this},this.removeCommands=function(t){return t===e?void(u=[]):(t=Array.isArray(t)?t:[t],u=u.filter(function(n){for(var e=0;e<t.length;e++)if(t[e]===n.originalPhrase)return!1;return!0}),this)},this.addCallback=function(n,r,o){if(s[n]!==e){var i=t[r]||r;"function"==typeof i&&s[n].push({callback:i,context:o||this})}},this}r.$inject=["$window","$timeout","$log"],n.module("dk.appSpeech",[]).service("AppSpeech",r)}(window,window.angular);