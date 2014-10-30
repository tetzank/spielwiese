var playerdiv = document.getElementById('player');
var ytiframe = null;
var player = null;
function embedYTVideo(arr){
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
		
		//var placeholder = document.getElementById('player');
		//var article = document.querySelector('article.post-content');
		//article.insertBefore(playerAPI, placeholder);
		//article.insertBefore(iframe, placeholder);
		//article.removeChild(placeholder);
		playerdiv.appendChild(playerAPI);
		playerdiv.appendChild(ytiframe);
	}else{
		//show player as it could be hidden 'cause of twitch
		ytiframe.style.display = "block";
		//player already loaded, just load videos
		player.loadPlaylist(arr);
	}
	//TODO: not sure how to handle twitch, maybe just hide yt player
}
function onPlayerReady(evt) {
	player.playVideo();
}

var obj = null;
function embedTwitch(channel, chapter){ //FIXME: doesn't load the right file
	if(obj != null){
		playerdiv.removeChild(obj);
	}
	if(ytiframe != null){
		ytiframe.style.display = "none";
	}

	obj = document.createElement('object');
	obj.setAttribute('id', 'twplayer');
	obj.setAttribute('type', 'application/x-shockwave-flash');
	obj.setAttribute('width', '620');
	obj.setAttribute('height', '378');
	obj.setAttribute('data', 'http://www.twitch.tv/widgets/archive_embed_player.swf');

	var param = document.createElement('param');
	param.setAttribute('name', 'movie');
	param.setAttribute('value','http://www.twitch.tv/widgets/archive_embed_player.swf');
	obj.appendChild(param);

	param = document.createElement('param');
	param.setAttribute('name', 'allowFullScreen');
	param.setAttribute('value','true');
	obj.appendChild(param);

	param = document.createElement('param');
	param.setAttribute('name', 'flashvars');
	param.setAttribute('value','channel='+channel+'&amp;chapter_id='+chapter+'&amp;auto_play=false');
	obj.appendChild(param);

	playerdiv.appendChild(obj);
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
