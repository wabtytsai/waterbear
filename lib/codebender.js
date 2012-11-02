
function warnModal(filename){
	 //alert(filename);
	 $('#loadLink').attr('onclick','getExample("'+filename+'")');
	 $('#warningModal').modal('show');	
}

function throwMud()
{
	dirty=true;
	$("#compile_text").html(" Save & Build");
	$("#revert").removeClass("disabled").off('click').click(function()
	{
	    revert();
	});
	$("#save").removeClass("disabled").off('click').click(function()
	{
		save();
	});
	
	disableLink($(".download_link"));
	$("#netload").addClass("disabled").off('click');
	$("#uploadusb").addClass("disabled").off('click');
}

function cleanUp()
{
	dirty= false;
	$("#compile_text").html(" Build");
	enableLink($(".link_ino"));
	disableLink($(".link_hex"));
	$("#revert").addClass("disabled").off('click');
	$("#save").addClass("disabled").off('click');
}

function motherInLaw()
{
	if(dirty)
	{
		save_and_build();
	}
	else
	{
		build();
	}	
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

function save()
{
	setProgress(90);
	$.post("{{ path('AceFileBundle_saveCode') }}", {data: editor.getSession().getValue(), project_name:"{{project_name}}"}, function(data)
	{
		$("#save").addClass("btn-success");
		$("#save_icon").addClass("icon-white");
		clearProgress("Saved successfuly.");
		cleanUp();
		window.setTimeout(function () {
		    $("#save").removeClass("btn-success");
			$("#save_icon").removeClass("icon-white");
		}, 500);
		// alert("Data received: " + data);
	});	
}

function revert()
{
	setProgress(90);
	$.get("{{ path('AceFileBundle_getMyEscapedCode',{'project_name':project_name}) }}", function(data)
	{
		editor.getSession().setValue(data);
		$("#revert").addClass("btn-success");
		$("#revert_icon").addClass("icon-white");
		clearProgress("Reverted successfuly.");
		cleanUp();
		window.setTimeout(function () {
		    $("#revert").removeClass("btn-success");
			$("#revert_icon").removeClass("icon-white");
		}, 500);
		// alert("Data received: " + data);
	});	
}

function build()
{
	setProgress(90);
	$.post("{{ path('AceEditorBundle_compile') }}", { project_name:"{{project_name}}"}, function(data)
	{
		var obj = jQuery.parseJSON(data);
		if(obj.success === 0)
		{
			$("#compile_output").css('color', 'black');
			for (var i=0; i<obj.lines.length; i++)
			{
				$(".ace_gutter-cell").filter(function(index) {
				  return $(this).html() == obj.lines[i];
				}).css("text-decoration","underline").css("color","red");
			}
			 
			$("#editor").css("bottom","150px");
			$("#compile_output").css("bottom","0px");
			$("#compile_output").css("padding-top","10px");
			$("#compile_output").css("height","120px");
			$("#compile_output").addClass("well");
			$("#compile").addClass("btn-warning");
			$("#compile_icon").addClass("icon-remove");
			
			
			$("#compile_output").html(obj.text);
			clearProgress("Compilation failed.");
		}
		else
		{
			$("#compile_output").css('color', '');
			$(".ace_gutter-cell").css("text-decoration", "").css("color","");
			$("#editor").css("bottom","");
			$("#compile_output").css("bottom","");
			$("#compile_output").css("height","");
			$("#compile_output").css("padding-top","");
			$("#compile_output").removeClass("well");
			$("#compile").addClass("btn-success");
			$("#compile_icon").addClass("icon-ok");

			var progressText = "<p>" + obj.text + "<br /> Code Size: " + obj.size + " bytes<br /><small>(out of <strong>"+ getMaxSize()+"</strong> available.)</small></p>";
			clearProgress(progressText);
			window.sketch_size = obj.size;
			$("#compile_output").html("");
			enableLink($(".link_hex"));
			$("#netload").removeClass("disabled").click(function()
			{
				netload();
			});
			$("#uploadusb").removeClass("disabled").click(function()
			{
				uploadusb();
			});
			
		}
		$("#compile_icon").removeClass("icon-check").addClass("icon-white");

		window.setTimeout(function () {
		    $("#compile").removeClass("btn-success").removeClass("btn-warning");
				$("#compile_icon").removeClass("icon-white").removeClass("icon-remove").removeClass("icon-ok").addClass("icon-check");
		}, 500);
		// alert("Data received: " + data);
	});	
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
  $('.stage').html(msg);
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


function save_and_build()
{
	save();
	$(document).ajaxStop(function()
	{
		build();
		$(this).unbind('ajaxStop');
	});
	// build();
}

function disableLink(link)
{
	link.css("text-decoration","line-through").click(function(e)
	{
	    e.preventDefault();
	});
}
function enableLink(link)
{
	link.css("text-decoration","").off('click');
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
  
console.log("getFire plugin =", plugin);
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

function enableNET(){
			$("#net-info").toggle("blind", {}, 1000);
			$("#net-tools").toggle("blind", {}, 1000);
}

function cleanupIPhelp(){
	if ($("#ip").val()=="Address (IP or Domain)"){
		$("#ip").val("");
		$("#netload-ip").text("");
		$("#cloudload-ip").text("");
	}else{
		if ($("#ip").val()===""){
			$("#ip").val("Address (IP or Domain)");
			$("#netload-ip").text("");
			$("#cloudload-ip").text("");
		}
		else{
			$("#netload-ip").text($("#ip").val());
			$("#cloudload-ip").text($("#ip").val());
		}
		$("#ip").val();
	}	
}

function isMobile(){

     return navigator.userAgent.match(/Android/i) ? true : false 
     || navigator.userAgent.match(/BlackBerry/i) ? true : false
     || navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false
     ||navigator.userAgent.match(/IEMobile/i) ? true : false;
}

