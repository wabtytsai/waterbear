//
//	Extensions to the jQuery results API to support waterbear
//
//  These methods are deprecated and being phased out in favour of operating on Block objects directly.
//
$.extend($.fn, {
    block_type: function() {
        return this.data('model').blockType;
    },
    
    extract_script: function() {
      return this.data('model').code();
    },
    
    /* NOTE : Concatenation code allows multiple instances of a block which
    generates code that can only exist once i.e. setup(){[[1]]} to be joined
    together so it works */
    
    /** Get code from blocks which in a format so they can be concatenated
     * if needed.
		 * @use: see the arduino plugin for a use case
		 */
    getCodeToConcatenate: function(){
      var currblock = this.data('model');
      var concatenate = ($.type(currblock.concatenate) === 'boolean')?currblock.concatenate:false;
      var codeData = {'script' : currblock.code(),
      'concatenate' : concatenate
      };
      if (concatenate)
      {
        codeData.sub = currblock.subcode();
        codeData.signature = currblock.signature;
      }
      return codeData;
    },
    
    /** Get code from blocks concatenating blocks where needed
     * this is a straight replacement for getScript.
		 * @use: see the arduino plugin for a use case
		 */
    getConcatenatedScript: function(){
        var code = this.map(function(){
            return $(this).getCodeToConcatenate();
        }).get();
        
        var script = '';
        for (var i=0; i < code.length ; i++)
        {
          if ($.type(code[i].extracted) !== 'boolean' || code[i].extracted === false)
          {
            if(code[i].concatenate)
            {
              code[i].values = {};
              code[i].subcodes = {};
              for (var j=i; j < code.length ; j++)
              {
                if(code[i].signature === code[j].signature)
                {
                  code[j].sub.values.forEach(function(idxvalue){
                    var idx = idxvalue[0];
                    var value = idxvalue[1];
                  
                    if ($.type(code[i].values[idx]) === 'undefined')
                    {
                      code[i].values[idx] = [];
                    }
                    code[i].values[idx][code[i].values[idx].length] = value;
                  });
                  
                  code[j].sub.subcode.forEach(function(idxsubcode){
                    idx = idxsubcode[0];
                    var subcode = idxsubcode[1];
                  
                    if ($.type(code[i].subcodes[idx]) === 'undefined')
                    {
                      code[i].subcodes[idx] = [];
                    }
                    code[i].subcodes[idx][code[i].subcodes[idx].length] = subcode;
                  });
                  code[j].extracted = true;
                }
              }
              
              var replace_values = function(match, offset, s){
                var idx = parseInt(match.slice(2, -2), 10) - 1;
                if (match[0] === '{'){
                  return code[i].values[idx].join("\n");
                }else{
                  return code[i].subcodes[idx].join("\n");
                }
              };
              
              var newscript = code[i].sub.code;
              
              newscript = newscript.replace(/\{\{\d\}\}/g, replace_values);
              newscript = newscript.replace(/\[\[\d\]\]/g, replace_values);
              script = script + newscript + '\n';
              
            }
            else
            {
              script = script + code[i].script + '\n';
              code[i].extracted = true;
            }
          }
        }
        
        console.log("getConcatenatedScript return =", script);
        return script;
    },
    
    /** Get the include array from a block and its contained.
		 * @use: see the arduino plugin for a use case
		 */
    getBlockIncludes: function(){
      var includes = [];
      if ($.type(this.data('model')) === 'undefined')
      {
        return includes;
      }
      if ($.type(this.data('model').includes) === 'array')
      {
        includes = includes.concat(this.data('model').includes);
      }
      /* TODO : May need to try interleaving the includes rather than just concating them 
      to cope with file depencies but i'm not sure */
      var childincludes = this.data('model').contained.forEach(function(ele){ includes.concat($(ele).getIncludes());});
      return includes;
    },
    
    /** Get include array
		 * @use: see the arduino plugin for a use case
		 */
    getIncludes: function(){
        var includes = this.map(function(){
            return $(this).getBlockIncludes();
        }).get();
        
        includes = includes.unique();
        return includes;
    },
    
    
    /** Get include code
		 * @use: see the arduino plugin for a use case
		 */
    getIncludeCode:function(){
      var code = this.getIncludes().map(function(file){return ''+file+'\n';}).join('\n');
      return code;
    },
    
    /** Get the script in the standard way (no concatenation or includes 
		 * @use: see the javascript plugin for a use case
		 */
    getScript: function(){
      return this.map(function(){
          return $(this).extract_script();
      }).get().join('');
    },
    
    /** Used to do syntax highlightng this is just the base passthru version 
		 * @use: see the javascript plugin for a use case
		 */
    prettyScript: function(){
      return this.getScript();
      //return $(this).getConcatenatedScript(); //the one that does contatiantion and includes
    },
    
    writeScript: function(view){
      view.html('<pre class="language">' + this.prettyScript() + '</pre>');
      //hljs.highlightBlock(view.children()[0]);
    }
});
