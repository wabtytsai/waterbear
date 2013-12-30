//gogo global variable
  var level=0;;

function tabs() {
  var s='';
  for (var j=0; j<level; j++) s+='\t';
  return s;
}

function neatenCStyle(code) {

  var i=0;
  
  function neatenAsync() {
    var iStart=i;
    for (; i<code.length && i<code.length; i++) {
        c=code.charAt(i);

      if (incomment) {
        if ('//'==incomment && '\n'==c) {
          incomment=false;
        } else if ('/*'==incomment && '*/'==code.substr(i, 2)) {
          incomment=false;
          c='*/\n';
          i++;
        }
        if (!incomment) {
          while (code.charAt(++i).match(/\s/)) ;; i--;
          c+=tabs();
        }
        out+=c;
      } else if (instring) {
        if (instring==c && // this string closes at the next matching quote
          // unless it was escaped, or the escape is escaped
          ('\\'!=code.charAt(i-1) || '\\'==code.charAt(i-2))
        ) {
          instring=false;
        }
        out+=c;
      } else if (infor && '('==c) {
        infor++;
        out+=c;
      } else if (infor && ')'==c) {
        infor--;
        out+=c;
      } else if ('else'==code.substr(i, 4)) {
        out=out.replace(/\s*$/, '')+' e';
      } else if (code.substr(i).match(/^for\s*\(/)) {
        infor=1;
        out+='for (';
        while ('('!=code.charAt(++i)) ;;
      } else if ('//'==code.substr(i, 2)) {
        incomment='//';
        out+='//';
        i++;
      } else if ('/*'==code.substr(i, 2)) {
        incomment='/*';
        out+='\n'+tabs()+'/*';
        i++;
      } else if ('"'==c || "'"==c) {
        if (instring && c==instring) {
          instring=false;
        } else {
          instring=c;
        }
        out+=c;
      } else if ('{'==c) {
        level++;
        out=out.replace(/\s*$/, '')+' {\n'+tabs();
        while (code.charAt(++i).match(/\s/)) ;; i--;
      } else if ('}'==c) {
        out=out.replace(/\s*$/, '');
        level--;
        out+='\n'+tabs()+'}\n'+tabs();
        while (code.charAt(++i).match(/\s/)) ;; i--;
      } else if (';'==c && !infor) {
        out+=';\n'+tabs();
        while (code.charAt(++i).match(/\s/)) ;; i--;
      } else if ('\n'==c) {
        out+='\n'+tabs();
      } else {
        out+=c;
      }
    }

    
    level=li;
    out=out.replace(/[\s\n]*$/, '');
    out=out.replace(/\n\s*\n/g, '\n');  //blank lines
    out=out.replace(/^[\s\n]*/, ''); //leading space
    out=out.replace(/[\s\n]*$/, ''); //trailing space

    return out;
  
  }

  code=code.replace(/^[\s\n]*/, ''); //leading space
  code=code.replace(/[\s\n]*$/, ''); //trailing space
  code=code.replace(/[\n\r]+/g, '\n'); //collapse newlines

  var out=tabs(), li=level, c='';
  var infor=false, forcount=0, instring=false, incomment=false;
  return neatenAsync();
}

