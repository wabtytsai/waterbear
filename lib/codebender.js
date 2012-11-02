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

function getBaudrate()
{
  var baudrate;
  //if($("select[id='boards'] option:selected").html() == "Arduino Uno")
  //{
    baudrate = "115200";
  //}
  //else if($("select[id='boards'] option:selected").html() == "Arduino Duemilanove")
  //{
  //	baudrate = "57600";
  //}
  return baudrate;
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

  console.clear();
  console.trace();

  console.log("compileResult =", compileResult);

  var binary = compileResult.output;
  compileResult.size = binary.length + 1; //this is wrong but is quick
  console.log("compileResult.size =", compileResult.size);

  console.log("plugin =", plugin);


  if($("#ports").val() !== null && $("#ports").val() !== "")
  {
    var baudrate = getBaudrate();
    console.log("baudrate =", baudrate);
    var max_size = getMaxSize();
    console.log("max_size =", max_size);


    if(compileResult.size > max_size)
    {
      clearProgress("There is not enough space!");
      $('#connect').addClass('hidden');
      return;
    }

    clearProgress('Uploading to Arduino');
    //var progress = applet.flash(portslist.selectedIndex, hex, baudrate);//+'\0');
    var portname = window.portslist.options[portslist.selectedIndex].text;
    var iBoard = 0; //UNO only at the mo
    var progress = plugin.flash(portname, binary, window.boardz[iBoard]["upload"]["maximum_size"], window.boardz[iBoard]["upload"]["protocol"], window.boardz[iBoard]["upload"]["speed"], window.boardz[iBoard]["build"]["mcu"]);


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
  window.rateslist= $("#baudrates")[0];
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

