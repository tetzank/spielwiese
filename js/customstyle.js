function writeStyle(){
	var styleTag = document.getElementById('customstyle');
	styleTag.innerHTML =
"body{\
	color: "+tags[0].value+";\
	background-color: "+tags[1].value+";\
}\
a{ color: "+tags[8].value+" !important; }\
.visited a{ color: "+tags[6].value+" !important; }\
.watching{ background-color: "+tags[5].value+"; }\
.competition tbody:nth-child(even),\
#ranking.visible tbody tr:nth-child(odd){\
	background-color: "+tags[2].value+" !important;\
}\
.competition tbody:nth-child(odd),\
#ranking.visible tbody tr:nth-child(even){\
	background-color: "+tags[3].value+" !important;\
}\
.competition tbody tr:hover,\
#ranking.visible tbody tr:hover{\
	background-color: "+tags[4].value+" !important;\
}\
.competition td.score,\
#ranking tbody tr{\
	color: "+tags[7].value+" !important;\
	background-color: "+tags[7].value+" !important;\
}\
#ranking tbody tr a{\
	color: "+tags[7].value+" !important;\
}";

	//save in local storage
	for(var i=0; i<colors.length; ++i){
		localStorage.setItem(colors[i], tags[i].value);
	}
}


var colors = [
	'textcolor', 'bgcolor', 'evencolor', 'oddcolor', 'hovercolor',
	'watchingcolor', 'visitedcolor', 'hiddencolor', 'linkcolor'
];
var tags = [];
for(var i=0; i<colors.length; ++i){
	tags[i] = document.getElementById(colors[i]);
	tags[i].addEventListener('input', writeStyle, false);
}

var txt = localStorage.getItem(colors[0]);
if(txt !== null){
	tags[0].value = txt;
	for(var i=1; i<colors.length; ++i){
		tags[i].value = localStorage.getItem(colors[i]);
	}
	writeStyle();
}


document.getElementById('resetcolors').addEventListener('click', function(evt){
	document.getElementById('customstyle').innerHTML = '';
	// delete storage items
	for(var i=0; i<colors.length; ++i){
		localStorage.removeItem(colors[i]);
	}
}, false);


function detailsSupport(){
	var ele = document.createElement('details');
	return 'open' in ele;
}
function toggleDisplay(event){
	var ele = event.target.parentElement.nextElementSibling;
	if(ele.style.display == 'none'){
		ele.style.display = 'block';
	}else{
		ele.style.display = 'none';
	}
}

if(!detailsSupport()){
	//alert('no details support');
	var details = document.querySelector('details');
	// create new nodes
	var root = document.createElement('div');
	var sum = document.createElement('p');
	var toggle = document.createElement('a');
	toggle.setAttribute('href', '#');
	var detail = document.createElement('div');
	detail.style.display = 'none';
	toggle.addEventListener('click', toggleDisplay, false);
	// handle summary
	var summary = details.querySelector('summary');
	toggle.innerHTML = summary.textContent;
	sum.appendChild(toggle);
	root.appendChild(sum);
	details.removeChild(summary);
	// move children to new node
	while(details.firstChild){
		detail.appendChild(details.firstChild);
	}
	root.appendChild(detail);
	// replace everything
	details.parentNode.replaceChild(root, details);
}
