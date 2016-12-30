  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'yy7dIhzyiag',
      playerVars: {
        'showinfo': 0,
        'controls': 0,
        'disablekb': 0,
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': nextVideo
      }
    });
  }

  function onPlayerReady(event) {
    nextVideo()
  }

  function nextVideo() {
    url = "https://api.discogs.com/masters/" + Math.floor(Math.random() * 1110000);
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        jsonpCallback: "playVideo"
    });
  }

  function playVideo(responseJSON) {
    if (responseJSON.data.videos != undefined) {
      video = responseJSON.data.videos[Math.floor(Math.random() * responseJSON.data.videos.length)];
      idRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
      id = video.uri.match(idRegex)[1];
      player.loadVideoById(id);
    }
    else {
      nextVideo();
    }
  }

  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
      nextVideo();
    }
  }

  $(document).ready(function() {
      $(window).keypress(function (e) {
      if (e.keyCode === 0 || e.keyCode === 32) {
        e.preventDefault()
        nextVideo();
      }
    })
  });
