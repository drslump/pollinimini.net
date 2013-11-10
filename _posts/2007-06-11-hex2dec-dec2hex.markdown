---
layout: post
title: Hex2Dec and Dec2Hex
category: Code
tags: [ javascript ]
---

For _secret reasons_ I need to usually convert hex strings to decimal notation.
This can be easily done with a scientific calculator, like the one supplied with
Windows, but it’s slow and I’m usually in a hurry to convert them :)

So I took a look at [GreaseMonkey][], which is an extension for Firefox which
allows to modify a web page once rendered with a simple javascript file.

To install it you’ll first need to have [GreaseMonkey][] installed and activated
(a little monkey face on Firefox’s status bar), then click on this link
[satkeystringconversor.user.js][1]

Here is the highlighted source code so you can review it easily. It’s a pretty
simple script which traverses the DOM performing regular expression tests on text
nodes and converting the matched strings into span elements with an _onclick_ behaviour.

{% highlight javascript %}
// ==UserScript==
// @name           Sat key string conversor
// @namespace      http://pollinimini.net
// @description    Converts satelite key strings from hex to dec or vice versa
// @include        http://www.satscreen.ws/forum/*
// @include      https://www.blogger.com/*
// @include      http://floresd.blogspot.com/*
// @include      http://galeon.com/tusflores/*
// ==/UserScript==
function HEXDEC ( node ) {

  function hex2dec(hex) {
    var dec = [],
      re = /([0-9A-Za-z]{2})\s*/g|>,
      m,
      conv;
    while (m = re.exec(hex)) {
      conv = parseInt(m[1], 16);
      dec.push( (conv < 100 ? ( conv < 10 ? '00' : '0' ) : '') + conv );
    }
    return dec.join(' ');
  }

  function dec2hex(dec) {
    var hex = [],
      re = /([0-9]{3})\s*/g|>,
      m,
      conv;
    while (m = re.exec(dec)) {
      conv = (m[1]-0).toString(16).toUpperCase();
      hex.push( conv.length < 2 ? '0'+conv : conv );
    }
    return hex.join(' ');
  }

  function swapHexDec( e ){
    var target;
    if (!e) var e = window.event;
    if (e.target) target = e.target
    else if (e.srcElement) target = e.srcElement
    if (target.nodeType === 3) target = target.parentNode;
    var tmp = target.firstChild.nodeValue;
    target.firstChild.nodeValue = target.getAttribute('hexdec');
    target.setAttribute('hexdec', tmp);
    if (target.className === 'hexdec')
      target.className = 'dechex';
    else
      target.className = 'hexdec';
  }


  // if no node is specified then start processing on the page body
  node = node || document.body;

  var skipRe = /^(script|style|textarea)$/i|>;
  var re = /((?:[0-9A-Ha-h]{2}\s*){6,})|((?:[0-9]{3}\s*){6,})/g|>;
  // get all nodes from dom
  var nodes = node.all || node.getElementsByTagName('*');
  var i, cnode, span;

  // loop thru all the nodes
  for (i=0; i<nodes.length; i++) {
    // skip if it has no child nodes, it's already processed or the tag is not valid
    if (!nodes[i].childNodes.length ||
      nodes[i].hasAttribute('hexdec') ||
      skipRe.test(nodes[i].tagName)
    )
      continue;

    // loop thru all children
    cnode = nodes[i].childNodes[0];
    while (cnode) {
      // we just care about text nodes
      if (cnode.nodeType === 3) {
        // loop thru all regex matches
        while (m=re.exec(cnode.nodeValue)) {
          // if there is text before the match add it on its own node
          if (m.index > 0)
            cnode.parentNode.insertBefore(
              document.createTextNode( cnode.nodeValue.substr(0, m.index) ), cnode
            );
          // create a new span node for the key string
          span = document.createElement('SPAN');
          // if the first capture parenthesis is found then it's in hex format
          if (m[1]) {
            span.className = 'hexdec';
            span.setAttribute( 'hexdec', hex2dec(m[0]) );
          // otherwise it is in decimal format
          } else {
            span.className = 'dechex';
            span.setAttribute( 'hexdec', dec2hex(m[0]) );
          }
          span.setAttribute( 'title', 'Click to swap betwen hex and decimal notations' );
          span.appendChild( document.createTextNode( m[0] ) );
          //span.onclick = swapHexDec;
          span.addEventListener( 'click', swapHexDec, true );
          cnode.parentNode.insertBefore( span, cnode );

          // remove the already processed text from the node
          cnode.nodeValue = cnode.nodeValue.substring( m.index + m[0].length );
          // reset the regex text pointer
          re.lastIndex = 0;
        }
      }
      // point to next children or null
      cnode = cnode.nextSibling;
    }
  }
}

window.addEventListener( 'load', function () { HEXDEC() }, true );

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle( '\
  .hexdec, .dechex { \
    cursor: hand;\
    cursor: pointer !important;\
    border-bottom: 1px dotted #888;\
    padding-left: 32px;\
    background: url(http://pollinimini.net/temp/hex.png) no-repeat left;\
  }\n\
  .dechex {\
    background: url(http://pollinimini.net/temp/dec.png) no-repeat left;\
  }');
{% endhighlight %}


By default the following sites are enabled (you can configure it for whatever
sites you need):

 * http://www.satscreen.ws/forum/
 * http://floresd.blogspot.com/
 * http://galeon.com/tusflores/
 * https://www.blogger.com/

It uses a neutral blue coloring for the styling which shouldn’t break most web
designs. The images are served from my own server, so they aren’t very reliable,
don’t be afraid if one day they stop showing :)


[GreaseMonkey]: http://www.greasespot.net/
[1]: /files/satkeystringconversor.user.js

