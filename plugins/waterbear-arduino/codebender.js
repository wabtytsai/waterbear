window.boardz = [{"name":"Arduino Uno","upload":{"protocol":"arduino","maximum_size":"32256","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xde","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Uno is the reference model for the Arduino platform. It has 14 digital input\/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button. It does not use the FTDI USB-to-serial driver chip. Instead, it features the Atmega16U2 (Atmega8U2 up to version R2) programmed as a USB-to-serial converter."},{"name":"Arduino Duemilanove w\/ ATmega328","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"Around March 1st, 2009, the Duemilanove started to ship with the ATmega328p instead of the ATmega168. The ATmega328 has 32 KB, (also with 2 KB used for the bootloader)."},{"name":"Arduino Diecimila or Duemilanove w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_diecimila.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Duemilanove automatically selects the appropriate power supply (USB or external power), eliminating the need for the power selection jumper found on previous boards. It also adds an easiest to cut trace for disabling the auto-reset, along with a solder jumper for re-enabling it."},{"name":"Arduino Nano w\/ ATmega328","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"The Arduino Nano is an all-in-one, compact design for use in breadboards. Version 3.0 has an ATmega328."},{"name":"Arduino Nano w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_diecimila.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"Older Arduino Nano with ATmega168 instead of the newer ATmega328."},{"name":"Arduino Mega 2560 or Mega ADK","upload":{"protocol":"stk500v2","maximum_size":"258048","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0xfd","path":"stk500v2","file":"stk500boot_v2_mega2560.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega2560","f_cpu":"16000000L","core":"arduino","variant":"mega"},"description":"The Mega 2560 is an update to the Arduino Mega, which it replaces. It features the Atmega2560, which has twice the memory, and uses the ATMega 8U2 for USB-to-serial communication."},{"name":"Arduino Mega (ATmega1280)","upload":{"protocol":"arduino","maximum_size":"126976","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0xf5","path":"atmega","file":"ATmegaBOOT_168_atmega1280.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega1280","f_cpu":"16000000L","core":"arduino","variant":"mega"},"description":"A larger, more powerful Arduino board. Has extra digital pins, PWM pins, analog inputs, serial ports, etc. The original Arduino Mega has an ATmega1280 and an FTDI USB-to-serial chip."},{"name":"Arduino Leonardo","upload":{"protocol":"avr109","maximum_size":"28672","speed":"57600","disable_flushing":"true"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0xcb","path":"caterina","file":"Caterina-Leonardo.hex","unlock_bits":"0x3F","lock_bits":"0x2F"},"build":{"vid":"0x2341","pid":"0x8036","mcu":"atmega32u4","f_cpu":"16000000L","core":"arduino","variant":"leonardo"},"description":"The Leonardo differs from all preceding boards in that the ATmega32u4 has built-in USB communication, eliminating the need for a secondary processor. This allows the Leonardo to appear to a connected computer as a mouse and keyboard, in addition to a virtual (CDC) serial \/ COM port."},{"name":"Arduino Mini w\/ ATmega328","upload":{"protocol":"stk500","maximum_size":"28672","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xd8","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328-Mini.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"The Mini is a compact Arduino board, intended for use on breadboards and when space is at a premium. This version has an ATmega328."},{"name":"Arduino Mini w\/ ATmega168","upload":{"protocol":"arduino","maximum_size":"14336","speed":"19200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xdd","extended_fuses":"0x00","path":"atmega","file":"ATmegaBOOT_168_ng.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega168","f_cpu":"16000000L","core":"arduino","variant":"eightanaloginputs"},"description":"Older Arduino Mini version with the ATmega168 microcontroller."},{"name":"Arduino Ethernet","upload":{"protocol":"arduino","maximum_size":"32256","speed":"115200"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xde","extended_fuses":"0x05","path":"optiboot","file":"optiboot_atmega328.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"16000000L","core":"arduino","variant":"standard"},"description":"The Ethernet differs from other boards in that it does not have an onboard USB-to-serial driver chip, but has a Wiznet Ethernet interface. This is the same interface found on the Ethernet shield."},{"name":"Arduino Fio","upload":{"protocol":"arduino","maximum_size":"30720","speed":"57600"},"bootloader":{"low_fuses":"0xff","high_fuses":"0xda","extended_fuses":"0x05","path":"atmega","file":"ATmegaBOOT_168_atmega328_pro_8MHz.hex","unlock_bits":"0x3F","lock_bits":"0x0F"},"build":{"mcu":"atmega328p","f_cpu":"8000000L","core":"arduino","variant":"eightanaloginputs"},"description":"An Arduino intended for use as a wireless node. Has a header for an XBee radio, a connector for a LiPo battery, and a battery charging circuit."}];


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
}

function getMaxSize()
{
  var max_size;
  //if($("select[id='boards'] option:selected").html() == "Arduino Uno")
  //{
  var iBoard = $("#boards").val();
  max_size = window.boardz[iBoard].upload.maximum_size;
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
    var progress = plugin.flash(portname, binary, window.boardz[iBoard].upload.maximum_size, window.boardz[iBoard].upload.protocol, window.boardz[iBoard].upload.speed, window.boardz[iBoard].build.mcu);

    console.log("progress =", progress);
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

