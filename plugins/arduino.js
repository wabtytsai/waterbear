function cleanUp()
{
  dirty= false;
  $("#compile_text").html(" Build");
  enableLink($(".link_ino"));
  disableLink($(".link_hex"));
  $("#revert").addClass("disabled").off('click');
  $("#save").addClass("disabled").off('click');
}

function setProgress(newprogress)
{
  $("#progress").show('fast');
  $("#progress_val").width(newprogress+'%');
  $("#operation_output").hide('fast');
  // $("#progress").show('fast');
  // if(newprogress < 10)
  // 	window.currentProgress = 0.5*newprogress;
  // else
  // 	window.currentProgress = 0;
  // $("#progress_val").width(window.currentProgress+'%');
  //
  // window.maxProgress = newprogress;
  // window.interval = setInterval(function()
  // {
  // 	$("#progress_val").width(window.currentProgress+'%');
  // 	if(window.currentProgress < window.maxProgress)
  // 		window.currentProgress++;
  // },10);
  // $("#operation_output").hide('fast');
}

function getMaxSize()
{
  var max_size;
  //if($("select[id='boards'] option:selected").html() == "Arduino Uno")
  //{
    max_size = 32256;
  //}
  //else if($("select[id='boards'] option:selected").html() == "Arduino Duemilanove")
  //{
  //	max_size = 30720;
  //}
  return max_size;
}

function clearProgress(msg)
{
  $('#statusbox .select').addClass('selected').siblings('.option').slideDown('slow');
  $('#block_menu').scrollTop(0);

  $('#statusmessage').html(msg);
  //$('.stage').html(msg);
  //console.log("msg =", msg);
}

function uploadusb(compileResult)
{
  var binary = compileResult.output;
  compileResult.size = binary.length + 1; //this is wrong but is quick
  console.log("compileResult.size =", compileResult.size);
  console.log("plugin =", plugin);
  
  var iBoard = $("#boards").val(); //UNO only at the mo
    
  if($("#ports").val() !== null && $("#ports").val() !== "")
  {
  
    var max_size = window.boardz[iBoard].upload.maximum_size;

    if(compileResult.size > max_size)
    {
      clearProgress("There is not enough space!");
      $('#connect').addClass('hidden');
      return;
    }

    clearProgress('Uploading to Arduino');
    
    var portname = window.portslist.options[portslist.selectedIndex].text;
    //var iBoard = 0; //UNO only at the mo
    
    //console.log("iBoard =", iBoard);
    //console.log("build window.boardz[iBoard] =", window.boardz[iBoard]);
    
    var progress = plugin.flash(portname, binary, window.boardz[iBoard].upload.maximum_size, window.boardz[iBoard].upload.protocol, window.boardz[iBoard].upload.speed, window.boardz[iBoard].build.mcu);


    //console.log("applet =", applet);
    console.log("progress =", progress);
    // clearInterval(window.progressInterval);
    if(progress)
    {
      clearProgress("There was an error uploading to Arduino. Error #" + progress);
      $('#connect').addClass('hidden');
    }
    else
    {
      clearProgress("Upload successful. Program Running");
      //$('#connect').removeClass('hidden');
    }

    // alert("Data received: " + data);

  }
  else
  {
    clearProgress("Please select a valid port or enable the Java Applet!!");
    $('#connect').addClass('hidden');
  }
}


function getFire()
{

  //console.log("getFire plugin =", plugin);
  var ports="";
  try{
    ports = plugin.probeUSB();
    if(ports != oldPorts){
      $('#ports').find('option').remove();
      portsAvail=ports.split(",");
      for (var i =0 ;i< portsAvail.length ; i++){
        if (portsAvail[i]!==""){
          portslist.options[i]=new Option(portsAvail[i],portsAvail[i],true,false);
        }
      }
      oldPorts = ports;
    }
  }
  catch(err){
  $('#ports').find('option').remove();
  oldPorts = ports;
  }
}


function scan()
{
   console.log("scan =", scan);
  getFire();
  setInterval(function(){	getFire(); }, 1000);
}

function getIds()
{
  console.log("getIds ");
  window.portslist= $("#ports")[0];
  window.oldPorts = "";
  window.plugin = document.getElementById('plugin0');
  document.getElementById('plugin0').download();
  $('#missingplugin').hide();

  setTimeout(function(){
    scan();
  }, 200);
}


function connect()
{
  portsel =$("#ports");
  console.log("portsel =", portsel);
  if($("#ports").val() !== null && $("#ports").val() !== "")
  {

      //alert('called connect ');
      var port= window.portslist.options[portslist.selectedIndex].value;
      console.log("port =", port);
      //alert("overrideConnect('"+portslist.selectedIndex+"','"+rateslist.selectedIndex+"')");

      applet.overrideConnect(portslist.selectedIndex);
  }
  else
  {
    clearProgress("Please select a valid port or enable the Java Applet!!");
  }
}

function enableUSB(){
  //$("#prescanning").toggle("blind", {}, 1000);
  //$("#scanning").toggle("blind", {}, 1000);
  setTimeout(function(){
      getIds();
  }, 200);
  //setTimeout(function(){
  //loadSettings();
  //}, 500);
}
window._loadTemplates = function(data)
{
  if (window.aTemplates != data)
  {
    window.aTemplates = data;
    var myTemplates = $("#templates");
    myTemplates.find('option').remove();
    for (var i=0;i<window.aTemplates.content.length;i++)
    {
      //mySelect.append($('<option></option>').val(window.boardz[i].name).html(window.boardz[i].name));
      myTemplates.append($('<option></option>').val(i).html(window.aTemplates.name[i]));
    }
  }
};
      

yepnope({
    load: [ 'plugins/arduino.css',
            'lib/beautify-arduino.js',
            'lib/highlight.js'
            
    ],
    complete: function(){
      console.log("complete =");
      
      window.boardz = [{"name":"Arduino Uno","upload":{"protocol":"arduino","maximum_size":"32256","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xde","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Uno is the reference model for the Arduino platform. It has 14 digital input\/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button. It does not use the FTDI USB-to-serial driver chip. Instead, it features the Atmega16U2 (Atmega8U2 up to version R2) programmed as a USB-to-serial converter."},{"name":"Arduino Duemilanove w\/ ATmega328","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"Around March 1st, 2009, the Duemilanove started to ship with the ATmega328p instead of the ATmega168. The ATmega328 has 32 KB, (also with 2 KB used for the bootloader)."},{"name":"Arduino Diecimila or Duemilanove w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_diecimila.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Duemilanove automatically selects the appropriate power supply (USB or external power), eliminating the need for the power selection jumper found on previous boards. It also adds an easiest to cut trace for disabling the auto-reset, along with a solder jumper for re-enabling it."},{"name":"Arduino Nano w\/ ATmega328","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"The Arduino Nano is an all-in-one, compact design for use in breadboards. Version 3.0 has an ATmega328."},{"name":"Arduino Nano w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_diecimila.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"Older Arduino Nano with ATmega168 instead of the newer ATmega328."},{"name":"Arduino Mega 2560 or Mega ADK","upload":{"protocol":"stk500v2","maximum_size":"258048","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0xfd","path":"stk500v2","file":"stk500boot_v2_mega2560.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega2560","f_cpu":"16000000L","core":"arduino","variant":"mega"},"description":"The Mega 2560 is an update to the Arduino Mega, which it replaces. It features the Atmega2560, which has twice the memory, and uses the ATMega 8U2 for USB-to-serial communication."},{"name":"Arduino Mega (ATmega1280)","upload":{"protocol":"arduino","maximum_size":"126976","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0xf5","path":"atmega","file":"ATmegaBOOT_168_atmega1280.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega1280","f_cpu":"16000000L","core":"arduino","variant":"mega"},"description":"A larger, more powerful Arduino board. Has extra digital pins, PWM pins, analog inputs, serial ports, etc. The original Arduino Mega has an ATmega1280 and an FTDI USB-to-serial chip."},{"name":"Arduino Leonardo","upload":{"protocol":"avr109","maximum_size":"28672","speed":"57600","disable_flushing":"true"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0xcb","path":"caterina","file":"Caterina-Leonardo.hex","unlock_bits":"0x3F","lock_bits":"0x2F"},"build":{"vid":"0x2341","pid":"0x8036","mcu":"atmega32u4","f_cpu":"16000000L","core":"arduino","variant":"leonardo"},"description":"The Leonardo differs from all preceding boards in that the ATmega32u4 has built-in USB communication, eliminating the need for a secondary processor. This allows the Leonardo to appear to a connected computer as a mouse and keyboard, in addition to a virtual (CDC) serial \/ COM port."},{"name":"Arduino Mini w\/ ATmega328","upload":{"protocol":"stk500","maximum_size":"28672","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328-Mini.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"The Mini is a compact Arduino board, intended for use on breadboards and when space is at a premium. This version has an ATmega328."},{"name":"Arduino Mini w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_ng.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"Older Arduino Mini version with the ATmega168 microcontroller."},{"name":"Arduino Ethernet","upload":{"protocol":"arduino","maximum_size":"32256","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xde","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Ethernet differs from other boards in that it does not have an onboard USB-to-serial driver chip, but has a Wiznet Ethernet interface. This is the same interface found on the Ethernet shield."},{"name":"Arduino Fio","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328_pro_8MHz.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"8000000L","core":"arduino","variant":"eightanaloginputs"},"description":"An Arduino intended for use as a wireless node. Has a header for an XBee radio, a connector for a LiPo battery, and a battery charging circuit."}];

      mySelect = $("#boards");
      for (var i=0;i<window.boardz.length;i++)
      {
        //mySelect.append($('<option></option>').val(window.boardz[i].name).html(window.boardz[i].name));
        mySelect.append($('<option></option>').val(i).html(window.boardz[i].name));
      }
      
      window.enabledapplet=false;
      
      //$('.tab_bar').append('<select id="ports" class="myoptions">');
      
      $("#progress").hide();
      $("#scanning").hide();
      $("#net-tools").hide();
      
      
      
      //$('.tab_bar2').append('<button id="connect">Serial Monitor</button>');
      enableUSB();
      //$('#connect').on('click', function(event){window.connect();});
    }
});

(function(){
  
  $("#block_menu").append('<section id="statusbox" class="submenu"><h3 class="select">Arduino Status</h3><div class="option"><p id="statusmessage">&nbsp;</p><p id="missingplugin">It seems like you need to enable or install the Codebender.cc Browser Plugin. You can download the plugin from <a href="http://exp.dev.codebender.cc/amaxilatis/Symfony/web/codebender.xpi" >here</a>.</p><p><small>Arduino Compiling &amp; Flashing by <a href="http://codebender.cc/">Codebender/</a></small></p></div></section><section id="controlbox" class="submenu"><h3 class="select">Arduino Control</h3><div class="option" style="display:none;"><p>Port <select id="ports" class="myoptions"></select></p><p>Board <select id="boards" ></select></p><p> Template <select id="templates" ></select></p> </div></section>');
            
            
  $('body').append('<object id="plugin0" type="application/x-codebendercc" width="0" height="0"><param name="onload" value="enableUSB" /></object>');
  
  /*			<div id="enableUSBdiv">
          <button id = "enableUSB" class="btn span12" style="margin-bottom:10px; margin-left:0px;" onclick="enableUSB();"><i id="upload_icon" class="icon-play"></i><span id="upload_text"> Enable USB flash </span></button>
        </div>
      </div>
        <div id="scanning">
            

        <button id = "uploadusb" class="btn disabled span12" style="margin-bottom:10px; margin-left:0px;"><i id="upload_icon" class="icon-upload"></i><span id="upload_text"> USB Flash </span></button>
      </div>
    </div>'
  */

  var pluginname = "arduino";
  window.aTemplates = [];
  
  
  window.loadTemplates = function(pluginname){
    $.post('../code_template.php?type='+pluginname, window._loadTemplates, 'json')
    .error(function(){
          $.post('plugins/'+pluginname+'-templates.json', window._loadTemplates, 'json');
    });
  };
  
  window.loadTemplates(pluginname);
  setInterval(function(){	window.loadTemplates(pluginname); }, 60000);
    
  
// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    onoffhighlow: {'HIGH':'ON', 'LOW':'OFF'},
    onoffbool: {'true':'ON', 'false':'OFF'},
    logic: ['true', 'false'],
    digitalinputpins:{'push_button_pin':'Push Button','external_button1_pin':'External Button 1','external_button2_pin':'External Button 2',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    analoginputpins: {'pot_pin':'Potentiometer','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    digitaloutputpins:{'LED_Green_pin':'Front LED','LED_2_pin':'LED 2',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    analogoutputpins: {'servo_pin':'Servo', 3:'Pin 3', 5:'Pin 5', 6:'Pin 6', 9:'Pin 9', 10:'Pin 10', 11:'Pin 11'},
    alloutputpins:{'servo_pin':'Servo','LED_Green_pin':'Front LED','LED_2_pin':'LED 2',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200],
    analogrefs:['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL']
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
    var blocks = $('.workspace:visible .scripts_workspace > .trigger');
    
    clearProgress('Sending to server for compilation');
    
    var url = 'http://compiler.codebender.cc/';
    
    var portname = window.portslist.options[portslist.selectedIndex].text;
    var iBoard = $("#boards").val(); //UNO only at the mo
        
    var aCompile = {"files":
        [{"filename":"main.ino","content":blocks.wrap_script()}],
        "format":"binary",//"syntax",
        "build":window.boardz[iBoard].build
        };
        
    $.post( url , JSON.stringify(aCompile) , function(data, textStatus){
      var obj = jQuery.parseJSON(data);
      console.log("obj =", obj);
      if(obj.success === false)
      {
        clearProgress("Compilation failed.<br>"+obj.message);
      }
      else
      {        
        var progressText = "<p>" + obj.text + "<br /> Code Size: " + obj.size + " bytes<br /><small>(out of <strong>"+ getMaxSize()+"</strong> available.)</small></p>";
        clearProgress(progressText);
        uploadusb(obj);
        
      }
		    
    });
}

$('.run_scripts').click(run_scripts);

jQuery.fn.extend({
  extract_script: function(){
      if (this.length === 0) {return '';}
      if (this.is(':input')) {return this.val();}
      if (this.is('.empty')) {return "\n// do nothing\n";}
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
    if(this.data('position') == position)
    {
      return this.extract_script();
    }
    return '';
  },
  
  wrap_script: function(){
      // wrap the top-level script to prevent leaking into globals
      var retval = $(this).structured_script();
      return retval;
  },
  
  pretty_script: function(){
      var structured = $(this).structured_script();
      //structured = arduino_beautify(structured);
      structured = $('<div/>').text(structured).html();
      return structured;
      //oops there is bug where '->' gets split to '- >'
      //return arduino_beautify(this.map(function(){ return $(this).extract_script();}).get().join(''));
  },
  
  structured_script: function(){
    var positions = ['globals', 'def', 'setup', 'mainloop', 'any','ontweet']; 
      
      instance = this;
      var sections = $.map(positions, function( pos){return instance.map(function(){ return $(this).extract_script_filtered(pos);}).get().join('');});
      var iTemplate = $("#templates").val(); 
      console.log("iTemplate =", iTemplate);
      
      var structured = window.aTemplates.content[iTemplate];  // TODO : Add some choice
      console.log("structured =", structured);
      console.log("aTemplates =", aTemplates);
      console.log('structured',structured);
      
      $.each(sections, function(index, section){
          structured = structured.replace("//"+positions[index]+"//", section);
      });
      return structured;
  },
  
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
        {
            label: 'Setup', 
            trigger: true, 
            containers: 1, 
            slot: false, 
            script: '[[1]]',
            position:'setup',
            help: 'Do Once when the program starts' //does the cutout go in here too? 
        },

        {
            label: 'Main Loop', 
            trigger: true, 
            containers: 1, 
            slot: false, 
            script: '[[1]]',
            position:'mainloop',
            help: 'Will do these blocks repeatedly' //does the cutout go in here too? 
        },
        /*
        {
            label: 'When I receive [string:ack] message', 
            trigger: true, 
            containers: 1, 
            script: 'void {{1}}(){\n[[next]]\n}\nvoid{{1}}_timed(TimerInformation* Sender){{{1}();};',
            help: 'Trigger for blocks to run when message is received',
            position:'def',
            onAdd:'addBroadcast({{1}})',
            onRemove:'removeBroadcast({{1}})'
        },
        {
            label: 'Broadcast [string:ack] message', 
            script: '{{1}}();',
            position:'def',
            help: 'Send a message to all listeners'
        },*/
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
        },
        {
            label: 'wait until [boolean:true]', 
            script: 'while(!{{1}}){\n}\n',
            help: 'repeat until the condition is false'
        },
        
        {
            label: 'forever while [boolean:true]', 
            containers: 1,  
            script: 'while({{1}}){[[1]]}',
            help: 'repeat until the condition is false'
        },
        {
            label: 'once and forever while [boolean:true]', 
            containers: 1,  
            script: 'do{[[1]]} while({{1}});',
            help: 'do once then repeat until the condition is false'
        },
        {
            label: 'repeat [int:10] times', 
            containers: 1, 
            script: 'for (int index##=0; index## <= {{1}}; index##++){[[1]]};',
            help: 'repeat the contained blocks so many times',
            locals: [
                {
                    label: 'loop index##',
                    script: 'index##',
                    type: 'int'
                }
            ]
        }
        
        
    ], false),
   
    sensing: menu('Sensors', [
        
        {
            label: 'When [choice:digitalinputpins] is ON',
            trigger: true,
            slot: false,
            containers: 1,
            script: 'if(digitalRead({{1}}) == HIGH){[[1]]}',
            position:'mainloop',
            help: 'When the button pressed do this'
            //other way would be to use 'position' proprty to add if blocks to a shared function requires a 'pin'=>'name' map in choices to have 
        },
        {
          label: '[choice:digitalinputpins] is [choice:onoffhighlow]', 
            'type': 'boolean', 
            script: '(digitalRead({{1}}) == {{2}})',
            help: 'Is the button Pressed or not'
        },/*
        {
          label: 'Wait for a pulse of [choice:digitalinputpins] being [choice:onoffhighlow] or [int:1000] millisseconds (pulse_length_##_millis)', 
          script: 'long pulse_length_##_millis = pulseIn({{1}}, {{2}}, {{3}});',
            locals: [
                {
                    label: 'pulse_length_##_millis',
                    script: 'pulse_length_##_millis',
                    type: 'int'
                }
            ],
            help: 'Wait for a pulse on a pin and record how long the pulse was'
        },
        */
        /*
        {
          label: 'if [choice:digitalinputpins] pulses [choice:onoffhighlow] in next [int:1000] ms longer than [int:0] ms', 
          script: 'long pulse_ms## = pulseIn({{1}}, {{2}}, {{3}}); if(pulse_ms## > {{4}}){\n[[1]]\n}\n',
          containers: 1,
          locals: [
              {
                  label: 'pulse_ms##',
                  script: 'pulse_ms##',
                  type: 'int'
              }
          ],
          help: 'Wait for a pulse on a pin and record how long the pulse was'
        },
        */
        {
            label: 'value of [choice:analoginputpins]', 
            'type': 'int', 
            script: 'analogRead({{1}})',
            help: 'Value of Input (0-1023)'
        },
        {
            label: 'Set [choice:analoginputpins] to input mode', 
            script: 'pinMode({{1}}, INPUT);',
            help: 'Set pin to input mode - not normally needed'
        }
    ]),
    
    /*
        //Path clear //wall more than 15cm away
        //distance to nearest object
        //something light sensy
        */
    outputs: menu('Outputs', [
        {
            label: 'Set [choice:alloutputpins] to output mode', 
            script: 'pinMode({{1}}, INPUT);',
            help: 'Set the pin to output mode - normally in Setup'
        },
        {
            label: 'Set [choice:digitaloutputpins] to [choice:onoffhighlow]',
            script: 'digitalWrite({{1}}, {{2}});',
            help: 'Switch a Digital Output Pin on or off'
        },
        {
          label: 'Set [choice:analogoutputpins] to [int:255]', 
          	script: 'analogWrite({{1}}, {{2}});',
          	help: 'Set value of PWM pin (0-255)'
        },
        {
            label: 'Dispense  a Sweet',
            script: 'dispense();',
            help: 'Dispense a Sweet'
        },
        {
            label: 'Map [int:0] from Analog in to Analog out',
          	type: 'int',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
          	help: 'Convert numbers 0-1023 to 0-255'
        }
    ]),
    
    timing: menu('Timing', [
        {
            label: 'wait [int:1] secs', 
            script: 'delay(1000*{{1}});',
            help: 'pause before running subsequent blocks'
        },
        {
            label: 'wait [int:100] milli seconds', 
            script: 'delay({{1}});',
            help: 'pause before running subsequent blocks'
        },
        {
            label: 'Milliseconds since program started', 
            'type': 'int', 
            script: '(millis())',
            help: 'int value of time elapsed'
        },
        {
            label: 'Seconds since program started', 
            'type': 'int', 
            script: '(int(millis()/1000))',
            help: 'int value of time elapsed'
        }
        
    ]),
    twitter:menu('Twitter',[
       {
          	label:'Set search Screen Name to [string]',
          	script: "screenName = String('{{1}}');",
          	help: 'Set screenName to [string]'
        },
        
        {
            label: 'Tweet received',
            trigger: true,
            slot: false,
            containers: 1,
            script: '[[1]]',
            position:'ontweet',  
            locals: [
              {
                  label: 'tweet',
                  script: 'tweet',
                  type: 'string'
              }
          ],
        
            help: 'When tweet recieved do this'
            //other way would be to use 'position' proprty to add if blocks to a shared function requires a 'pin'=>'name' map in choices to have 
        }
        
    ]),
    
    strings: menu('Strings', [
       
        {
          label: 'string [string:] Contains [string:]',
            script: '({{1}}.indexOf("{{2}}") > -1 )',
            type: 'boolean',
            help: 'Does the named string contain the second string'
        },
        
        {
          label: '[string:] equals [string:]',
            script: '({{1}}.equal({{2}}) )',
            type: 'boolean',
            help: 'is the named string same as the second string'
        },
        
        {
         label: 'string [string:] character at [number:0]',
            script: '{{1}}.charAt({{2}})',
            type: 'string',
            help: 'get the single character string at the given index of named string'
        },
        {
          label: 'string [string:] length',
            script: '{{1}}.length()',
            type: 'int',
            help: 'get the length of named string'
        },
        {
          label: 'string [string:] indexOf [string:]',
            script: '{{1}}.indexOf({{2}})',
            type: 'number',
            help: 'get the index of the substring within the named string'
        },
       
        {
          label: 'string [string:] Contains [string:]',
            script: '({{1}}.indexOf("{{2}}") > -1 )',
            type: 'boolean',
            help: 'Does the named string contain the second string'
        },
        {
          label: 'string [string:] replace [string:] with [string:]',
            script: '{{1}}.replace("{{2}}", "{{3}}")',
            type: 'string',
            help: 'get a new string by replacing a substring with a new string'
        },
        
        {
          label: 'change string [string:] to upper case',
            script: '{{1}}.toUpperCase()',
            type: 'string',
            help: 'change named string to upper case'
        },
        
        {
          label: 'change string [string:] to lower case',
            script: '{{1}}.toLowerCase()',
            type: 'string',
            help: 'change named string to lower case'
        },
        
        {
          label: 'trim [string:]',
            script: '{{1}}.trim()',
            type: 'string',
            help: 'remove leading and trailing spaces string'
        }
        
        /*{
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
        }*/
    ], false),
    
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
            type: 'number', 
            script: "({{1}} + {{2}})",
            help: 'Add two numbers'
        },
        {
            label: '[number:0] - [number:0]', 
            type: 'number', 
            script: "({{1}} - {{2}})",
            help: 'Subtract two numbers'
        },
        {
            label: '[number:0] * [number:0]', 
            type: 'number', 
            script: "({{1}} * {{2}})",
            help: 'Multiply two numbers'
        },
        {
            label: '[number:0] / [number:0]',
            type: 'number', 
            script: "({{1}} / {{2}})",
            help: 'Divide two numbers'
        },
        {
            label: 'pick random [int:1] to [int:10]', 
            type: 'int', 
            script: "(random({{1}}, {{2}}))",
            help: 'Generate a random number between two other numbers'
        },
        /*{
            label: 'set seed for random numbers to [number:1]', 
            script: "(randomSeed({{1}}))",
            help: ''
        },*/
        {
            label: 'is [number:0] between [number:1] and [number:100]', 
            type: 'boolean', 
            script: "(({{1}} > {{2}}) && ({{1}} < {{3}}))",
            help: 'Check if one number is between the others exclusive'
        },{
            label: 'is [number:0] between [number:1] and [number:100] (inclusive)', 
            type: 'boolean', 
            script: "(({{1}} >= {{2}}) && ({{1}} =< {{3}}))",
            help: 'Check if one number is between the others inclusive'
        },
        {
            label: '[number:0] < [number:0]', 
            type: 'boolean', 
            script: "({{1}} < {{2}})",
            help: 'Check if one number is less than another'
        },
        {
            label: '[number:0] = [number:0]', 
            type: 'boolean', 
            script: "({{1}} == {{2}})",
            help: 'Check if one number is equal to another'
        },
        
        {
            label: '[number:0] > [number:0]', 
            type: 'boolean', 
            script: "({{1}} > {{2}})",
            help: 'Check if one number is greater than another'
        },
        {
          label: '[boolean:false] and [boolean::false]', 
            type: 'boolean', 
            script: "({{1}} && {{2}})",
            help: 'Check if both are true'
        },
        {
          label: '[boolean:false] or [boolean:false]', 
            type: 'boolean', 
            script: "({{1}} || {{2}})",
            help: 'Check if one is true'
        },
        {
          label: 'not [boolean:false]', 
            type: 'boolean', 
            script: "(! {{1}})",
            help: 'Not true is false and Not false is true'
        },
        {
            label: '[number:0] mod [number:0]', 
            type: 'number', 
            script: "({{1}} % {{2}})",
            help: 'Gives the remainder from the division of these two number'
        },
        
        {
            label: 'round [number:0]', 
            type: 'int', 
            script: "(int({{1}}))",
            help: 'Gives the whole number, without the decimal part'
        },
        {
            label: 'absolute of [number:10]', 
            type: 'number', 
            script: "(abs({{1}}))",
            help: 'Gives the positive of the number'
        },
        {
          label: 'Map [int:0] from Analog in to Analog out',
          	type: 'int',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
          	help: ''
        },
        {
          label: 'Map [int:0] from [int:0]-[int:1023] to [int:0]-[int:255] ',
          	type: 'int',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
            help: ''
        }
    ]),
    
    serial: menu('Serial', [
        /*{
          	label: 'Setup serial communication at [choice:baud]', 
          	script: "Serial.begin({{1}});",
            help: 'Eanble serial communications at a chosen speed'
        },*/
        {
          	label: 'Send [any:Message] as a line', 
          	script: "Serial.println({{1}});",
            help: 'Send a message over the serial connection followed by a line return'
        },
        {
          	label: 'Send [any:Message]', 
          	script: "Serial.print({{1}});",
            help: 'Send a message over the serial connection'
        },
        {
          	label: 'Message Value', 
          	type: 'string',
          	script: "Serial.read()",
          	help: 'Read a message from the serial connection'
        },
        {
          	label: 'End serial communication', 
            script: "Serial.end();",
          	help: 'Disable serial communications'
        }
    ])
};

var demos = [
{"title":"Light","description":"","date":1350935772353,"scripts":[{"klass":"control","label":"Main Loop","script":"[[1]]","containers":1,"position":"mainloop","trigger":true,"locals":[],"sockets":[],"contained":[{"klass":"control","label":"if [boolean]","script":"if({{1}}){\n[[1]]\n}else{\n[[2]]\n}","subContainerLabels":["else"],"containers":2,"position":"any","locals":[],"sockets":[{"klass":"sensors","label":"[choice:digitalinputpins] is ON","script":"(digitalRead({{1}}) == HIGH)","containers":0,"position":"any","type":"boolean","locals":[],"sockets":["push_button_pin"],"contained":[],"next":""}],"contained":[{"klass":"outputs","label":"Set [choice:digitaloutputpins] to [choice:onoffhighlow]","script":"digitalWrite({{1}}, {{2}});","containers":0,"position":"any","locals":[],"sockets":["LED_Green_pin","HIGH"],"contained":[],"next":""},{"klass":"outputs","label":"Set [choice:digitaloutputpins] to [choice:onoffhighlow]","script":"digitalWrite({{1}}, {{2}});","containers":0,"position":"any","locals":[],"sockets":["LED_Green_pin","LOW"],"contained":[],"next":""}],"next":""}],"next":""}]}
];
populate_demos_dialog(demos);

})();
