// restore data from localStorage
var visitedLinks = 0;
var vl = localStorage.getItem('visitedLinks');
if(vl != null){
	visitedLinks = parseInt(vl, 16);
	var vidlinks = document.querySelectorAll('table.competition>tbody>tr>td:last-child');
	for(var i=0; i<vidlinks.length; ++i){
		if(visitedLinks & (1 << i)){
			vidlinks[i].className = "visited";
		}
	}
}


var playerdiv = document.getElementById('player');
var ytiframe = null;
var player = null;
function embedYTVideo(event, arr){
	if(event.target.parentElement.className != "visited"){
		// mark as visited
		event.target.parentElement.className = "visited";
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
		visitedLinks |= 1 << pos;
		localStorage.setItem('visitedLinks', visitedLinks.toString(16));
	}

	if(player == null){
		var url = 'https://www.youtube.com/embed/' + arr[0]
				+ '?showinfo=0&amp;version=3&amp;enablejsapi=1&amp;playerapiid=ytplayer';
		if(arr.length > 1){
			url += '&amp;playlist=' + arr[1];
			for(var i=2; i<arr.length; i++){
				url += ',' + arr[i];
			}
		}

		var playerAPI = document.createElement('script');
		playerAPI.setAttribute('src', 'https://www.youtube.com/player_api');

		playerAPI.onload = function(){
			ytiframe = document.createElement('iframe');
			ytiframe.setAttribute('id', 'ytplayer');
			ytiframe.setAttribute('type', 'text/html');
			ytiframe.setAttribute('width', '640');
			ytiframe.setAttribute('height', '390');
			ytiframe.setAttribute('allowfullscreen', 'true');
			ytiframe.setAttribute('src', url);

			ytiframe.onload = function(){
				player = new YT.Player('ytplayer', {
				  events: {
					'onReady': onPlayerReady,
				  }
				});
			}
			
			playerdiv.appendChild(ytiframe);
		}
		playerdiv.appendChild(playerAPI);
	}else{
		//show player as it could be hidden 'cause of twitch
		ytiframe.style.display = "block";
		//player already loaded, just load videos
		player.loadPlaylist(arr);
	}
}
function onPlayerReady(evt) {
	player.playVideo();
}

var elements = document.querySelectorAll('table.competition>tbody>tr>td:nth-child(2)');
document.getElementById('filter').addEventListener('input', function(evt){
	var needle = evt.target.value.toLowerCase();
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
}, false);

var scores = document.querySelectorAll('table.competition td.score');
document.getElementById('unhide').addEventListener('click', function(evt){
	for(var i=0; i<scores.length; ++i){
		scores[i].style.backgroundColor = evt.target.checked? 'inherit': 'black';
	}
}, false);

var ranking = document.querySelectorAll('table#ranking tbody td');
document.getElementById('unhide_ranking').addEventListener('click', function(evt){
	for(var i=0; i<ranking.length; ++i){
		ranking[i].style.backgroundColor = evt.target.checked? 'inherit': 'black';
	}
	if(evt.target.checked){
		document.getElementById('ranking').scrollIntoView(true);
	}
}, false);

var scrolling = false;
var hr = document.getElementById('border');
window.onscroll = function(evt){
	if(ytiframe){
		if(scrolling){
			if(border.getBoundingClientRect().top > 0){
				ytiframe.className = "";
				ytiframe.style.left = "0";
				scrolling = false;
			}
		}else{
			var rect = ytiframe.getBoundingClientRect();
			if(rect.top < 0){
				ytiframe.className = "fixed";
				ytiframe.style.left = rect.left+"px";
				scrolling = true;
			}
		}
	}
}

