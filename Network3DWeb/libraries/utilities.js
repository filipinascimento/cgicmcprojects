'use strict';
// Copyright Patrick Horgan patrick at dbp-consulting dot com
// Permission to use granted as long as you keep this notice intact
// use strict is everywhere because some browsers still don't support
// using it once for the whole file and need per method/function
// use.
// Parts are derivitive of work by Jeff Walden, Michael Kuhn
// and Gavin Kistner as noted below as appropriate.

function colorObject(color)
{ var colorNames=[
      ['aqua','rgb(0,255,255)'],
      ['black','rgb(0,0,0)'],
      ['blue','rgb(0,0,255)'],
      ['fuchsia','rgb(255,0,255)'],
      ['gray','rgb(128,128,128)'],
      ['green','rgb(0,128,0)'],
      ['lime','rgb(0,255,0)'],
      ['maroon','rgb(128,0,0)'],
      ['navy','rgb(0,0,128)'],
      ['olive','rgb(128,128,0)'],
      ['purple','rgb(128,0,128)'],
      ['red','rgb(255,0,0)'],
      ['silver','rgb(192,192,192)'],
      ['teal','rgb(0,128,128)'],
      ['white','rgb(255,255,255)'],
      ['yellow','rgb(255,255,0)']
  ];
  this.colors=[0,0,0];
  this.alpha=1.0;

  var hueToRGB=function(m1,m2,h)
  {
      h=h<0?h+1:h>1?h-1:h;

      if(h*6<1){
	  return (m1+(m2-m1)*h*6)*255;
      }else if(h*2<1){
	  return m2*255;
      }else if(h*3<2){
	  return (m1+(m2-m1)*(2/3-h)*6)*255;
      }else{
	  return m1*255;
      }
  }

  var parseColor=function(acolor)
  {
    var color;

    if(/\d*%/.test(acolor)){
      color=Math.round(255*parseInt(acolor.substr(0,acolor.length-1))/100);
    }else{
      color=parseInt(acolor);
    }
    return color<0?0:color>255?255:color;
  }

  if(typeof(color)==='undefined'){
      this.colors[0]=0;
      this.colors[1]=0;
      this.colors[2]=0;
  } else if(color.substr(0,1)==='#'){
    if(color.length==4){
      // like #fc3 which should be same as #ffcc33
      var aclr;
      aclr=parseInt(color.substr(1,1),16);
      this.colors[0]=aclr*16+aclr;
      aclr=parseInt(color.substr(2,1),16);
      this.colors[1]=aclr*16+aclr;
      aclr=parseInt(color.substr(3,1),16);
      this.colors[2]=aclr*16+aclr;
    }else{
      // expect something like #ff0387
      this.colors[0]=parseInt(color.substr(1,2),16);
      this.colors[1]=parseInt(color.substr(3,2),16);
      this.colors[2]=parseInt(color.substr(5,2),16);
    }
  }else if(color.substr(0,4)==='rgba'){
    var digits = /rgba\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*([+-]?\d*.?\d*)\s*\)/.exec(color);
    if(digits===null){
	return;
    }
    this.colors[0]=parseColor(digits[1]);
    this.colors[1]=parseColor(digits[2]);
    this.colors[2]=parseColor(digits[3]);
    this.alpha=parseFloat(digits[4]);
    this.alpha=this.alpha<0?0:this.alpha>1?1.0:this.alpha;
  }else if(color.substr(0,3)==='rgb'){
    var digits = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\s*\)/.exec(color);
    if(digits===null){
	return;
    }
    this.colors[0]=parseColor(digits[1]);
    this.colors[1]=parseColor(digits[2]);
    this.colors[2]=parseColor(digits[3]);
  }else if(color.substr(0,4)==='hsla'){
    var digits = /hsla\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\s*,\s*(\d*.?\d+)\)/.exec(color);
    if(digits===null){
	return;
    }
    var hue=(((digits[1]%360)+360)%360)/360; // normalize 0-1
    var saturation=digits[2]/100;
    var m1,m2;
    saturation=saturation<0?0:saturation>1?1:saturation;
    var lightness=digits[3]/100;
    lightness=lightness<0?0:lightness>1?1:lightness;
    if(lightness<.5){
	m2=lightness*(saturation+1);
    }else{
	m2=lightness+saturation-lightness*saturation;
    }
    m1=lightness*2-m2;
    this.colors[0]=hueToRGB(m1,m2,hue+1/3);
    this.colors[1]=hueToRGB(m1,m2,hue);
    this.colors[2]=hueToRGB(m1,m2,hue-1/3);
    this.alpha=digits[4]<0?0:digits[4]>1?1:digits[4];
  }else if(color.substr(0,3)==='hsl'){
    var digits = /hsl\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\s*\)/.exec(color);
    if(digits===null){
	return;
    }
    var hue=(((digits[1]%360)+360)%360)/360; // normalize 0-1
    var saturation=digits[2]/100;
    var m1,m2;
    saturation=saturation<0?0:saturation>1?1:saturation;
    var lightness=digits[3]/100;
    lightness=lightness<0?0:lightness>1?1:lightness;
    if(lightness<.5){
	m2=lightness*(saturation+1);
    }else{
	m2=lightness+saturation-lightness*saturation;
    }
    m1=lightness*2-m2;
    this.colors[0]=hueToRGB(m1,m2,hue+1/3);
    this.colors[1]=hueToRGB(m1,m2,hue);
    this.colors[2]=hueToRGB(m1,m2,hue-1/3);
  }else{
    for(var ctr=0;ctr<colorNames.length;ctr++){
      if(color==colorNames[ctr][0]){
	var digits = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\s*\)/.exec(colorNames[ctr][1]);
	this.colors[0]=parseColor(digits[1]);
	this.colors[1]=parseColor(digits[2]);
	this.colors[2]=parseColor(digits[3]);
	break;
      }
    }
  }
  this.red=function(){ return this.colors[0]; };
  this.green=function(){ return this.colors[1]; };
  this.blue=function(){ return this.colors[2]; };

  this.tohexStr=function()
  {
    return '#'+ this.colors[0].toString(16)+this.colors[1].toString(16)+this.colors[2].toString(16);
  };
  this.torgbStr=function()
  {
    return 'rgba('+this.colors[0]+','+this.colors[1]+','+this.colors[2]+','+this.alpha+')';
  }
  this.tohslStr=function()
  {
    var r=this.colors[0]/255;
    var g=this.colors[1]/255;
    var b=this.colors[2]/255;
    var max=Math.max(r,g,b),min=Math.min(r,g,b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return "hsla("
	+Math.floor(h*360)+","
	+Math.floor(s*100)+","
	+Math.floor(l*100)+","
	+this.alpha+")";
  }

  this.toString=function(){ return this.torgbStr(); };
  this.mult=function(val)
  {
    val=val<0?0:val;
    return 'rgba('+Math.min(255,Math.round(this.colors[0]*val))+','
	+Math.min(255,Math.round(this.colors[1]*val))+','
	+Math.min(255,Math.round(this.colors[2]*val))+','+this.alpha+')';
  }
  this.gettransp=function(val)
  {
    val=val<0?0:val>1?1:val;
    return 'rgba('+this.colors[0]+','+this.colors[1]+','+this.colors[2]
	+','+val+')';
  }
}

function isNumber(n)
{
    // like to ascribe this to someone, but see it all over the net.
    'use strict';
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// getCookies - returns a hash of cookies
function getCookies()
{
    var rawcookies=document.cookie.split(";");
    var cookies=new Array;
    for(var cookie in rawcookies){
	var cookiepair=cookie.split("=");
	cookies[cookiepair[0]]=cookiepair[1];
    }
    return cookies;
}
// Array Remove - By Jeff Walden
Array.prototype.remove = function(from, to)
{
    // Array Remove - By Jeff Walden
    'use strict';
    this.splice(from,
      !to ||
      1 + to - from + (!(to < 0 ^ from >= 0) && (to < 0 || -1) * this.length));
    return this.length;
};

function hookEvent(element, eventName, callback)
{
    // from Michael Kuehl as used in an article:
    // http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
    'use strict';
    if(typeof(element) == "string"){
	element = document.getElementById(element);
    }
    if(element == null){
	return;
    }
    if(element.addEventListener) {
	if(eventName == 'mousewheel'){
	    element.addEventListener('DOMMouseScroll', callback, false);  
	}
	element.addEventListener(eventName, callback, false);
    } else if(element.attachEvent){
	element.attachEvent("on" + eventName, callback);
    }
}

function unhookEvent(element, eventName, callback)
{
    // from Michael Kuehl as used in an article:
    // http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
    'use strict';
    if(typeof(element) == "string"){
	element = document.getElementById(element);
    }
    if(element == null){
	return;
    }
    if(element.removeEventListener) {
	if(eventName == 'mousewheel'){
	    element.removeEventListener('DOMMouseScroll', callback, false);  
	}
	element.removeEventListener(eventName, callback, false);
    } else if(element.detachEvent){
	element.detachEvent("on" + eventName, callback);
    }
}

function stopListening(eventTarget,eventType,eventHandler)
{
  // from Michael Kuehl as used in an article:
  // http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
    'use strict';
    if(eventTarget.removeEventListener){
	eventTarget.removeEventListener(eventType,eventHandler,false);
    }else if(eventTarget.detachEvent){
	eventType = 'on'+eventType;
	eventTarget.detachEvent(eventType,eventHandler);
    }else{
	eventTarget['on'+eventType]=null;
    }
}

// from Michael Kuehl as used in an article:
// http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
function cancelEvent(e)
{
    'use strict';
    if(!e){e=window.event;}
    if(e.stopPropagation){e.stopPropagation();}
    if(e.preventDefault) {e.preventDefault(); }
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}

// this routine from Gavin Kistner from this article:
// http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
var wheelDistance = function(e)
{
    'use strict';
    if (!e) e = window.event;

    var w=e.wheelDelta, d=e.detail;

    if (d){
	if (w){
	    return w/d/40*d>0?1:-1; // Opera
	} else{
	    return -d/3;              // Firefox;         TODO: do not /3 for OS X
	}
    } else{
	return w/120;             // IE/Safari/Chrome TODO: /3 for Chrome OS X
    }
}

var wheelDirection = function(e){
    // this routine from Gavin Kistner from this article:
    // http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
    'use strict';
    if (!e) e = window.event;
    return (e.detail<0) ? 1 : (e.wheelDelta>0) ? 1 : -1;
};

function getStyleObj(obj,styleProp)
{
    // Got this from David Cramer
    // http://davidcramer.posterous.com/code/84/get-offsets-xy-for-an-object-javascript.html
    if (obj.currentStyle){
	var s = obj.currentStyle[styleProp];
    } else if (window.getComputedStyle){
	var s = document.defaultView.getComputedStyle(obj,null).getPropertyValue(styleProp);
    }
    return s;
}

function getStyleID(el,styleProp)
{
    var obj = document.getElementById(el);
    return getStyleObj(obj, styleProp);
}

function toc_generator()
{
    var self=this;
    var toc_clicktoshow='<strong>Click to show Table of Contents</strong>';
    var toc_clicktohide='<strong>Click to hide Table of Contents</strong>';
    var toc=document.getElementById('toc');
    if(!toc){
	return null;
    }
    var toc_toggle_target;
    var toc_box;

    var toggleTOCVisibility=function()
    {
	if(toc_toggle_target.innerHTML==toc_clicktoshow){
	    toc_toggle_target.innerHTML=toc_clicktohide;
	    toc_box.hidden=false;
	    toc_box.style.display='block';
	}else{
	    toc_toggle_target.innerHTML=toc_clicktoshow;
	    toc_box.hidden=true;
	    toc_box.style.display='none';
	}
    }

    var getHeaders=function()
    {
	var headers=new Array();
	var hdr_names=[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

	for(var i=0;i<hdr_names.length;i++){
	    var elems=document.getElementsByTagName(hdr_names[i]);
	    for(var j=0;j<elems.length;j++){
		headers.push(elems[j]);
	    }
	}
	// Now sort them
	// I learned how to do this from Peter-Paul Koch from here:
	// http://www.quirksmode.org/dom/getElementsByTagNames.html
	if (headers[0].sourceIndex) {
	    headers.sort(function (a,b) { return a.sourceIndex - b.sourceIndex; });
	} else if (headers[0].compareDocumentPosition){
	    headers.sort(function (a,b) { return 3 - (a.compareDocumentPosition(b) & 6); });
	}
	return headers;
    }

    this.genTOC=function()
    {
	if(!toc){
	    return;
	}
	toc.onclick=toggleTOCVisibility;
	toc_toggle_target=toc.appendChild(document.createElement('span'));
	toc_toggle_target.id='toc_toggle_target';
	toc_toggle_target.innerHTML=toc_clicktoshow;

	toc_box=toc.appendChild(document.createElement('div'));
	toc_box.id='toc_box';
	toc_box.hidden=true;
	toc_box.style.display='none';
	toc_box.appendChild(document.createElement('hr'));	// hr just to separate the toggle target 

	self.headers=getHeaders();   // get all headers in order

	// below, /\bnotoc\b/ is a literal regular expression.  It's compiled at
	// the time the script is instantiated rather than when it's run.
	// The regular expression is \bnotoc\b.  \b means word boundary
	// so it would match classes like 'foo notoc' or 'notoc foo'
	// but not 'foonotoc' or 'notocfoo'
	for(var i=0;i<self.headers.length;i++){
	    if(!/\bnotoc\b/.test(self.headers[i].className)){
		var toc_line=toc_box.appendChild(document.createElement('a'));
		toc_line.innerHTML=self.headers[i].innerHTML;
		toc_line.className='toc_class'+self.headers[i].nodeName;
		if(!self.headers[i].id){
		    self.headers[i].id='toc_link'+i;
		}
		toc_line.href='#'+self.headers[i].id;
	    }
	}
	delete self.headers;
	self.headers=null;	// Done with them
    }
}

this.toc=new toc_generator();
if(this.toc.genTOC){
    this.toc.genTOC();   // Automagically try to generate toc.
}
delete this.toc;
this.toc=null;


