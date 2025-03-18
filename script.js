/********************************************************************
 * Title: XSS Vulnerable Inputs
 * Author: Tommy Burden
 * Description: The code is vulnerable to javascript code injection.
 *              This code should not used anywhere that security is
 *              important (basically, don't use it outside of this 
 *              practice environment!)
 *******************************************************************/

// Essentially no escaping done to input
function escape(s) {
  return `<script>console.log("${s}");</script>`;
}

// Basic replace function for escaping
function adobeEscape(s) {
  s = s.replace(/"/g, '\\"');
  return '<script>console.log("' + s + '");</script>';
}

// Attempting to use JSON.stringify to stop XSS
function jsonEscape(s) {
  s = JSON.stringify(s);
  return '<script>console.log(' + s + ');</script>';
}

// This allows us to display the input without it being seen as valid HTML script
function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// This allows the script tag to be run after inserting it into the HTML
// I stole this from Stack Overflow. Don't expect me to know much about it.
function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  
  Array.from(elm.querySelectorAll("script"))
    .forEach( oldScriptEl => {
      const newScriptEl = document.createElement("script");
      
      Array.from(oldScriptEl.attributes).forEach( attr => {
        newScriptEl.setAttribute(attr.name, attr.value) 
      });
      
      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);
      
      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}

// Get input depending on which submit btn is clicked
// Set escaped output value to correct output div
// Finally, put exploit code into hidden input and run it
function main(c) {
  let s = "";
  let outputVal = "";

  switch(c) {
    case 'WARMUP':
      s = document.getElementById('warmInput').value;
      outputVal = escape(s);
      document.getElementById('warmOutput').innerHTML = encodeHTML(outputVal);
      break;
    case 'ADOBE':
      s = document.getElementById('adobeInput').value;
      outputVal = adobeEscape(s);
      document.getElementById('adobeOutput').innerHTML = encodeHTML(outputVal);
      break;
    case 'STRINGIFY':
      s = document.getElementById('jsonInput').value;
      outputVal = jsonEscape(s);
      document.getElementById('jsonOutput').innerHTML = encodeHTML(outputVal);
      
      break;
  }

  hiddenText = document.getElementById('hiddenText');
  setInnerHTML(hiddenText, outputVal);
}