  var tag = document.createElement('script');
  var tapeButtonSfx = new Audio("sfx/tapebutton.wav");
  var tapeOffSfx = new Audio("sfx/tapeoff.wav");
  var tapeLoopSfx = new Audio("sfx/tapeloop.wav");
  tapeLoopSfx.loop = true;

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
    player.pauseVideo();
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
      songTitle = video.title;
      if(songTitle.length > 58) {
        songTitle = songTitle.substring(0, 55) + "...";
      }
      albumTitle = responseJSON.data.title;
      if(albumTitle.length > 58) {
        albumTitle = albumTitle.substring(0, 55) + "...";
      }
      $("#song-link").text(songTitle);
      $("#song-link").attr("href", video.uri);
      $("#album-link").text(albumTitle);
      $("#album-link").attr("href", responseJSON.data.uri);
    }
    else {
      nextVideo();
    }
  }

  var done = false;
  function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.PLAYING) {
      playMode();
      tapeOffSfx.play();
    }
    else {
      bufferMode();
    }
    if (event.data == YT.PlayerState.ENDED) {
      nextVideo();
    }
  }

  $(document).ready(function() {
      tapeLoopSfx.play();
      $("#skip").click(function (e) {
        e.preventDefault()
        tapeButtonSfx.play();
        bufferMode();
        nextVideo();
    })
  });

  function playMode() {
    $("#skip").show();
    $("#tape").hide();
    tapeLoopSfx.pause();
  }

  function bufferMode() {
    $("#skip").hide();
    $("#tape").show();
    tapeLoopSfx.play();
  }
