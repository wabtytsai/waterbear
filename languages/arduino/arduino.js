






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
    window.files = [wb.prettyScript(blocks)];
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
    return neatenCStyle(elements.map(function(elem){
        return wb.codeFromBlock(elem);
    }).join(''));
  
    return elements.map(function(elem){
      return wb.codeFromBlock(elem);
    }).join("");
};

wb.writeScript = function(elements, view){
    view.innerHTML = '<pre class="language-arduino">' + wb.prettyScript(elements) + '</pre>';
    //hljs.highlightBlock(view.firstChild);
};


/* Add Demo type and toolkists list */
wb.choiceLists = {
    "boolean": ['true', 'false'],
    logic: ['true', 'false'],

    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    //onoffhighlow: {'HIGH':'ON', 'LOW':'OFF'},
    //onoffbool: {'true':'ON', 'false':'OFF'},

    blocktypes: ['step', 'expression', 'context', 'eventhandler'],
    types: ['string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'],
    rettypes: ['none', 'string', 'number', 'boolean', 'int', 'array', 'object', 'function', 'any'] 
};


