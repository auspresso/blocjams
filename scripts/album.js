var setSong = function(songNumber) {
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

     return $(template);
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumSongList.empty();

    for (i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
      $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    setSong(currentAlbum.songs[currentSongIndex]);

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    setSong(currentAlbum.songs[currentSongIndex]);

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber)

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var findParentByClassName = function(element, targetClass) {
        var currentParent = element.parentElement;
        while (currentParent.className !== targetClass) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function() {
  var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
          $(this).html(pauseButtonTemplate);
          setSong(songNumber);
          setSong(currentAlbum.songs[songNumber - 1]);
          updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          setSong(null);
          setSong(null);
      }
      };

      var onHover = function(event) {
          var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));

          if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
       songNumberCell.html(songNumber);
    }

    console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumHorrors);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);

    songListContainer.addEventListener('mouseover', function(event) {
      if (event.target.parentElement.className === 'album-view-song-item') {
        var songItem = getSongItem(event.target);
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
      }
  });

  for (i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      // #2
      if (songItemNumber !== currentlyPlayingSong) {
          songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
})

    var albums = [albumHorrors, albumDead, albumTimber];
    var index = 1;
    albumImage.addEventListener("click", function(event) {
      setCurrentAlbum(album[index]);
      index++;
      if (index == albums.length) {
        index = 0;
      }
  });
