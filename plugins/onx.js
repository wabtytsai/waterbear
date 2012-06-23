/* 
 *    JAVASCRIPT PLUGIN
 * 
 *    Support for writing Javascript using Waterbear
 *
 */


// Pre-load dependencies
yepnope({
    load: [ 'plugins/onx.css',
            'lib/beautify.js',
            'lib/highlight.js',
            'lib/highlight-javascript.js',
            'lib/highlight-github.css'
    ],
    complete: setup
});

// Add some utilities
jQuery.fn.extend({
  extract_script: function(){
      if (this.length === 0) return '';
      if (this.is(':input')){
          if (this.parent().is('.string') || this.parent().is('.color')){
              return '"' + this.val() + '"';
          }else{
              return this.val();
          }
      }
      if (this.is('.empty')) return '/* do nothing */';
      return this.map(function(){
          var self = $(this);
          var script = self.data('script');
          if (!script) return null;
          var exprs = $.map(self.socket_blocks(), function(elem, idx){return $(elem).extract_script();});
          var blks = $.map(self.child_blocks(), function(elem, idx){return $(elem).extract_script();});
          if (exprs.length){
              // console.log('expressions: %o', exprs);
              function exprf(match, offset, s){
                  // console.log('%d args: <%s>, <%s>, <%s>', arguments.length, match, offset, s);
                  var idx = parseInt(match.slice(2,-2), 10) - 1;
                  // console.log('index: %d, expression: %s', idx, exprs[idx]);
                  return exprs[idx];
              };
              //console.log('before: %s', script);
              script = script.replace(/\{\{\d\}\}/g, exprf);
              //console.log('after: %s', script);
          }
          if (blks.length){
              function blksf(match, offset, s){
                  var idx = parseInt(match.slice(2,-2), 10) - 1;
                  return blks[idx];
              }
              // console.log('child before: %s', script);
              script = script.replace(/\[\[\d\]\]/g, blksf);
              // console.log('child after: %s', script);   
          }
          next = self.next_block().extract_script();
          if (script.indexOf('[[next]]') > -1){
              script = script.replace('[[next]]', next);
          }else{
              if (self.is('.step, .trigger')){
                  script = script + next;
              }
          }
          return script;
      }).get().join('');
  },
  wrap_script: function(){
      // wrap the top-level script to prevent leaking into globals
      var script = this.pretty_script();
      var retval = 'var global = new Global();(function($){var local = new Local();try{canvas = $("<canvas width=\\"" + global.stage_width + "\\" height=\\"" + global.stage_height + "\\"></canvas>").appendTo(".stage");ctx = canvas[0].getContext("2d");' + script + '}catch(e){alert(e);}})(jQuery);';
      //console.log(retval);
      return retval;
  },
  pretty_script: function(){
      return js_beautify(this.map(function(){ return $(this).extract_script();}).get().join(''));
  },
  write_script: function(view){
      view.html('<pre class="language-javascript">' + this.pretty_script() + '</pre>');
      hljs.highlightBlock(view.children()[0]);
  }
});

function setup(){
    // This file depends on the runtime extensions, which should probably be moved into this namespace rather than made global
    
function showColorPicker(){
    console.log('Add a non-Raphael color picker');
}
//$('.workspace:visible .scripts_workspace').delegate('input[type=color]', 'click', showColorPicker);
$(document).ready(function(){
//     window.cw = Raphael.colorwheel($('#color_contents')[0], 300, 180);
});


window.update_scripts_view = function(){
    var blocks = $('.workspace:visible .scripts_workspace > .wrapper');
    //console.log('found %s scripts to view', blocks.length);
    var view = $('.workspace:visible .scripts_text_view');
    blocks.write_script(view);
}

function run_scripts(event){
    $('.stage')[0].scrollIntoView();
    var blocks = $('.workspace:visible .scripts_workspace > .trigger');
    $('.stage').replaceWith('<div class="stage"><script>' + blocks.wrap_script() + '</script></div>');
}
$('.run_scripts').click(run_scripts);

// End UI section


// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt', 
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown', 
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),
    unit: ['px', 'em', '%', 'pt'],
    align: ['start', 'end', 'left', 'right', 'center'],
    baseline: ['alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom'],
    linecap: ['round', 'butt', 'square'],
    linejoin: ['round', 'bevel', 'mitre'],
    arity: ['0', '1', '2', '3', 'array', 'object'],
    types: ['string', 'number', 'boolean', 'array', 'object', 'function','color', 'image', 'shape', 'point', 'size', 'rect', 'gradient', 'pattern', 'imagedata', 'any'],
    rettypes: ['none', 'string', 'number', 'boolean', 'array', 'object', 'function', 'color', 'image', 'shape', 'point', 'size', 'rect', 'image', 'gradient', 'pattern', 'imagedata','any'],
    easing: ['>', '<', '<>', 'backIn', 'backOut', 'bounce', 'elastic'],
    fontweight: ['normal', 'bold', 'inherit'],
    globalCompositeOperators: ['source-over', 'source-atop', 'source-in', 'source-out', 'destination-atop', 'destination-in', 'destination-out', 'destination-over', 'lighter', 'copy', 'xor'],
    mimetype: ['audio/*', 'video/*'],
    http_types:['GET', 'POST'],
    content_types:['application/text', 'application/xml'],
    app_triggers: ['installed', 'removed', 'updated'],
    //battery_triggers: {'high': 'High', 'low':'Low', 'startedCharging':'Starting Charging', 'stoppedCharging':'Stopped Charging', 'updated':'Status or charge level changed'},
    battery_triggers: ['high', 'low', 'startedCharging', 'stoppedCharging', 'updated'],
    network_triggers: ['3gOff', '3gOn', 'updated', 'wifiOff', 'wifiOn'],//, 'wifiScan'],
    mot_types: ['atrest', 'walking', 'driving', 'running'],
    screen_triggers:['on','off','unlock'],
    telephony_triggers:['busy', 'idle', 'incomingCall', 'offHook', 'outgoingCall'],
    location_provider:['GPS','CELL', 'PASSIVE'],
    region_triggers:['enter','exit'],
    horoscope_signs:['ari', 'tau', 'gem', 'can', 'leo', 'vir', 'lib', 'sco', 'sag', 'cap', 'aqu', 'pis'],
    weather_unit:['i','m'],
    weather_days:[0, 1,2,3,4]
};

// Hints for building blocks
//
//
// Value blocks can nest, so don't end them with semi-colons (i.e., if there is a "type" specified).
//
//
var menus = {
    control: menu('Control', [
        {
            label: 'when program runs',
            trigger: true,
            slot: false,
            containers: 1,
            script: 'function _start(){[[1]]}_start();',
            help: 'this trigger will run its scripts once when the program starts'
        },
        /*{
            label: 'when [choice:keys] key pressed', 
            trigger: true,
            slot: false,
            containers: 1,
            script: '$(document).bind("keydown", {{1}}, function(){[[1]]; return false;});',
            help: 'this trigger will run the attached blocks every time this key is pressed'
        },
        {
            label: 'repeat [number:30] times a second',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'count##',
                    script: 'count##',
                    type: 'number'
                }
            ],
            script: '(function(){var count## = 0; setInterval(function(){count##++; count## = count##;[[1]]},1000/{{1}})})();',
            help: 'this trigger will run the attached blocks periodically'
        },
        {
            label: 'wait [number:1] secs',
            containers: 1,
            script: 'setTimeout(function(){[[1]]},1000*{{1}});',
            help: 'pause before running the following blocks'
        },*/
        {
            label: 'repeat [number:10]', 
            containers: 1, 
            script: 'for (index## = 0; index## < {{1}}; index##++){[[1]]};',
            help: 'repeat the contained blocks so many times',
            locals: [
                {
                    label: 'loop index##',
                    script: 'index##',
                    type: 'number'
                }
            ]
        },
        {
            label: 'broadcast [string:ack] message', 
            script: '$(".stage").trigger({{1}});',
            help: 'send this message to any listeners'
        },
        {
            label: 'when I receive [string:ack] message', 
            trigger: true,
            slot: false,
            containers: 1,
            script: '$(".stage").bind({{1}}, function(){[[1]]});',
            help: 'add a listener for the given message, run these blocks when it is received'
        },
        {
            label: 'forever if [boolean:false]', 
            containers: 1,  
            script: 'while({{1}}){[[1]]}',
            help: 'repeat until the condition is false'
        },
        {
            label: 'if [boolean]', 
            containers: 1, 
            script: 'if({{1}}){[[1]]}',
            help: 'run the following blocks only if the condition is true'
        },
        {
            label: 'if [boolean]', 
            containers: 2,
            subContainerLabels: ['else'],
            script: 'if({{1}}){[[1]]}else{[[2]]}',
            help: 'run the first set of blocks if the condition is true, otherwise run the second set'
        },
        {
            label: 'repeat until [boolean]', 
            containers: 1, 
            script: 'while(!({{1}})){[[1]]}',
            help: 'repeat forever until condition is true'
        },
        {
            label: 'variable string## [string]',
            script: 'string## = {{1}};',
            returns: {
                label: 'string##',
                script: 'string##',
                type: 'string'
            },
            help: 'create a reference to re-use the string'
        },
        {
            label: 'variable number## [number]',
            script: 'number## = {{1}};',
            returns: {
                label: 'number##',
                script: 'number##',
                type: 'number'
            },
            help: 'create a reference to re-use the number'
        },
        {
            label: 'variable boolean## [boolean]',
            script: 'boolean## = {{1}};',
            returns: {
                label: 'boolean##',
                script: 'boolean##',
                type: 'boolean'
            },
            help: 'create a reference to re-use the boolean'
        },
        {
            label: 'variable array## [array]',
            script: 'array## = {{1}};',
            returns: {
                label: 'array##',
                script: 'array## = {{1}}',
                type: 'array'
            },
            help: 'create a reference to re-use the array'
        },
        {
            label: 'variable object## [object]',
            script: 'object## = {{1}};',
            returns: {
                label: 'object##',
                script: 'object##',
                type: 'object'
            },
            help: 'create a reference to re-use the object'
        },
        {
            label: 'variable color## [color]',
            script: 'color## = {{1}};',
            returns: {
                label: 'color##',
                script: 'color##',
                type: 'color'
            },
            help: 'create a reference to re-use the color'
        },
        {
            label: 'variable image## [image]',
            script: 'image## = {{1}};',
            returns: {
                label: 'image##',
                script: 'image##',
                type: 'image'
            },
            help: 'create a reference to re-use the image'
        },
        // 'shape', 'point', 'size', 'rect', 'gradient', 'pattern', 'imagedata', 'any'
        {
            label: 'variable shape## [shape]',
            script: 'shape## = {{1}};',
            returns: {
                label: 'shape##',
                script: 'shape##',
                type: 'shape'
            },
            help: 'create a reference to re-use the shape'
        },
        {
            label: 'variable point## [point]',
            script: 'point## = {{1}};',
            returns: {
                label: 'point##',
                script: 'point##',
                type: 'point'
            },
            help: 'create a reference to re-use the point'
        },
        {
            label: 'variable size## [size]',
            script: 'size## = {{1}};',
            returns: {
                label: 'size##',
                script: 'size##',
                type: 'size'
            },
            help: 'create a reference to re-use the size'
        },
        {
            label: 'variable rect## [rect]',
            script: 'rect## = {{1}};',
            returns: {
                label: 'rect##',
                script: 'rect##',
                type: 'rect'
            },
            help: 'create a reference to re-use the rect'
        },
        {
            label: 'variable gradient## [gradient]',
            script: 'gradient## = {{1}};',
            returns: {
                label: 'gradient##',
                script: 'gradient##',
                type: 'gradient'
            },
            help: 'create a reference to re-use the gradient'
        },
        {
            label: 'variable pattern## [pattern]',
            script: 'pattern## = {{1}};',
            returns: {
                label: 'pattern##',
                script: 'pattern##',
                type: 'pattern'
            },
            help: 'create a reference to re-use the pattern'
        },
        {
            label: 'variable imagedata## [imagedata]',
            script: 'imagedata## = {{1}};',
            returns: {
                label: 'imagedata##',
                script: 'imagedata##',
                type: 'imagedata'
            },
            help: 'create a reference to re-use the imagedata'
        },
        {
            label: 'variable any## [any]',
            script: 'any## = {{1}};',
            returns: {
                label: 'any##',
                script: 'any##',
                type: 'any'
            },
            help: 'create a reference to re-use the any'
        },
    ], false),
    applications: menu('Applications', [
        {
            label: 'Launch App [string:App Name] then',
            script: 'device.applications.launch({{1}}, {}, function(err){[[1]]});',
            help: 'Launches an application with the specified name'
        },
        {
            label: 'Launch Package [string:Package Name] then',
            script: 'device.applications.launchPackage({{1}}, {}, function(err){[[1]]});',
            help: 'Launches an application with the specified name'
        },
        {
            label: 'Veiw [choice:mimetype] at [string:URL] ',
            script: 'device.applicationslaunchViewer({{2}}, {{1}});',
            help: 'Veiw the url'
        },
        
        {
            label: 'When App [choice:app_triggers]',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'App Name',
                    script: 'signal.name',
                    type: 'string'
                },
                {
                    label: 'App Package Name',
                    script: 'signal.package',
                    type: 'string'
                }
            ],
            script: 'device.applications.on({{1}}, function(signal){[[1]]});',
            help: 'this trigger will run the attached blocks periodically'
        },
        {
            label: 'Installed Apps',
            script: 'device.applications.installedApps',
            type: 'object',
            help: 'List of Installed Apps [{name:"app name",package:"app package name"}]'
        },
        {
            label: 'Running Apps',
            script: 'device.applications.runningApps',
            type: 'object',
            help: 'List of Running Apps [{name:"app name",package:"app package name"}]'
        },
        {
            label: 'Emit [choice:app_triggers] App Name=[string] Package Name =[string]',
            script: 'device.applications.emit({{1}}, {name:{{2}},package:{{3}}});',
            help: 'Send Fake Applications Signal'
        },
        
    ]),
    battery: menu('Battery', [
        {
          label: 'When Battery [choice:battery_triggers]',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Is Charging',
                    script: 'signal.isCharging',
                    type: 'boolean',
                    help: 'Is the battery Charging'
                },
                {
                    label: 'Is High',
                    script: 'signal.isHigh',
                    type: 'boolean',
                    help: 'Is the battery High'
                },
                {
                    label: 'Is Low',
                    script: 'signal.isLow',
                    type: 'boolean',
                    help: 'Is the battery Low'
                },
                {
                    label: 'Percentage',
                    script: 'signal.percentage',
                    type: 'number',
                    help: 'Percentage Charge'
                }
            ],
            script: 'device.battery.on({{1}}, function(signal){[[1]]});',
            help: 'this trigger will run when the battery status updates in the selected way'
        },
        
        {
            label: 'Is Battery High',
            script: 'device.battery.status.isHigh',
            type: 'boolean',
            help: 'Is the Battery High'
        },
        {
            label: 'Is Battery Low',
            script: 'device.battery.status.isLow',
            type: 'boolean',
            help: 'Is the Battery Low'
        },
        
        {
            label: 'Is Battery Charging',
            script: 'device.battery.status.isCharging',
            type: 'boolean',
            help: 'Is the Battery Charging'
        },
        
        {
            label: 'Battery Percentage',
            script: 'device.battery.status.percentage',
            type: 'number',
            help: 'Battery Percentage Charged'
        },
        {
          label: 'Emit [choice:battery_triggers] isHigh=[boolean] isLow =[boolean] isCharging=[boolean] percentage=[number]',
          script: 'device.battery.emit({{1}}, {isHigh:{{2}}, isLow:{{3}}, isCharging:{{}},percentage:{{5}});',
            help: 'Send Fake Battery Signal'
        },
        
    ]),
    browser: menu('Browser', [
        {
            label: 'Launch [string:URL]',
            script: 'device.browser.launch({{1}});',
            help: 'Launches an external browser app with the specified URL'
        },
        {
            label: 'Show Overlay [string:URL]',
            script: 'device.browser.showOverlay({{1}});',
            help: 'Shows an overlay above the active screen'
        },
        {
            label: 'Show Url [string:URL]',
            script: 'device.browser.launch({{1}});',
            help: 'Displays an internal browser popup with the specified URL'
        },
        {
            label: 'Ajax Request URL = [string] Data = [string] [choice:http_types] [choice:content_types]',
            trigger: false,
            slot: true,
            containers: 2,
            subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Response Body',
                    script: 'body',
                    type: 'string'
                },
                {
                    label: 'Status',
                    script: 'textStatus',
                    type: 'string'
                },
                /*
                {
                    label: 'Response',
                    script: 'response',
                    type: 'object'
                },*/
            ],
            script: 'device.ajax({url: {{1}},data:{{2}}, type: "{{3}}",headers:{"Content-Type":"{{4}}"}},    function onSuccess(body, textStatus, response){[[1]]},function onError(textStatus, response) {var body = ""; var error = {};error.message = textStatus; error.statusCode = response.status; console.error("error: ",error); [[2]] });',
            help: 'Send a request to a web server (errors will be logged)'
        }
        
    ]),
    messaging: menu('Messaging', [
        {
            label: 'When SMS recieved',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Body Text',
                    script: 'sms.body',
                    type: 'string'
                },
                {
                    label: 'From Number',
                    script: 'sms.from',
                    type: 'string'
                }
            ],
            script: 'device.messaging.on("smsReceived", function (sms){[[1]]});',
            help: 'this trigger will run when an SMS message is recieved'
        },
        {
            label: 'Send SMS To= [string] Message =[string]',
            trigger: false,
            slot: true,
            containers: 1,
            //subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Error',
                    script: 'err',
                    type: 'string'
                },
            ],
            script: 'device.messaging.sendSMS({to: {{1}}, body: {{2}}},  function callBack(err){[[1]]})',
            help:"Send an SMS message then run the callback",
            
        },
        {
            label: 'Send Mail To=[string] Subject=[string] Message=[string]',
            trigger: false,
            slot: true,
            containers: 1,
            //subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Error',
                    script: 'err',
                    type: 'string'
                },
            ],
            script: 'device.messaging.({to: {{1}},subject:{{2}}, body: {{3}}},  function callBack(err){[[1]]})',
            help:"Send an email message then run the callback",
            
        }        
    ]),
    modeoftransport: menu('Mode Of Transport', [
        {
            label: 'When Mode Of Transport changes',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Current MOT',
                    script: 'signal.current',
                    type: 'string'
                },
                {
                    label: 'Previous MOT',
                    script: 'signal.previous',
                    type: 'string'
                }
            ],
            script: 'device.modeOfTransport.on("changed", function (signal){[[1]]});',
            help: 'this trigger run when the Mode of Transport changes'
        },
        {
            label: 'mode of transport [choice:mot_types]',
            script: '{{1}}',
            type: 'string',
            help:'One of the Modes of Transport'
        },
        {
            label: 'Current Mode of Transport',
            script: 'device.modeOfTransport.current',
            type: 'string',
            help: 'Current Mode of Transport'
        }
        
    ]),
    network: menu('Network', [
                {
          label: 'When Network [choice:network_triggers]',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Is 3G On',
                    script: 'signal.is3GOn',
                    type: 'boolean',
                    help: 'Is the 3G On'
                },
                {
                    label: 'Is Wifi On',
                    script: 'signal.isWifiOn',
                    type: 'boolean',
                    help: 'Is the Wifi On'
                }
            ],
            script: 'device.network.on({{1}}, function(signal){[[1]]});',
            help: 'this trigger will run when network status updates in the selected way'
        },
        
        {
            label: '3G Network Is On',
            script: 'device.network.status.is3GOn',
            type: 'boolean',
            help: '3G Network Is On'
        },
        {
            label: 'Wifi Network Is On',
            script: 'device.network.status.isWifiOn',
            type: 'boolean',
            help: 'Wifi Network Is On'
        },
        {
          label: 'Emit [choice:network_triggers] is3GOn=[boolean] isWifiOn =[boolean]',
          script: 'device.network.emit({{1}}, {is3GOn:{{2}}, isWifiOn:{{3}});',
            help: 'Send Fake Network Signal'
        }
        
    ]),
    notification:menu('Notification',[
        {
            label: 'New notification## title=[string] content=[string]',
            slot: false,
            containers: 1,
            script: 'var notification## = device.notifications.createNotification({{1}});     notification##.content = {{2}}; notification##.on("click") = function() {[[1]]}; notification##.show();',
                returns: {
                label: 'notification##',
                script: 'notification##',
                type: 'object'
            },
            
            help: 'create a new, notification and show it'
        }
    ]),
          
    scheduler:menu('Scheduler', [
        // FIXME :
        /*
         {
            label: 'object [object] value at key [string]',
            script: '{{1}}[{{2}}]',
            type: 'any',
            help: 'return the value of the key in an object'
        }
        
        
        {
          label: 'New timer## interval=[number] content=[string]',
            script: 'device.scheduler.setTimer({name: "timer##", 
      time: 0,
      interval: 5*1000, 
      exact: false },
      function () { device.notifications.createNotification('Hello world!').show(); });

    var timer## = device.timers.createTimer({{1}});     timer##.content = {{2}}; timer##.on("click") = function() {[[1]]}; timer##.show();',
                returns: {
                label: 'timer##',
                script: 'timer##',
                type: 'object'
            },
            
            help: 'create a new, timer'
        }
        //device.scheduler.removeAlarm("uniqueAlarmName");
        */
    ]),
    //screen
    screen: menu('Screen', [
        {
          label: 'When Screen [choice:screen_triggers]',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Is Screen On',
                    script: 'signal.isOn',
                    type: 'boolean',
                    help: 'Is the Screen On'
                },
                {
                    label: 'Is Screen Locked',
                    script: 'signal.isLocked',
                    type: 'boolean',
                    help: 'Is the Screen Locked On'
                }
            ],
            script: 'device.screen.on({{1}}, function(signal){[[1]]});',
            help: 'this trigger will run when screen status updates in the selected way'
        },
        {
            label: 'Is Screen On',
            script: 'device.screen.isOn',
            type: 'boolean',
            help: 'Is the Screen On'
        },
        {
            label: 'Is Screen Locked',
            script: 'device.screen.isLocked',
            type: 'boolean',
            help: 'Is the Screen Locked On'
        },
        {
            label: 'Emit [choice:screen_triggers] isOn=[boolean] isLocked =[boolean]',
            script: 'device.network.emit({{1}}, {isOn:{{2}}, isLocked:{{3}});',
            help: 'Send Fake Network Signal'
        }
    ]),
    //telephony
    telephony: menu('Telephony', [
        {
          label: 'When Telephony [choice:telephony_triggers]',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'Phone Number',
                    script: 'signal.phoneNumber',
                    type: 'string',
                    help: 'the phone number on an incoming call or an outgoing call'
                }
            ],
            script: 'device.telephony.on({{1}}, function(signal){[[1]]});',
            help: 'this trigger will run when telephony status updates in the selected way'
        },
        {
            label: 'Is Telephony Idle',
            script: 'device.telephony.isIdle',
            type: 'boolean',
            help: 'Is the Telephony Idle'
        },
        {
            label: 'Emit [choice:telephony_triggers] phoneNumber=[string]',
            script: 'device.network.emit({{1}}, {phoneNumber:{{2}});',
            help: 'Send Fake Telephony Signal'
        }
        
    ]),
    //location
    location:menu('Location',[
        
        {
          label: 'New locationListener## provider=[choice:location_provider] seconds between updates=[int:30]',
            slot: false,
            containers: 1,
            script: 'var locationListener## = device.location.createListener({{1}}, 1000 * {{2}}); locationListener##.on("changed") = function(signal){[[1]]};locationListener##.start()',
                returns: {
                label: 'Location Listener##',
                script: 'locationListener##',
                type: 'object'
            },
            locals:[
              {
                  label: 'Latitude',
                  script: 'signal.latitude',
                  type: 'number',
                  help: 'Latitude'
              },
              {
                  label: 'Longitude',
                  script: 'signal.longitude',
                  type: 'number',
                  help: 'Longitude'
              }
            ],
            
            help: 'create a new, location listener'
        },
        
        {
            label: 'Last Latitude',
            script: 'device.location.lastLocation.latitude',
            type: 'number',
            help: 'Last detected Latitude'
        },
        {
            label: 'Last Longitude',
            script: 'device.location.lastLocation.longitude',
            type: 'number',
            help: 'Last detected Longitude'
        },
        {
            label: 'Emit location change to  Latitude=[number] Longitude=[number]',
            script: 'device.network.emit("changed", {latitude:{1}}, longitude:{{2}}});',
            help: 'Send Fake Location Changed Signal'
        }
        
        // TODO : start & stop for a locationListener & other triggers for locationListener
    ]),
    region:menu('Region',[
            /*createRegion(Object args) - Creates circular region to be monitored in the future. To start monitoring pass it to startMonitoringForRegion method below This method should be invoked from JavaScript.
    
            Parameters:
    
            args - The arguments for creating the region:
            - name: String (can be null)
            - latitude: double
            - longitude: double
            - radius: double

            */
        {
            label: 'New region## name=[string] latitude=[number] longitude=[number] radius=[number]',
            slot: false,
            containers: 2,
            subContainerLabels: ['On Enter','On Exit'],
            script: 'var region## = device.regions.createRegion({name:{{1}}, latitude:{{2}}, longitude:{{3}}, radius:{{4}}); region##.on("enter", function(signal){[[1]]});region##.on("exit", function(signal){[[2]]});device.regions.startMonitoring(region##);',
            returns: {
                label: 'Region Listener##',
                script: 'regionListener##',
                type: 'object'
            },
            locals:[
                  {
                  label: 'Name',
                  script: 'signal.name',
                  type: 'string',
                  help: 'Name of Region'
                  },
                  {
                      label: 'Latitude',
                      script: 'signal.latitude',
                      type: 'number',
                      help: 'Latitude'
                  },
                  {
                      label: 'Longitude',
                      script: 'signal.longitude',
                      type: 'number',
                      help: 'Longitude'
                  },
                 {
                  label: 'Radius',
                  script: 'signal.Radius',
                  type: 'number',
                  help: 'Radius of region'
              }
            ],
            help: 'create a new, region listener'
        },
         {
                  label: 'Name',
                  script: 'signal.name',
                  type: 'string',
                  help: 'Name of Region'
                  },
                  {
                      label: 'Latitude',
                      script: 'signal.latitude',
                      type: 'number',
                      help: 'Latitude'
                  },
                  {
                      label: 'Longitude',
                      script: 'signal.longitude',
                      type: 'number',
                      help: 'Longitude'
                  },
                 {
                  label: 'Radius',
                  script: 'signal.Radius',
                  type: 'number',
                  help: 'Radius of region'
              },
        {
            label: 'Emit [choice:region_triggers] Latitude=[number] Longitude=[number]',
            script: 'device.network.emit({{1}}, {latitude:{{2}}, longitude:{{3}}});',
            help: 'Send Fake Region Signal'
        }
        
        // TODO : start & stop for a regionListener & other triggers for regionListener
    ]),
        
    //localStorage
    //hard without renaming returns
    
    //sharedStorage
    feeds:menu('Feeds',[
        {
          label: 'Get Horoscope For =[choice:horoscope_signs]',
            trigger: false,
            slot: true,
            containers: 2,
            subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Query Time',
                    script: 'horoscope.queryTime',
                    type: 'number'
                },
                {
                    label: 'Zodiac Sign',
                    script: 'horoscope.zodiacSign',
                    type: 'string'
                },
                {
                    label: 'Horoscope',
                    script: 'horoscope.horoscope',
                    type: 'string'
                }
            ],
            script: 'feeds.horoscope.get({sign: {{1}}},  function onSuccess(horoscope, textStatus, response){[[1]]}, function onError(textStatus, response){[[2]]})',
            help:"Request a horoscope",
        },
        
          
        
     
    //newsfeed
    {
          label: 'Show Local News For US Zip =[string]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({type:"local", uszip:{{1}}})',
            help:"Show US Local News",
        },
        {
          label: 'show Global News filter=[string]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({type:"global", filter:{{1}}})',
            help:"Show Global News",
        },       
        {
          label: 'Get Local News For US Zip =[string]',
            trigger: false,
            slot: true,
            containers: 2,
            subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Query Time',
                    script: 'news.queryTime',
                    type: 'number'
                },
                {
                    label: 'location',
                    script: 'news.location',
                    type: 'string'
                },
                {
                    label: 'links',
                    script: 'news.links',
                    type: 'object'
                }
            ],
            script: 'feeds.news.get({type:"local", uszip:{{1}}},  function onSuccess(news, textStatus, response){[[1]]}, function onError(textStatus, response){[[2]]})',
            help:"Request US Local News",
        },
        {
          label: 'Get Global News filter=[string]',
            trigger: false,
            slot: true,
            containers: 2,
            subContainerLabels: ['On Error'],
            locals: [
                {
                    label: 'Query Time',
                    script: 'news.queryTime',
                    type: 'number'
                },
                {
                    label: 'location',
                    script: 'news.location',
                    type: 'string'
                },
                {
                    label: 'links',
                    script: 'news.links',
                    type: 'object'
                }
            ],
            script: 'feeds.news.get({type:"global", filter:{{1}}},  function onSuccess(news, textStatus, response){[[1]]}, function onError(textStatus, response){[[2]]})',
            help:"Request Global News",
        },        
    //traffic feed
    
    //weather feed
    
      {
      label: 'Show Weather for latitude=[number] longitude=[number] units=[choice:weather_unit] days ahead=[choice:weather_days]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({locationtype:"latlong", location:""+{{1}}+","{{2}}, unittype:{{3}}, days:{{4}}})',
            help:"Show Weather for Lat Long ",
        },
        {
      label: 'Show Weather for City=[string] units=[choice:weather_unit] days ahead=[choice:weather_days]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({locationtype:"city", location:{{1}}, unittype:{{2}}, days:{{3}}})',
            help:"Show Weather for City ",
        },
        {
      label: 'Show Weather for Country=[string] units=[choice:weather_unit] days ahead=[choice:weather_days]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({locationtype:"country", location:{{1}}, unittype:{{2}}, days:{{3}}})',
            help:"Show Weather for Country"
        },
        {
      label: 'Show Weather for US Zip Code=[string] units=[choice:weather_unit] days ahead=[choice:weather_days]',
            trigger: false,
            slot: true,
            script: 'feeds.news.show({locationtype:"uszip", location:{{1}}, unittype:{{2}}, days:{{3}}})',
            help:"Show Weather for US Zip Code"
        }
    ]), 
    operators: menu('Operators', [
        {
            label: '[number:0] + [number:0]', 
            'type': 'number', 
            script: "({{1}} + {{2}})",
            help: 'sum of the two operands'
        },
        {
            label: '[number:0] - [number:0]', 
            'type': 'number', 
            script: "({{1}} - {{2}})",
            help: 'difference of the two operands'
        },
        {
            label: '[number:0] * [number:0]', 
            'type': 'number', 
            script: "({{1}} * {{2}})",
            help: 'product of the two operands'
        },
        {
            label: '[number:0] / [number:0]',
            'type': 'number', 
            script: "({{1}} / {{2}})",
            help: 'quotient of the two operands'
        },
        {
            label: 'pick random [number:1] to [number:10]', 
            'type': 'number', 
            script: "randint({{1}}, {{2}})",
            help: 'random number between two numbers (inclusive)'
        },
        {
            label: '[number:0] < [number:0]', 
            'type': 'boolean', 
            script: "({{1}} < {{2}})",
            help: 'first operand is less than second operand'
        },
        {
            label: '[number:0] = [number:0]', 
            'type': 'boolean', 
            script: "({{1}} === {{2}})",
            help: 'two operands are equal'
        },
        {
            label: '[number:0] > [number:0]', 
            'type': 'boolean', 
            script: "({{1}} > {{2}})",
            help: 'first operand is greater than second operand'
        },
        {
            label: '[boolean] and [boolean]', 
            'type': 'boolean', 
            script: "({{1}} && {{2}})",
            help: 'both operands are true'
        },
        {
            label: '[boolean] or [boolean]', 
            'type': 'boolean', 
            script: "({{1}} || {{2}})",
            help: 'either or both operands are true'
        },
        {
            label: '[boolean] xor [boolean]',
            'type': 'boolean',
            script: "({{1}} ? !{{2}} : {{2}})",
            help: 'either, but not both, operands are true'
        },
        {
            label: 'not [boolean]', 
            'type': 'boolean', 
            script: "(! {{1}})",
            help: 'operand is false'
        },
        {
            label: 'concatenate [string:hello] with [string:world]', 
            'type': 'string', 
            script: "({{1}} + {{2}})",
            help: 'returns a string by joining together two strings'
        },
        {
            label: '[number:0] mod [number:0]', 
            'type': 'number', 
            script: "({{1}} % {{2}})",
            help: 'modulus of a number is the remainder after whole number division'
        },
        {
            label: 'round [number:0]', 
            'type': 'number', 
            script: "Math.round({{1}})",
            help: 'rounds to the nearest whole number'
        },
        {
            label: 'absolute of [number:10]', 
            'type': 'number', 
            script: "Math.abs({{2}})",
            help: 'converts a negative number to positive, leaves positive alone'
        },
        {
            label: 'arccosine degrees of [number:10]', 
            'type': 'number', 
            script: 'rad2deg(Math.acos({{1}}))',
            help: 'inverse of cosine'
        },
        {
            label: 'arcsine degrees of [number:10]', 
            'type': 'number', 
            script: 'rad2deg(Math.asin({{1}}))',
            help: 'inverse of sine'
        },
        {
            label: 'arctangent degrees of [number:10]', 
            'type': 'number', 
            script: 'rad2deg(Math.atan({{1}}))',
            help: 'inverse of tangent'
        },
        {
            label: 'ceiling of [number:10]', 
            'type': 'number', 
            script: 'Math.ceil({{1}})',
            help: 'rounds up to nearest whole number'
        },
        {
            label: 'cosine of [number:10] degrees', 
            'type': 'number', 
            script: 'Math.cos(deg2rad({{1}}))',
            help: 'ratio of the length of the adjacent side to the length of the hypotenuse'
        },
        {
            label: 'sine of [number:10] degrees', 
            'type': 'number', 
            script: 'Math.sin(deg2rad({{1}}))',
            help: 'ratio of the length of the opposite side to the length of the hypotenuse'
        },
        {
            label: 'tangent of [number:10] degrees', 
            'type': 'number', 
            script: 'Math.tan(deg2rad({{1}}))',
            help: 'ratio of the length of the opposite side to the length of the adjacent side'
        },
        {
            label: '[number:10] to the power of [number:2]', 
            'type': 'number', 
            script: 'Math.pow({{1}}, {{2}})',
            help: 'multiply a number by itself the given number of times'
        },
        {
            label: 'square root of [number:10]', 
            'type': 'number', 
            script: 'Math.sqrt({{1}})',
            help: 'the square root is the same as taking the to the power of 1/2'
        },
        {
            label: 'pi',
            script: 'Math.PI;',
            type: 'number',
            help: "pi is the ratio of a circle's circumference to its diameter"
        },
        {
            label: 'tau',
            script: 'Math.PI * 2',
            type: 'number',
            help: 'tau is 2 times pi, a generally more useful number'
        }
    ]),
    array: menu('Arrays', [
        {
            label: 'new array##',
            script: 'array## = [];',
            help: 'Create an empty array',
            returns: {
                label: 'array##',
                script: 'array##',
                type: 'array'
            }
        },
        {
            label: 'new array with array## [array]',
            script: 'array## = {{1}}.slice();',
            help: 'create a new array with the contents of another array',
            returns: {
                label: 'array##',
                script: 'array##',
                type: 'array'
            }
        },
        {
            label: 'array [array] item [number:0]',
            script: '{{1}}[{{2}}]',
            type: 'any',
            help: 'get an item from an index in the array'
        },
        {
            label: 'array [array] join with [string:, ]',
            script: '{{1}}.join({{2}})',
            type: 'string',
            help: 'join items of an array into a string, each item separated by given string'
        },
        {
            label: 'array [array] append [any]',
            script: '{{1}}.push({{2}});',
            help: 'add any object to an array'
        },
        {
            label: 'array [array] length',
            script: '{{1}}.length',
            type: 'number',
            help: 'get the length of an array'
        },
        {
            label: 'array [array] remove item [number:0]',
            script: '{{1}}.splice({{2}}, 1)[0]',
            type: 'any',
            help: 'remove item at index from an array'
        },
        {
            label: 'array [array] pop',
            script: '{{1}}.pop()',
            type: 'any',
            help: 'remove and return the last item from an array'
        },
        {
            label: 'array [array] shift',
            script: '{{1}}.shift()',
            type: 'any',
            help: 'remove and return the first item from an array'
        },
        {   
            label: 'array [array] reversed',
            script: '{{1}}.slice().reverse()',
            type: 'array',
            help: 'reverse a copy of array'
        },
        {
            label: 'array [array] concat [array]',
            script: '{{1}}.concat({{2}});',
            type: 'array',
            help: 'a new array formed by joining the arrays'
        },
        {
            label: 'array [array] for each',
            script: '$.each({{1}}, function(idx, item){index = idx; item = item; [[1]] });',
            containers: 1,
            locals: [
                {
                    label: 'index',
                    script: 'index',
                    help: 'index of current item in array',
                    type: 'number'
                },
                {
                    label: 'item',
                    script: 'item',
                    help: 'the current item in the iteration',
                    type: 'any'
                }
            ],
            help: 'run the blocks with each item of a named array'
        }
    ], false),
    objects: menu('Objects', [
        {
            label: 'new object##',
            script: 'object## = {};',
            returns: {
                label: 'object##',
                script: 'object##',
                type: 'object'
            },
            help: 'create a new, empty object'
        },
        {
            label: 'object [object] key [string] = value [any]',
            script: '{{1}}[{{2}}] = {{3}};',
            help: 'set the key/value of an object'
        },
        {
            label: 'object [object] value at key [string]',
            script: '{{1}}[{{2}}]',
            type: 'any',
            help: 'return the value of the key in an object'
        },
        {
            label: 'object [object] for each',
            script: '$.each({{1}}, function(key, item){key = key; item = item; [[1]] });',
            containers: 1,
            locals: [
                {
                    label: 'key',
                    script: 'key',
                    help: 'key of current item in object',
                    type: 'string'
                },
                {
                    label: 'item',
                    script: 'item',
                    help: 'the current item in the iteration',
                    type: 'any'
                }
            ],
            help: 'run the blocks with each item of a named array'
            
        }
    ], false),
    strings: menu('Strings', [
        {
            label: 'string [string] split on [string]',
            script: '{{1}}.split({{2}})',
            type: 'array',
            help: 'create an array by splitting the named string on the given string'
        },
        {
            label: 'string [string] character at [number:0]',
            script: '{{1}}[{{2}}]',
            type: 'string',
            help: 'get the single character string at the given index of named string'
        },
        {
            label: 'string [string] length',
            script: '{{1}}.length',
            type: 'number',
            help: 'get the length of named string'
        },
        {
            label: 'string [string] indexOf [string]',
            script: '{{1}}.indexOf({{2}})',
            type: 'number',
            help: 'get the index of the substring within the named string'
        },
        {
            label: 'string [string] replace [string] with [string]',
            script: '{{1}}.replace({{2}}, {{3}})',
            type: 'string',
            help: 'get a new string by replacing a substring with a new string'
        },
        {
            label: 'to string [any]',
            script: '{{1}}.toString()',
            type: 'string',
            help: 'convert any object to a string'
        },
        {
            label: 'comment [string]',
            script: '// {{1}};\n',
            help: 'this is a comment and will not be run by the program'
        },
        {
            label: 'alert [string]',
            script: 'window.alert({{1}});',
            help: 'pop up an alert window with string'
        },
        {
            label: 'console log [any]',
            script: 'console.log({{1}});',
            help: 'Send any object as a message to the console'
        },
        {
            label: 'console log format [string] arguments [array]',
            script: 'var __a={{2}};__a.unshift({{1}});console.log.apply(console, __a);',
            help: 'send a message to the console with a format string and multiple objects'
        }
    ], false)

};

var demos = [
];
populate_demos_dialog(demos);
load_current_scripts();
$('.scripts_workspace').trigger('init');
console.log("Done");

$('.socket input').live('click',function(){
    $(this).focus();
    $(this).select();
});
}
