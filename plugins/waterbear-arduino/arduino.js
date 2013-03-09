/*
 *    ARDUINO PLUGIN
 *
 *    Support for writing Arduino using Waterbear
 *
 */

(function(){


// Pre-load dependencies
yepnope({
    load: [ 'plugins/waterbear-arduino/arduino.css',
            //'lib/beautify-arduino.js',
            'lib/highlight.js',
            'lib/highlight-javascript.js',
            'lib/highlight-github.css'
    ]
});

Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
        {
          j = ++i;
        }
      }
      a.push(this[i]);
    }
    return a;
  };
  
jQuery.fn.extend({
    getIncludeCode:function(){
      var code = this.getIncludes().map(function(file){return '#include <'+file+'>\n';}).join('\n');
      return code;
    },
    
    prettyScript: function(){
      var script = $(this).getIncludeCode();
      script = script + $(this).getConcatenatedScript();
      //ecapeing html entities?
      return script;
    },
    
    writeScript: function(view){
      view.html('<pre class="language-arduino">' + this.prettyScript() + '</pre>');
      //hljs.highlightBlock(view.children()[0]);
    }
});

// End UI section

// expose these globally so the Block/Label methods can find them
window.choiceLists = {
    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    onoffhighlow: {'HIGH':'ON', 'LOW':'OFF'},
    onoffbool: {'true':'ON', 'false':'OFF'},
    logic: ['true', 'false'],
    digitalinputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    //'push_button_pin':'Push Button','external_button1_pin':'External Button 1','external_button2_pin':'External Button 2',0:
    analoginputpins: {'A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    //'pot_pin':'Potentiometer',
    digitaloutputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    //'LED_Green_pin':'Front LED','LED_2_pin':'LED 2',
    analogoutputpins: {3:'Pin 3', 5:'Pin 5', 6:'Pin 6', 9:'Pin 9', 10:'Pin 10', 11:'Pin 11'},
    //'servo_pin':'Servo', 
    alloutputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    //'servo_pin':'Servo','LED_Green_pin':'Front LED','LED_2_pin':'LED 2',baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200],
    analogrefs:['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL'],
    blocktypes: ['step', 'expression', 'context', 'eventhandler'],
    types: ['string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'],
    rettypes: ['none', 'string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'] 
};

// Hints for building blocks
//
//
// Expression blocks can nest, so don't end their scripts with semi-colons (i.e., if there is a "type" specified).
//
//

// MENUS

// Special menus used at runtime

wb.menu('Globals', []);
// Temporarily disable these until I can get time to implement them properly
// wb.menu('Recent Blocks', []);
// wb.menu('Favourite Blocks', []);

// Javascript core blocks

wb.menu('Control', [
    {
      blocktype: 'eventhandler',
      labels: ['Setup - When program starts'],
      concatenate:true,
      script: 'void setup() {[[1]]}',
      help: 'Do Once when the program starts' //does the cutout go in here too? 
    },
    
    {
      blocktype: 'eventhandler',
      labels: ['Main Loop'], 
      concatenate:true,
      script: 'void loop() {[[1]]}',
      help: 'Will do these blocks repeatedly' //does the cutout go in here too? 
    },
    /*
    {
      blocktype: 'eventhandler',
      labels: ['When I receive [string:ack] message'], 
          script: 'void {{1}}(){\n[[next]]\n}\nvoid{{1}}_timed(TimerInformation* Sender){{{1}();};',
      help: 'Trigger for blocks to run when message is received',
      onAdd:'addBroadcast({{1}})',
      onRemove:'removeBroadcast({{1}})'
    },
    {
      blocktype: 'step',
      labels: ['Broadcast [string:ack] message'], 
      script: '{{1}}();',
      help: 'Send a message to all listeners'
    },*/
    {
      blocktype: 'context',
      labels: ['if [boolean]'], 
      script: 'if({{1}}){\n[[1]]\n}',
      help: 'only run blocks if condition is true'
    },
    {
      blocktype: 'context',
      labels: ['if [boolean]','else'], 
      script: 'if({{1}}){\n[[1]]\n}else{\n[[2]]\n}',
      help: 'run first set of blocks if condition is true, second set otherwise'
    },
    {
      blocktype: 'step',
      labels: ['wait until [boolean:true]'], 
      script: 'while(!{{1}}){\n}\n',
      help: 'repeat until the condition is false'
    },
    
    {
      blocktype: 'context',
      labels: ['forever while [boolean:true]'], 
      script: 'while({{1}}){[[1]]}',
      help: 'repeat until the condition is false'
    },
    {
      blocktype: 'context',
      labels: ['once and forever while [boolean:true]'], 
      script: 'do{[[1]]} while({{1}});',
      help: 'do once then repeat until the condition is false'
    },
    {
      blocktype: 'context',
      labels: ['repeat [int:10] times'], 
      script: 'for (int index##=0; index## <= {{1}}; index##++){[[1]]};',
      help: 'repeat the contained blocks so many times',
      locals: [
          {
              blocktype: 'expression',
              labels: ['loop index##'],
              script: 'index##',
              type: 'int'
          }
      ]
    }
], false);


  wb.menu('Sensors', [
    {
      blocktype: 'step',
      labels: ['Create Analog Input ## on [choicevar:analoginputpins]'], 
      script: 'int analog_input##_pin = {{1}}; pinMode(analog_input##_pin, INPUT);',
      help: 'Use a Pin as an Analog Input',
      returns:{
        blocktype: 'expression',
        labels: ['Value of Analog Input ##'], 
        type: 'int', 
        script: 'analogRead(analog_input##_pin)',
        help: 'Value of Input (0-1023)'
      }
    },
    
    {
      blocktype: 'step',
      labels: ['Create Digital Input ## on [choicevar:digitalinputpins]'], 
      script: 'int digital_input##_pin = {{1}}; pinMode(digital_input##_pin, INPUT);',
      help: 'Use a Pin as a Digital Input',
      locals:[
        {
          blocktype: 'expression',
          labels: ['Value of Digital Input ##'], 
          type: 'int', 
          script: 'digitalRead(digital_input##_pin)',
          help: 'Value of Input (0-1023)'
        },
        {
          blocktype: 'expression',
          labels: ['Digital Input ## is [choicevar:onoffhighlow]'], 
          type: 'boolean', 
          script: '(digital_input##_pin) == {{1}})',
          help: 'Is the button Pressed or not'
        },
        {
          blocktype: 'context',
          labels: ['Wait for a pulse of Digital Input ## being [choice:onoffhighlow] or [int:1000] millisseconds (pulse_length_##_millis)'], 
          script: 'long pulse_length_##_millis = pulseIn(digital_input##_pin, {{1}}, {{2}});',
          locals:
          [{
                  labels: ['pulse_length_##_millis'],
                  script: 'pulse_length_##_millis',
                  type: 'int'
          }],
          help: 'Wait for a pulse on a pin and record how long the pulse was'
        }
        
        /*,
        {
          blocktype: 'eventhandler',
          labels: ['When Digital Input ## is ON'],
          concatenate:true,
          script: 'ifdigitalRead(digital_input##_pin) == HIGH){[[1]]}',
          help: 'When the Digital Input ## is ON do this'
          //other way would be to use 'position' proprty to add if blocks to a shared function requires a 'pin'=>'name' map in choices to have 
        }*/
      ]
    }
    /*
    {
      blocktype: 'step',
      labels: ['Set [choicevar:analoginputpins] to input mode'], 
      script: 'pinMode({{1}}, INPUT);',
      help: 'Set pin to input mode - not normally needed'
    },*/
    /*{
      // TODO : change to new model
      blocktype: 'eventhandler',
      labels: ['When [choicevar:digitalinputpins] is ON'],
      concatenate:true,
      script: 'if(digitalRead({{1}}) == HIGH){[[1]]}',
      help: 'When the button pressed do this'
      //other way would be to use 'position' proprty to add if blocks to a shared function requires a 'pin'=>'name' map in choices to have 
    },*/
    /*
    {
      blocktype: 'expression',
      labels: ['[choicevar:digitalinputpins] is [choicevar:onoffhighlow]'], 
      type: 'boolean', 
      script: '(digitalRead({{1}}) == {{2}})',
      help: 'Is the button Pressed or not'
    },
  */
    /*
    {
    labels: ['Wait for a pulse of [choice:digitalinputpins] being [choice:onoffhighlow] or [int:1000] millisseconds (pulse_length_##_millis)'], 
    script: 'long pulse_length_##_millis = pulseIn({{1}}, {{2}}, {{3}});',
    choiceLists.locals = [
          {
              labels: ['pulse_length_##_millis'],
              script: 'pulse_length_##_millis',
              type: 'int'
          };
      ],
      help: 'Wait for a pulse on a pin and record how long the pulse was'
    },
    */
    /*
    {
    labels: ['if [choice:digitalinputpins] pulses [choice:onoffhighlow] in next [int:1000] ms longer than [int:0] ms'], 
    script: 'long pulse_ms## = pulseIn({{1}}, {{2}}, {{3}}); if(pulse_ms## > {{4}}){\n[[1]]\n}\n',
      choiceLists.locals = [
        {
            labels: ['pulse_ms##'],
            script: 'pulse_ms##',
            type: 'int'
        };
    ],
    help: 'Wait for a pulse on a pin and record how long the pulse was'
    },
    */
    /*{
      blocktype: 'expression',
      labels: ['value of [choicevar:analoginputpins]'], 
      type: 'int', 
      script: 'analogRead({{1}})',
      help: 'Value of Input (0-1023)'
    },*/
    ]);
    
    /*
    //Path clear //wall more than 15cm away
    //distance to nearest object
    //something light sensy
    */
  wb.menu('Outputs', [
    {
      blocktype: 'step',
      labels: ['Set [choicevar:alloutputpins] to output mode'], 
      script: 'pinMode({{1}}, OUTPUT);',
      help: 'Set the pin to output mode - normally in Setup'
    },
    {
      blocktype: 'step',
      labels: ['Set [choicevar:digitaloutputpins] to [choicevar:onoffhighlow]'],
      script: 'digitalWrite({{1}}, {{2}});',
      help: 'Switch a Digital Output Pin on or off'
    },
    {
      blocktype: 'step',
      labels: ['Set [choicevar:analogoutputpins] to [int:255]'], 
      script: 'analogWrite({{1}}, {{2}});',
      help: 'Set value of PWM pin (0-255)'
    },
    
    {
      blocktype: 'step',
      labels: ['Create servo## on [choicevar:digitaloutputpins]'],
      script: 'Servo servo##;',
      includes: ['Servo.h'],
      /*script: { 'include': '#include <Servo.h>',
                'declaration':'Servo servo_##;',
                //'setup':  'pinMode({{1}}, OUTPUT);'
      },*/
      returns: {
          blocktype: 'step',
          labels: ['Set servo## to [int:0] degrees'], 
          script: 'servo##.write({{1}});',
          help: 'Set position of servo in degrees (0-180)'
        },
      help: 'Create a servo'
    },
    
    {
      blocktype: 'step',
      labels: ['Set servo to [int:0] degrees'], 
      script: 'myservo.write({{1}});',
      help: 'Set position of sevo in degrees (0-180)'
    },
    
    {
      blocktype: 'step',
      labels: ['Dispense  a Sweet'],
      script: 'dispense();',
      help: 'Dispense a Sweet'
    },
    {
      blocktype: 'expression',
      labels: ['Map [int:0] from Analog in to Analog out'],
      type: 'int',
      script: 'map({{1}}, 0, 1023, 0, 255)',
      help: 'Convert numbers 0-1023 to 0-255'
    }
    ]);
    
  wb.menu('Timing', [
    {
      blocktype: 'step',
      labels: ['wait [int:1] secs'], 
      script: 'delay(1000*{{1}});',
      help: 'pause before running subsequent blocks'
    },
    {
      blocktype: 'step',
      labels: ['wait [int:100] milli seconds'], 
      script: 'delay({{1}});',
      help: 'pause before running subsequent blocks'
    },
    {
      blocktype: 'expression',
      labels: ['Milliseconds since program started'], 
      type: 'int', 
      script: '(millis())',
      help: 'int value of time elapsed'
    },
    {
      blocktype: 'expression',
      labels: ['Seconds since program started'], 
      type: 'int', 
      script: '(int(millis()/1000))',
      help: 'int value of time elapsed'
    }
    
    ]);


  
  wb.menu('Variables', [
    {
      blocktype: 'step',
      labels: ['Create [string:var] set to [string]'],
      script: "String {{1}} = '{{2}}';",
      help: 'Create a string variable'
    },
    {
      blocktype: 'step',
      labels: ['[string:var] = [string]'],
      script: "{{1}} = '{{2}}';",
      help: 'Change the value of an already created string variable'
    },
    {
      blocktype: 'expression',
      labels: ['value of [string:var]'],
      type : 'string',
      script: "{{1}}",
      help: 'Get the value of a string variable'
    },
    {
      blocktype: 'step',
      labels: ['Create [string:var] set to [int:0]'],
      script: "int {{1}} = {{2}}'",
      help: 'Create an integer variable'
    },
    {
      blocktype: 'step',
      labels: ['[string:var] = [int:0]'],
      script: "{{1}} = {{2}};",
      help: 'Change the value of an already created integer variable'
    },
    {
      blocktype: 'expression',
      labels: ['value of [string:var]'],
      type : 'int',
      script: "{{1}}",
      help: 'Get the value of an integer variable'
    },
    
    {
      blocktype: 'step',
      labels: ['Create [string:var] set to [float:0.0]'],
      script: "float {{1}} = {{2}};",
      help: 'Create a decimal variable'
    },
    {
      blocktype: 'step',
      labels: ['[string:var] = [float:0.0]'],
      script: "{{1}} = {{2}};",
      help: 'Change the value of an already created deciaml variable'
    },
    {
      blocktype: 'expression',
      labels: ['value of [string:var]'],
      type : 'float',
      script: "{{1}}",
      help: 'Get the value of a decimal variable'
    },
    {
      blocktype: 'step',
      labels: ['Create [string:var] set to [boolean:false]'],
      script: "int {{1}} = {{2}};",
      help: 'Create a new true or false variable'
    },
    {
      blocktype: 'step',
      labels: ['[string:var] = [boolean:false]'],
      script: "{{1}} = {{2}};",
      help: 'Change the value of an already created true or false variable'
    },
    {
      blocktype: 'expression',
      labels: ['value of [string:var]'],
      type : 'boolean',
      script: "{{1}}",
      help: 'Get the value of a true or false variable'
    }
]);
wb.menu('Operators', [
    {
      blocktype: 'expression',
      labels: ['[number:0] + [number:0]'], 
      type: 'number', 
      script: "({{1}} + {{2}})",
      help: 'Add two numbers'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] - [number:0]'], 
      type: 'number', 
      script: "({{1}} - {{2}})",
      help: 'Subtract two numbers'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] * [number:0]'], 
      type: 'number', 
      script: "({{1}} * {{2}})",
      help: 'Multiply two numbers'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] / [number:0]'],
      type: 'number', 
      script: "({{1}} / {{2}})",
      help: 'Divide two numbers'
    },
    {
      blocktype: 'expression',
      labels: ['pick random [int:1] to [int:10]'], 
      type: 'int', 
      script: "(random({{1}}, {{2}}))",
      help: 'Generate a random number between two other numbers'
    },
    /*{
      labels: ['set seed for random numbers to [number:1]'], 
      script: "(randomSeed({{1}}))",
      help: ''
    },*/
    {
      blocktype: 'expression',
      labels: ['is [number:0] between [number:1] and [number:100]'], 
      type: 'boolean', 
      script: "(({{1}} > {{2}}) && ({{1}} < {{3}}))",
      help: 'Check if one number is between the others exclusive'
    },
    {
      blocktype: 'expression',
      labels: ['is [number:0] between [number:1] and [number:100] (inclusive)'], 
      type: 'boolean', 
      script: "(({{1}} >= {{2}}) && ({{1}} =< {{3}}))",
      help: 'Check if one number is between the others inclusive'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] < [number:0]'], 
      type: 'boolean', 
      script: "({{1}} < {{2}})",
      help: 'Check if one number is less than another'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] = [number:0]'], 
      type: 'boolean', 
      script: "({{1}} == {{2}})",
      help: 'Check if one number is equal to another'
    },
    
    {
      blocktype: 'expression',
      labels: ['[number:0] > [number:0]'], 
      type: 'boolean', 
      script: "({{1}} > {{2}})",
      help: 'Check if one number is greater than another'
    },
    {
      blocktype: 'expression',
      labels: ['[boolean:false] and [boolean::false]'], 
      type: 'boolean', 
      script: "({{1}} && {{2}})",
      help: 'Check if both are true'
    },
    {
      blocktype: 'expression',
      labels: ['[boolean:false] or [boolean:false]'], 
      type: 'boolean', 
      script: "({{1}} || {{2}})",
      help: 'Check if one is true'
    },
    {
      blocktype: 'expression',
      labels: ['not [boolean:false]'], 
      type: 'boolean', 
      script: "(! {{1}})",
      help: 'Not true is false and Not false is true'
    },
    {
      blocktype: 'expression',
      labels: ['[number:0] mod [number:0]'], 
      type: 'number', 
      script: "({{1}} % {{2}})",
      help: 'Gives the remainder from the division of these two number'
    },
    
    {
      blocktype: 'expression',
      labels: ['round [number:0]'], 
      type: 'int', 
      script: "(int({{1}}))",
      help: 'Gives the whole number, without the decimal part'
    },
    {
      blocktype: 'expression',
      labels: ['absolute of [number:10]'], 
      type: 'number', 
      script: "(abs({{1}}))",
      help: 'Gives the positive of the number'
    },
    {
      blocktype: 'expression',
      labels: ['Map [int:0] from Analog in to Analog out'],
      type: 'int',
      script: 'map({{1}}, 0, 1023, 0, 255)',
      help: ''
    },
    {
      blocktype: 'expression',
      labels: ['Map [int:0] from [int:0]-[int:1023] to [int:0]-[int:255] '],
      type: 'int',
      script: 'map({{1}}, 0, 1023, 0, 255)',
      help: ''
    }
    ]);
    
  wb.menu('Serial', [
    /*{
      blocktype: 'step',
      labels: ['Setup serial communication at [choice:baud]'], 
      script: "Serial.begin({{1}});",
      help: 'Eanble serial communications at a chosen speed'
    },*/
    {
      blocktype: 'step',
      labels: ['Send [any:Message] as a line'], 
      script: "Serial.println({{1}});",
      help: 'Send a message over the serial connection followed by a line return'
    },
    {
      blocktype: 'step',
      labels: ['Send [any:Message]'], 
      script: "Serial.print({{1}});",
      help: 'Send a message over the serial connection'
    },
    {
      blocktype: 'expression',
      labels: ['Message Value'], 
      type: 'string',
      script: "Serial.read()",
      help: 'Read a message from the serial connection'
    },
    {
      blocktype: 'step',
      labels: ['End serial communication'], 
      script: "Serial.end();",
      help: 'Disable serial communications'
    }
]);
  
wb.menu('Strings', [
    {
        blocktype: 'expression',
        labels: ['string [string] split on [string]'],
        script: '{{1}}.split({{2}})',
        type: 'array',
        help: 'create an array by splitting the named string on the given string'
    },
    {
        blocktype: 'expression',
        labels: ['string [string] character at [number:0]'],
        script: '{{1}}[{{2}}]',
        type: 'string',
        help: 'get the single character string at the given index of named string'
    },
    {
        blocktype: 'expression',
        labels: ['string [string] length'],
        script: '{{1}}.length',
        type: 'number',
        help: 'get the length of named string'
    },
    {
        blocktype: 'expression',
        labels: ['string [string] indexOf [string]'],
        script: '{{1}}.indexOf({{2}})',
        type: 'number',
        help: 'get the index of the substring within the named string'
    },
    {
        blocktype: 'expression',
        labels: ['string [string] replace [string] with [string]'],
        script: '{{1}}.replace({{2}}, {{3}})',
        type: 'string',
        help: 'get a new string by replacing a substring with a new string'
    },
    {
        blocktype: 'expression',
        labels: ['to string [any]'],
        script: '{{1}}.toString()',
        type: 'string',
        help: 'convert any object to a string'
    },
    {
        blocktype: 'step',
        labels: ['comment [string]'],
        script: '// {{1}};\n',
        help: 'this is a comment and will not be run by the program'
    },
    {
        blocktype: 'step',
        labels: ['alert [string]'],
        script: 'window.alert({{1}});',
        help: 'pop up an alert window with string'
    },
    {
        blocktype: 'step',
        labels: ['console log [any]'],
        script: 'console.log({{1}});',
        help: 'Send any object as a message to the console'
    },
    {
        blocktype: 'step',
        labels: ['console log format [string] arguments [array]'],
        script: 'var __a={{2}};__a.unshift({{1}});console.log.apply(console, __a);',
        help: 'send a message to the console with a format string and multiple objects'
    },
    {
        blocktype: 'expression',
        labels: ['global keys object'],
        script: 'global.keys',
        help: 'for debugging',
        type: 'object'
    }
], false);


$('.scripts_workspace').trigger('init');

$('.socket input').live('click',function(){
    $(this).focus();
    $(this).select();
});

})();
