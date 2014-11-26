// big bitfield
function BitField32(nSize){
    var nNumbers = Math.ceil(nSize/32) | 0;
    this.values = new Uint32Array(nNumbers);
}
BitField32.prototype.get = function(i){
	// | 0 - converts to int, all bitwise ops work on int32
    var index = (i / 32) | 0; 
    var bit = i % 32;
    return (this.values[index] & (1 << bit)) !== 0;
};
BitField32.prototype.set = function(i){
    var index = (i / 32) | 0;
    var bit = i % 32;
    this.values[index] |= 1 << bit;
};
BitField32.prototype.unset = function(i){
    var index = (i / 32) | 0;
    var bit = i % 32;
    this.values[index] &= ~(1 << bit);
};
BitField32.prototype.toString = function(){
	var str = this.values[0].toString(16);
	for(var i=1; i<this.values.length; ++i){
		str += ";"+ this.values[i].toString(16);
	}
	return str;
};
BitField32.prototype.fromString = function(str){
	var arr = str.split(";");
	for(var i=0; i<arr.length && i<this.values.length; ++i){
		this.values[i] = parseInt(arr[i], 16);
	}
};


// restore data from localStorage
var vidlinks = document.querySelectorAll('table.competition>tbody>tr>td:last-child');
// visitedLinks is partitioned in 32 bit chunks to prevent overflows
var visitedLinks = new BitField32(vidlinks.length);
var vl = localStorage.getItem('visitedLinks');
if(vl !== null){
	visitedLinks.fromString(vl);
	for(var i=0; i<vidlinks.length; ++i){
		if(visitedLinks.get(i)){
			vidlinks[i].className = "visited";
		}
	}
}

function markVideo(event){
	var w = document.getElementsByClassName('watching');
	if(w.length > 0){
		w[0].classList.remove('watching');
	}
	var cl = event.target.parentElement.classList;
	cl.add("watching");
	if(!cl.contains("visited")){
		// mark as visited
		cl.add("visited");
		// get position in table
		var pos = 0;
		var n = event.target.parentElement.parentElement; // a -> td -> tr
		while(n.previousElementSibling){
			++pos;
			n = n.previousElementSibling;
		}
		n = n.parentElement.previousElementSibling; // tr -> tbody -> tbody or thead
		while(n.previousElementSibling){
			pos += n.childElementCount;
			n = n.previousElementSibling;
		}
		// save in localStorage
		visitedLinks.set(pos);
		localStorage.setItem('visitedLinks', visitedLinks.toString());
	}
}

var playerdiv = document.getElementById('player');
var ytplayerAPI = null;
var swfobject = null;
var ytplayer = null;
var twplayer = null;
function ytinit(url){
	var ytiframe = document.createElement('iframe');
	ytiframe.setAttribute('id', 'ytplayer');
	ytiframe.setAttribute('type', 'text/html');
	ytiframe.setAttribute('width', '640');
	ytiframe.setAttribute('height', '390');
	ytiframe.setAttribute('allowfullscreen', 'true');
	ytiframe.setAttribute('src', url);

	ytiframe.onload = function(){
		ytplayer = new YT.Player('ytplayer', {
		  events: {
			'onReady': onPlayerReady,
		  }
		});
	}
	
	playerdiv.appendChild(ytiframe);
}
function embedYTVideo(event, arr){
	markVideo(event);
	
	if(twplayer){
		twplayer.pauseVideo();
		document.getElementById('twframe').removeChild(twplayer);
		twplayer = null;
	}

	if(ytplayer == null){
		var url = 'https://www.youtube.com/embed/' + arr[0]
				+ '?showinfo=0&amp;version=3&amp;enablejsapi=1&amp;playerapiid=ytplayer';
		if(arr.length > 1){
			url += '&amp;playlist=' + arr[1];
			for(var i=2; i<arr.length; i++){
				url += ',' + arr[i];
			}
		}
		if(ytplayerAPI == null){
			ytplayerAPI = document.createElement('script');
			ytplayerAPI.setAttribute('src', 'https://www.youtube.com/player_api');

			ytplayerAPI.onload = ytinit.bind(null, url);
			playerdiv.appendChild(ytplayerAPI);
		}else{
			ytinit(url);
		}
	}else{
		//player already loaded, just load videos
		ytplayer.loadPlaylist(arr);
	}
}
function onPlayerReady(evt) {
	ytplayer.playVideo();
}

function twinit(vid){
	window.onPlayerEvent = function (data) {
		data.forEach(function(event) {
			if (event.event == "playerInit") {
				twplayer = document.getElementById('twplayer');
				twplayer.loadVideo(vid);
			}
		});
	}
	swfobject.embedSWF("//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf", "twplayer", "640", "400", "11", null,
		{
			"eventsCallback":"onPlayerEvent",
			"embed":1,
			"auto_play":"true"
		},{
			"allowScriptAccess":"always",
			"allowFullScreen":"true"
		}//, null, twobj_ready
	);
}
function embedTWVideo(event, vid){
	markVideo(event);

	if(ytplayer){
		ytplayer.stopVideo();
		// remove iframe, ytplayer is player object
		playerdiv.removeChild(document.getElementById('ytplayer'));
		ytplayer = null;
	}

	if(twplayer == null){
		if(swfobject == null){
			swfobject = document.createElement('script');
			swfobject.setAttribute('src', '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js');
			
			swfobject.onload = twinit.bind(null, vid);
			playerdiv.appendChild(swfobject);
		}else{
			twinit(vid);
		}
	}else{
		//load and play
		twplayer.loadVideo(vid);
	}
}


var elementsM = document.querySelectorAll('table.competition>tbody>tr>td:nth-child(2)');
var elementsR = document.querySelectorAll('table.competition>tbody>tr>td:first-child');
document.getElementById('filter').addEventListener('input', function(evt){
	filterInput(evt.target.value);
}, false);
function filterInput(str){
	var elements = elementsM;
	if(/^\d+$/.test(str)){
		elements = elementsR;
	}

	var needle = str.toLowerCase();
	for(var i=0; i<elements.length; ++i){
		var ele = elements[i];
		if(ele.innerHTML.toLowerCase().indexOf(needle) == -1){
			ele.parentNode.style.visibility = "collapse";
			//workaround for chromium
			ele.parentNode.style.display = "none";
		}else{
			ele.parentNode.style.visibility = "visible";
			//workaround for chromium
			ele.parentNode.style.display = "table-row";
		}
	}
}

var scores = document.querySelectorAll('table.competition td.score');
document.getElementById('unhide').addEventListener('click', function(evt){
	for(var i=0; i<scores.length; ++i){
		scores[i].classList.toggle('visible', evt.target.checked);
	}
}, false);

var ranking = document.getElementById('ranking');
document.getElementById('unhide_ranking').addEventListener('click', function(evt){
	ranking.classList.toggle('visible', evt.target.checked);
	if(evt.target.checked){
		document.getElementById('ranking').scrollIntoView(true);
	}
	document.getElementById('unhide_ranking2').checked = evt.target.checked;
}, false);
document.getElementById('unhide_ranking2').addEventListener('click', function(evt){
	ranking.classList.toggle('visible', evt.target.checked);
	document.getElementById('unhide_ranking').checked = evt.target.checked;
}, false);

var scrolling = false;
var hr = document.getElementById('border');
window.onscroll = function(evt){
	if(scrolling){
		if(hr.getBoundingClientRect().top > 0){
			playerdiv.className = "";
			playerdiv.style.left = "0";
			scrolling = false;
		}
	}else{
		var rect = playerdiv.getBoundingClientRect();
		if(rect.top < 0){
			playerdiv.className = "fixed";
			if(ytplayer || twplayer){
				playerdiv.style.left = rect.left+"px";
			}else{
				playerdiv.style.left = (rect.left-640)+"px";
			}
			scrolling = true;
		}
	}
}

var filter = document.getElementById('filter');
function showGames(player){
	filter.value = player;
	filterInput(player);
}
