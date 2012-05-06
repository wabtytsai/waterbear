yepnope({
    load: [ 'plugins/arduino-simple-robot.css',
            'lib/beautify-arduino.js',
            'lib/highlight.js'
            
    ]
    //complete: setup
});

(function(){
    // This file depends on the runtime extensions, which should probably be moved into this namespace rather than made global
    
// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    /*keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt', 
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown', 
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),*/
    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    logic: ['true', 'false'],
    digitalpins: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,'A0','A1','A2','A3','A4','A5'],
    analoginpins: ['A0','A1','A2','A3','A4','A5'],
    pwmpins: [3, 5, 6, 9, 10, 11],
    baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200],
    analogrefs:['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL'],
    motionstates:['forward', 'backward', 'clockwise', 'anticlockwise','stop'],
    analogsensors:['IR_distance_1','IR_distance_2','light_sensor_1'],
    buttonsensors:['bumper_1']
};

window.set_defaultscript = function(script){
    window.defaultscript = script; 
};

window.load_defaultscript = function(script){
    if (typeof window.defaultscript != 'undefined'){
        //console.log("window.defaultscript =", window.defaultscript);
        load_scripts_from_object(window.defaultscript);
    }
};

window.update_scripts_view = function(){
    var blocks = $('.workspace:visible .scripts_workspace > .wrapper');
    var view = $('.workspace:visible .scripts_text_view');
    blocks.write_script(view);
};

function run_scripts(event){
    $('.stage')[0].scrollIntoView();
    var blocks = $('.workspace:visible .scripts_workspace > .trigger');
    $('.stage').replaceWith('<div class="stage"><script>' + blocks.wrap_script() + '</script></div>');
}
$('.run_scripts').click(run_scripts);

jQuery.fn.extend({
  extract_script: function(){
      if (this.length === 0) {return '';}
      if (this.is(':input')) {return this.val();}
      if (this.is('.empty')) {return '// do nothing';}
      return this.map(function(){
          var self = $(this);
          var script = self.data('script');
          if (!script) {return null;}
          var exprs = $.map(self.socket_blocks(), function(elem, idx){return $(elem).extract_script();});
          var blks = $.map(self.child_blocks(), function(elem, idx){return $(elem).extract_script();});
          if (exprs.length){
              // console.log('expressions: %o', exprs);
              var exprf = function(match, offset, s){
                  // console.log('%d args: <%s>, <%s>, <%s>', arguments.length, match, offset, s);
                  var idx = parseInt(match.slice(2,-2), 10) - 1;
                  // console.log('index: %d, expression: %s', idx, exprs[idx]);
                  return exprs[idx];
              };
              script = script.replace(/\{\{\d\}\}/g, exprf);
          }
          if (blks.length){
              var blksf = function(match, offset, s){
                  var idx = parseInt(match.slice(2,-2), 10) - 1;
                  return blks[idx];
              };
              script = script.replace(/\[\[\d\]\]/g, blksf);
          }
          next = self.next_block().extract_script();
          if (script.indexOf('[[next]]') > -1){
              script = script.replace('[[next]]', next);
          }else{
              if (self.is('.step, .trigger')){
                  script = script + '\n' + next;
              }
          }
          return script;
      }).get().join('\n\n');
  },
  
  
  extract_script_filtered: function(position){
    //console.log('extract_script this', this.data());
    if(this.data('position') == position)
    {
      return this.extract_script();
    }
    return '';
  },
  wrap_script: function(){
      // wrap the top-level script to prevent leaking into globals
      var script = this.pretty_script();
      //var retval = 'try{' + script + '}catch(e){alert(e);};';

      var retval = 'try{' + script + '}catch(e){alert(e);};';

      //console.log(retval);
      return retval;
  },
  
  pretty_script: function(){
      var structured = $(this).structured_script();
      return arduino_beautify(structured);
      //oops there is bug where '->' gets split to '- >'
      //return arduino_beautify(this.map(function(){ return $(this).extract_script();}).get().join(''));
  },
  
  structured_script: function(){
      var anyscript =  this.map(function(){ return $(this).extract_script_filtered('any');}).get().join('');
      var mainscript = this.map(function(){ return $(this).extract_script_filtered('main');}).get().join('');
      var loopscript = this.map(function(){ return $(this).extract_script_filtered('loop');}).get().join('');
      
      var structured = anyscript;//+'\n$(function(){$("#stage").playground({});\n'+mainscript+'\n'+loopscript+'\n$.playground.startGame();\n});';
      return structured;
  },
  
  /*
  wrap_script: function(){
      // wrap the top-level script to prevent leaking into globals
      var script = this.map(function(){return $(this).extract_script();}).get().join('\n\n');
      //return 'var global = new Global();\n(function($){\nvar local = new Local();\n' + script + '\n})(jQuery);';
      return script;
  },*/
  write_script: function(view){
      view.html('<code><pre class="script_view">' + this.pretty_script() +  '</pre></code>');
  }
});

function test_block(block){
    var name = block.data('klass') + ': ' + block.data('label');
    try{
        eval(block.wrap_script());
        // console.log('passed: %s', name);
        return true;
    }catch(e){
        if (e.name === 'SyntaxError'){
            console.error('failed: %s, %o', name, e);
            return false;
        }else{
            // console.warn('passed with error: %s, %o', name, e);
            return true;
        }
    }
}

function test(){
    var blocks = $('#block_menu .wrapper');
    var total = blocks.length;
    var success = 0;
    var fail = 0;
    console.log('running %d tests', total);
    blocks.each(function(idx, elem){
        setTimeout(function(){
            // console.log('running test %d', idx);
            if(test_block($(elem)))
            {
              success++;
            }
            else
            {
              fail++;
            }
            if( success + fail === total){
                console.log('Ran %d tests, %d successes, %s failures', total, success, fail);
            }
        }, 10);
    });
}
window.test = test;

function clear_scripts(event, force){
    if (force || confirm('Throw out the current script?')){
        $('.workspace:visible > *').empty();
        $('.stage').replaceWith('<div class="stage"></div>');
    }
}

function clear_scripts_default(event, force){
  clear_scripts(event, force);
  load_defaultscript();  
}


$('.clear_scripts').click(clear_scripts_default);


var menus = {
    control: menu('Control', [
        /*{
            label: 'Setup - When program starts', 
            trigger: true, 
            script: 'void setup()\n{\n[[next]]\n}\n',
            help: 'Start scripts when program starts'
        },*/
        {
            label: 'On Start', 
            trigger: true, 
            containers: 1, 
            slot: false, 
            script: 'void loop()\n{\n[[1]]\n}\n',
            help: '5 seconds after button press do the following,' //does the cutout go in here too? 
        },
        // TODO : maybe we get the definitions of the arduino function froma seperate file
        {
            label: 'if [boolean]', 
            containers: 1, 
            script: 'if({{1}}){\n[[1]]\n}',
            help: 'only run blocks if condition is true'
        },
        {
            label: 'if [boolean]', 
            containers: 2, 
            subContainerLabels: ['else'],
            script: 'if({{1}}){\n[[1]]\n}else{\n[[2]]\n}',
            help: 'run first set of blocks if condition is true, second set otherwise'
        }
        
    ], false),

    timedmovement: menu('Timed Movement', [
        //while 
        //other output
        {
            label: 'Forward [int:1] seconds', 
            script: 'TimedEvent.addTimer(iSchedTime, bot_forward); iSchedTime = iSchedTime+({{1}} * 1000); TimedEvent.addTimer(iSchedTime-1), bot_stop);',
            help: 'Move Forward for a time'
        },
        {
            label: 'Backward [int:1] seconds', 
            script: 'TimedEvent.addTimer(iSchedTime, bot_backward); iSchedTime = iSchedTime+({{1}} * 1000); TimedEvent.addTimer(iSchedTime-1), bot_stop);',
            help: 'Move Backward for a time'
        },
        {
            label: 'Clockwise [int:1] seconds', 
            script: 'TimedEvent.addTimer(iSchedTime, bot_clockwise); iSchedTime = iSchedTime+({{1}} * 1000); TimedEvent.addTimer(iSchedTime-1), bot_stop);',
            help: 'Move Clockwise for a time'
            
        },
        {
            label: 'Anticlockwise [int:1] seconds', 
            script: 'TimedEvent.addTimer(iSchedTime), bot_anticlockwise); iSchedTime = iSchedTime+({{1}} * 1000); TimedEvent.addTimer(iSchedTime-1), bot_stop);',
            help: 'Move Anticlockwise for a time'
        },
        {
            label: 'Wait [int:1] seconds', 
            script: 'TimedEvent.addTimer(iSchedTime), bot_stop); iSchedTime = iSchedTime+({{1}} * 1000);',
            help: 'Wait for a time'
        }
    ], false),
        
    // TODO : each function like bot_clockwise set a global called bot_moving with interger constants
       
        
    movement: menu('Movement', [
        
        {
            label: 'Start Forward ', 
            script: 'bot_forward();',
            help: 'Move Forward'
        },
        {
            label: 'Start Backward ', 
            script: 'bot_backward();',
            help: 'Move Backward'
        },
        {
            label: 'Start Clockwise ', 
            script: 'bot_clockwise();',
            help: 'Move Clockwise'
        },
        {
            label: 'Start Anticlockwise ', 
            script: 'bot_anticlockwise();',
            help: 'Move Anticlockwise'
        },
        {
            label: 'Pause', 
            script: 'bot_stop();',
            help: 'Move Anticlockwise'
        }
        
        
    ], false),
        
    
    sensing: menu('Sensors', [
        {
            label: 'When [choice:analogsensors] changes',
            trigger: true,
            slot: false,
            containers: 1,
            locals: [
                {
                    label: 'value',
                    script: 'Sender->value',
                    type: 'int'
                }
            ],
            script: 'void onChange_{{1}}(AnalogPortInformation* Sender){[[1]]}',
            help: 'When the sensor changes do this'
            //other way would be to use 'position' proprty to add if blocks to a shared function requires a 'pin'=>'name' map in choices to have 
        },
        {
          	label:'Distance from sensor (mm)',
          	script: "distance_calc(Sender->value)",
          	'type': 'int', 
          	help: 'Distance from sensor'
        },
        {
            label:'is moving [choice:motionstates]',
            script: "(motionstate == \"{{1}}\")",
          	'type': 'boolean', 
          	help: 'Current motion state'
        },
        
        {
            label: 'When [choice:buttonsensors] pressed',
            trigger: true,
            slot: false,
            containers: 1,
            script: 'void onDown_{{1}}(ButtonInformation* Sender){[[1]]}',
            help: 'When the button pressed do this'
        },
        {
            label: 'When [choice:buttonsensors] released',
            trigger: true,
            slot: false,
            containers: 1,
            script: 'void onDown_{{1}}(ButtonInformation* Sender){[[1]]}',
            help: 'When the button released do this'
        }
        
        //if last signal from IR low then 1024 must mean too close 
        
        
    ]),
    
    /*
        //Path clear //wall more than 15cm away
        //distance to nearest object
        //something light sensy
        */
    
    variables: menu('Variables', [
        {
          	label:'Create [string:var] set to [string]',
          	script: "String {{1}} = '{{2}}';",
          	help: 'Create a string variable'
        },
        {
          	label:'[string:var] = [string]',
          	script: "{{1}} = '{{2}}';",
          	help: 'Change the value of an already created string variable'
        },
        {
          	label:'value of [string:var]',
          	type : 'string',
          	script: "{{1}}",
          	help: 'Get the value of a string variable'
        },
        {
          	label:'Create [string:var] set to [int:0]',
          	script: "int {{1}} = {{2}}'",
          	help: 'Create an integer variable'
        },
        {
          	label:'[string:var] = [int:0]',
          	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created integer variable'
        },
        {
          	label:'value of [string:var]',
          	type : 'int',
          	script: "{{1}}",
          	help: 'Get the value of an integer variable'
        },
        
        {
          	label:'Create [string:var] set to [float:0.0]',
          	script: "float {{1}} = {{2}}",
          	help: 'Create a decimal variable'
        },
        {
          	label:'[string:var] = [float:0.0]',
          	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created deciaml variable'
        },
        {
          	label:'value of [string:var]',
          	type : 'float',
          	script: "{{1}}",
          	help: 'Get the value of a decimal variable'
        },
        {
         	label:'Create [string:var] set to [boolean:false]',
         	script: "int {{1}} = {{2}};",
          	help: 'Create a new true or false variable'
        },
        {
          	label:'[string:var] = [boolean:false]',
         	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created true or false variable'
        },
        {
          	label:'value of [string:var]',
          	type : 'boolean',
          	script: "{{1}}",
          	help: 'Get the value of a true or false variable'
        }
      ]),
    
    operators: menu('Operators', [
        {
            label: '[number:0] + [number:0]', 
            'type': 'number', 
            script: "({{1}} + {{2}})",
            help: 'Add two numbers'
        },
        {
            label: '[number:0] - [number:0]', 
            'type': 'number', 
            script: "({{1}} - {{2}})",
            help: 'Subtract two numbers'
        },
        {
            label: '[number:0] * [number:0]', 
            'type': 'number', 
            script: "({{1}} * {{2}})",
            help: 'Multiply two numbers'
        },
        {
            label: '[number:0] / [number:0]',
            'type': 'number', 
            script: "({{1}} / {{2}})",
            help: 'Divide two numbers'
        },
        {
            label: 'pick random [number:1] to [number:10]', 
            'type': 'number', 
            script: "(random({{1}}, {{2}}))",
            help: 'Generate a random number between two other numbers'
        },
        /*{
            label: 'set seed for random numbers to [number:1]', 
            script: "(randomSeed({{1}}))",
            help: ''
        },*/
        {
            label: '[number:0] < [number:0]', 
            'type': 'boolean', 
            script: "({{1}} < {{2}})",
            help: 'Check if one number is less than another'
        },
        {
            label: '[number:0] = [number:0]', 
            'type': 'boolean', 
            script: "({{1}} == {{2}})",
            help: 'Check if one number is equal to another'
        },
        
        {
            label: '[number:0] > [number:0]', 
            'type': 'boolean', 
            script: "({{1}} > {{2}})",
            help: 'Check if one number is greater than another'
        },
        {
            label: '[boolean] and [boolean]', 
            'type': 'boolean', 
            script: "({{1}} && {{2}})",
            help: 'Check if both are true'
        },
        {
            label: '[boolean] or [boolean]', 
            'type': 'boolean', 
            script: "({{1}} || {{2}})",
            help: 'Check if one is true'
        },
        {
            label: 'not [boolean]', 
            'type': 'boolean', 
            script: "(! {{1}})",
            help: 'Not true is false and Not false is true'
        },
        {
            label: '[number:0] mod [number:0]', 
            'type': 'number', 
            script: "({{1}} % {{2}})",
            help: 'Gives the remainder from the division of these two number'
        },
        
        {
            label: 'round [number:0]', 
            'type': 'int', 
            script: "(int({{1}}))",
            help: 'Gives the whole number, without the decimal part'
        },
        {
            label: 'absolute of [number:10]', 
            'type': 'number', 
            script: "(abs({{1}}))",
            help: 'Gives the positive of the number'
        },
        {
          	label: 'Map [number] from Analog in to Analog out',
          	type: 'number',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
          	help: ''
        },
        {
          	label: 'Map [number] from [number:0]-[number:1023] to [number:0]-[number:255] ',
          	type: 'number',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
            help: ''
        }
    ])
};

var defaultscript=[{"klass":"control","label":"Global Settings","script":"/*Global Settings*/\u000a\u000a[[next]]\u000a\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":""},{"klass":"control","label":"Setup - When program starts","script":"void setup()\u000a{\u000a[[next]]\u000a}\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":""},{"klass":"control","label":"Main loop","script":"void loop()\u000a{\u000a[[1]]\u000a}\u000a","containers":1,"trigger":true,"sockets":[],"contained":[""],"next":""}];
set_defaultscript(defaultscript);

var demos = [
    {
      title:"AnalogInOutSerial",
      description:"first example in Arduino IDE",
      scripts:[{"klass":"control","label":"Global Settings","script":"/*Global Settings*/\u000a\u000a[[next]]\u000a\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [string]","script":"String {{1}} = '{{2}}';","containers":0,"sockets":["analogInPin","0"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [string]","script":"String {{1}} = '{{2}}';","containers":0,"sockets":["analogOutPin","9"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [int:0]","script":"int {{1}} = {{2}}'","containers":0,"sockets":["sensorValue","0"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [int:0]","script":"int {{1}} = {{2}}'","containers":0,"sockets":["outputValue","0"],"contained":[],"next":""}}}}},{"klass":"control","label":"Setup - When program starts","script":"void setup()\u000a{\u000a[[next]]\u000a}\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":{"klass":"serial","label":"Setup serial communication at [choice:baud]","script":"Serial.begin({{1}});","containers":0,"sockets":["9600"],"contained":[],"next":""}},{"klass":"control","label":"Main loop","script":"void loop()\u000a{\u000a[[1]]\u000a}\u000a","containers":1,"trigger":true,"sockets":[],"contained":[{"klass":"variables","label":"[string:var] = [int:0]","script":"{{1}} = {{2}};","containers":0,"sockets":["sensorValue",{"klass":"io","label":"Analog Input [string:0]","script":"(analogRead({{1}}))","containers":0,"type":"int","sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"string","sockets":["analogInPin"],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":{"klass":"variables","label":"[string:var] = [int:0]","script":"{{1}} = {{2}};","containers":0,"sockets":["outputValue",{"klass":"operators","label":"round [number:10]","script":"(int({{1}}))","containers":0,"type":"int","sockets":[{"klass":"operators","label":"Map [number] from Analog in to Analog out","script":"map({{1}}, 0, 1023, 0, 255)","containers":0,"type":"number","sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"int","sockets":["sensorValue"],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":{"klass":"serial","label":"Send [any:Message] as a line","script":"Serial.println({{1}});","containers":0,"sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"int","sockets":["outputValue"],"contained":[],"next":""}],"contained":[],"next":""}}}],"next":""}]
    }
];
populate_demos_dialog(demos);

})();
