var BrowserDetect = {
init: function ()
{
this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
this.version = this.searchVersion(navigator.userAgent)
|| this.searchVersion(navigator.appVersion)
|| "an unknown version";
this.OS = this.searchString(this.dataOS) || "an unknown OS";
},
searchString: function (data)
{
for (var i = 0; i < data.length; i++)
{
var dataString = data[i].string;
var dataProp = data[i].prop;
this.versionSearchString = data[i].versionSearch || data[i].identity;
if (dataString)
{
if (dataString.indexOf(data[i].subString) != -1)
return data[i].identity;
}
else if (dataProp)
return data[i].identity;
}
},
searchVersion: function (dataString)
{
var index = dataString.indexOf(this.versionSearchString);
if (index == -1) return;
return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
},
dataBrowser: [
{
string: navigator.userAgent,
subString: "Chrome",
identity: "Chrome"
},
{ string: navigator.userAgent,
subString: "OmniWeb",
versionSearch: "OmniWeb/",
identity: "OmniWeb"
},
{
string: navigator.vendor,
subString: "Apple",
identity: "Safari",
versionSearch: "Version"
},
{
prop: window.opera,
identity: "Opera",
versionSearch: "Version"
},
{
string: navigator.vendor,
subString: "iCab",
identity: "iCab"
},
{
string: navigator.vendor,
subString: "KDE",
identity: "Konqueror"
},
{
string: navigator.userAgent,
subString: "Firefox",
identity: "Firefox"
},
{
string: navigator.vendor,
subString: "Camino",
identity: "Camino"
},
{ // for newer Netscapes (6+)
string: navigator.userAgent,
subString: "Netscape",
identity: "Netscape"
},
{
string: navigator.userAgent,
subString: "MSIE",
identity: "Explorer",
versionSearch: "MSIE"
},
{
string: navigator.userAgent,
subString: "Gecko",
identity: "Mozilla",
versionSearch: "rv"
},
{ // for older Netscapes (4-)
string: navigator.userAgent,
subString: "Mozilla",
identity: "Netscape",
versionSearch: "Mozilla"
}
],
dataOS: [
{
string: navigator.platform,
subString: "Win",
identity: "Windows"
},
{
string: navigator.platform,
subString: "Mac",
identity: "Mac"
},
{
string: navigator.userAgent,
subString: "iPhone",
identity: "iPhone/iPod"
},
{
string: navigator.platform,
subString: "Linux",
identity: "Linux"
}
]
};
BrowserDetect.init();




// Add some utilities
wb.wrap = function(script){
    return [
        'var global = new Global();',
        script,
        ''
    ].join('\n');
};


function runCurrentScripts(event){
    var blocks = wb.findAll(document.body, '.workspace .scripts_workspace');
    //document.body.className = 'result';
    window.files = [wb.prettyScript(blocks)]
    usbflash();
}

Event.on('.runScripts', 'click', null, runCurrentScripts);

window.addEventListener('fghjkload', function(event){
    console.log('iframe ready');
    wb.iframeready = true;
    if (wb.iframewaiting){
        wb.iframewaiting();
    }
    wb.iframewaiting = null;
}, false);

wb.runScript = function(script){
    var run = function(){
        wb.script = script;
        var path = location.pathname.slice(0,location.pathname.lastIndexOf('/'));
        var runtimeUrl = location.protocol + '//' + location.host + path + '/dist/arduino_runtime.js';
        // console.log('trying to load library %s', runtimeUrl);
        document.querySelector('.stageframe').contentWindow.postMessage(JSON.stringify({command: 'loadlibrary', library: runtimeUrl, script: wb.wrap(script)}), '*');
        document.querySelector('.stageframe').focus();
    };
    if (wb.iframeready){
        run();
    }else{
        wb.iframewaiting = run;
    }
};


wb.prettyScript = function(elements){
    //return js_beautify(
      return elements.map(function(elem){
        return wb.codeFromBlock(elem);
    }).join('');
    //);
};

wb.writeScript = function(elements, view){
    view.innerHTML = '<pre class="language-arduino">' + wb.prettyScript(elements) + '</pre>';
    //hljs.highlightBlock(view.firstChild);
};


/* Add Demo type and toolkists list */
wb.choiceLists = {
    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    //onoffhighlow: {'HIGH':'ON', 'LOW':'OFF'},
    //onoffbool: {'true':'ON', 'false':'OFF'},
    "boolean": ['true', 'false'],
    logic: ['true', 'false'],
    //digitalinputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    //'push_button_pin':'Push Button','external_button1_pin':'External Button 1','external_button2_pin':'External Button 2',0:
    //analoginputpins: {'A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    //'vari_cap_pin':'Potentiometer',
    //digitaloutputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    //'LED_Green_pin':'Front LED','LED_2_pin':'LED 2',
    //analogoutputpins: {3:'Pin 3', 5:'Pin 5', 6:'Pin 6', 9:'Pin 9', 10:'Pin 10', 11:'Pin 11'},
    //'servo_pin':'Servo', 
    //alloutputpins:{0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    //'servo_pin':'Servo','LED_Green_pin':'Front LED','LED_2_pin':'LED 2',baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200],
    analogrefs:['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL'],
    blocktypes: ['step', 'expression', 'context', 'eventhandler'],
    types: ['string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'],
    rettypes: ['none', 'string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'] 
};


//wb.choiceLists.types.push('arduino');
//wb.choiceLists.rettypes.push('demo');
/*
// with the object notation
wb.choiceLists.highlow = ['HIGH', 'LOW'];
wb.choiceLists.inoutput = ['INPUT', 'OUTPUT'];
wb.choiceLists.onoff = ['ON', 'OFF'];
//wb.choiceLists.onoffhighlow = {'HIGH':'ON', 'LOW':'OFF'};
//wb.choiceLists.onoffbool = {'true':'ON', 'false':'OFF'};
wb.choiceLists.logic = ['true', 'false'];
//wb.choiceLists.digitalinputpins = {0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'};
//'push_button_pin':'Push Button','external_button1_pin':'External Button 1','external_button2_pin':'External Button 2',0:
//wb.choiceLists.analoginputpins = {'A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'};
//'vari_cap_pin':'Potentiometer',
//wb.choiceLists.digitaloutputpins = {0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'};
//'LED_Green_pin':'Front LED','LED_2_pin':'LED 2',
//wb.choiceLists.analogoutputpins =  {3:'Pin 3', 5:'Pin 5', 6:'Pin 6', 9:'Pin 9', 10:'Pin 10', 11:'Pin 11'};
//'servo_pin':'Servo', 
//wb.choiceLists.alloutputpins = {0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'};
//'servo_pin':'Servo','LED_Green_pin':'Front LED','LED_2_pin':'LED 2',baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200];
wb.choiceLists.analogrefs = ['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL'];
*/


