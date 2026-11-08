const input=document.querySelector('#jsonInput');
const output=document.querySelector('#jsonOutput');
const status=document.querySelector('#status');
const copy=document.querySelector('#copyBtn');
const download=document.querySelector('#downloadBtn');
const indent=document.querySelector('#indentSize');
let parsed;
function setStatus(text,error=false){status.textContent=text;status.classList.toggle('error',error)}
function parse(){try{parsed=JSON.parse(input.value);return true}catch(error){parsed=undefined;output.value='';copy.disabled=true;download.disabled=true;setStatus(error.message,true);return false}}
function render(compact=false){if(!input.value.trim()){parsed=undefined;output.value='';copy.disabled=true;download.disabled=true;setStatus('Paste JSON above or try the sample.');return}if(!parse())return;const space=compact?0:indent.value==='tab'?'\t':Number(indent.value);output.value=JSON.stringify(parsed,null,space);copy.disabled=false;download.disabled=false;setStatus(compact?'Valid JSON · Minified output ready.':'Valid JSON · Formatted output ready.')}
document.querySelector('#formatBtn').addEventListener('click',()=>render(false));
document.querySelector('#minifyBtn').addEventListener('click',()=>render(true));
input.addEventListener('input',()=>{if(!input.value.trim()){output.value='';copy.disabled=true;download.disabled=true;setStatus('Paste JSON above or try the sample.');return}if(parse())setStatus('Valid JSON · Ready to format or minify.')});
copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);setStatus('Copied formatted JSON to clipboard.')}catch{output.focus();output.select();setStatus('Select the output and copy it with your keyboard.',true)}});
download.addEventListener('click',()=>{const blob=new Blob([output.value],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='formatted.json';a.click();URL.revokeObjectURL(url);setStatus('Downloaded formatted.json.')});
document.querySelector('#sampleBtn').addEventListener('click',()=>{input.value='{"product":"JSON Formatter & Validator","by":"Redsite","features":["format","validate","minify"],"private":true}';render(false)});
