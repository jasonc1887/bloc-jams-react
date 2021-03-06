import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './album.css'

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0,
      isPlaying: false,
      isHovering: null
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
   }

   componentDidMount() {
     this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
    },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
    },
       volumechange: e => {
         this.setState({ volume: this.audioElement.volumechange});
       }
  };
  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
}

componentWillUnmount() {
  this.audioElement.src = null;
  this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
}

   play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }

   pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();
     }
   }

   handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
   }

   handleNextClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = currentIndex + 1 <= this.state.album.songs.length - 1 ? currentIndex + 1 : 0;
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
   }

   handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

   formatTime(time) {
     const minutes = Math.floor(time / 60);
     const seconds = Number((time % 60) / 100).toFixed(2).substr(2,3);
     const songTime = (minutes + ":" + seconds);
     return (songTime === null ? "-:--" : songTime);
   }

   handleVolumeChange(e) {
     const newVolume = e.target.value;
     this.audioElement.volume = newVolume;
     this.setState({ volume: newVolume });
   }

   handleMouseEnter(index) {

     this.setState({
       isHovering: index,

     });
     console.log("hovering")
   }

   handleMouseLeave(song) {

     this.setState({
       isHovering: null,
     })
     console.log("left");
   }

   handleIcon(song, index) {
     const isSameSong = this.state.currentSong === song;

     if (isSameSong && this.state.isPlaying || this.state.sHovering === index) {
       return (<ion-icon name="pause"></ion-icon>)

  }  else if (!this.state.isSameSong && this.state.isHovering === song) {
       return (<ion-icon name="play"></ion-icon>)

  }  else {
       return (<td>{index + 1}</td>)
     }
   };

  render() {
    return (
      <section id="main">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div id="album">
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        <table id="song-list" style={{display: 'flex', justifyContent: 'center'}}>
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            { this.state.album.songs.map( (song, index) =>
              <tr className="song" key={index}
                  onClick={() => this.handleSongClick(song)}
                  onMouseEnter={() => this.handleMouseEnter(song)}
                  onMouseLeave={() => this.handleMouseLeave(song)}>
                <td>{this.handleIcon(song, index)}</td>
                <td key="title" id="title">{song.title}</td>
                <td key="duration" formatTime={this.formatTime}>{this.formatTime(song.duration)}</td>
              </tr>
             )
            }
          </tbody>
        </table>
        <PlayerBar className="player-bar"
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.currentVolume}
          formatTime={this.formatTime}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
        </div>
      </section>
    );
  }
}

export default Album;
