/*

  SmartClient Ajax RIA system
  Version v11.1p_2018-06-28/LGPL Deployment (2018-06-28)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/
//> @class Sound
// SmartClient class for loading and playing audio files using the HTML5 &lt;AUDIO&gt; 
// element.
// @inheritsFrom BaseWidget
// @visibility external
// @treeLocation Client Reference/Sound
//<
isc.ClassFactory.defineClass("Sound", "BaseWidget");

isc.Sound.addProperties({

init : function () {
    this.Super("init", arguments);
    if (this.ID !== false && (this.ID == null || window[this.ID] != this)) {
        isc.ClassFactory.addGlobalID(this); 
    }
    if (this.src != null) {
        if (this.autoLoad) this.load();
        if (this.autoPlay) this.play();
    }
},
    
//> @attr sound.src (String | Array of String : null : IRW)
// URL of the audio file to be played by this sound instance. If multiple file URLs are
// supplied, the browser will make use of the first file type for which it has support.
// @setter sound.setSrc()
// @visibility external
//<

//> @method sound.setSrc()
// Update the +link{sound.src} of this sound instance at runtime. Note that 
// +link{sound.autoLoad} and +link{sound.autoPlay} govern whether this media will
// be loaded or played immediately when the src value is changed.
// @param src (String | Array of String) URL of new audio file to be played by this sound instance.
// @visibility external
//<
setSrc : function (src) {
    if (src != null) {
        if (isc.isAn.Array(src)) {
            this.src = [];
            for (var i=0; i<src.length; i++) this.src[i] = src[i];
        } else {
            this.src = src;
        }

        if (this.autoPlay) {
            this.load();
            this.play();
        } else {
            this.playOnLoad = null;
            if (this.autoLoad) this.load();
            else this._loading = null;
        }
    }
},

//> @attr sound.autoLoad (boolean : false : IRW)
// Should the specified +link{sound.src,audio file} be loaded automatically.
// <P>
// If set to <code>false</code> developers may load the audio explicitly via 
// +link{sound.load()}
// @visibility external
//<

_canPlay : function () {
},
    
_canPlayThrough : function () {
    this._loading = null;
    if (this._canPlayCallback != null) this._canPlayCallback();
    
    if (this.playOnLoad) {
        this.playOnLoad = null;
        if (this.audioElement != null) this.play();
    } else if (this.autoPlay && this.audioElement != null) {
        this.play();
    }
},
    
//> @method sound.load()
// This method will cause the +link{sound.src,specified audio file} to be loaded
// @param [canPlayCallback] (CanPlayCallback) notification to fire when the file is ready to play
// @visibility external
//<
load : function (canPlayCallback) {
    var _this = this,
        sources = "";
    this._loading = true;
    
    if (this.src == null) {
        isc.logWarn("'sound.src' is null. Please, set it first.");
        return;
    }
    if (canPlayCallback != null) this._canPlayCallback = canPlayCallback;
    
    if (isc.isAn.Array(this.src)) {
        for (var i = 0; i < this.src.length; i++) {
            sources += "<source "+
                "id='" + isc.ClassFactory.getDOMID("sourceElement" + i) + "', "+
                "src='" + this.src[i] + "', "+
                "preload='none' "+
                "/>"
        }
    } else {
        sources = "<source "+
            "id='" + isc.ClassFactory.getDOMID("sourceElement0") + "', "+
            "src='" + this.src + "', "+
            "preload='none' "+
            "/>"  
    }
        
    if (this.audioElement == null) {
        this.audioElement = document.createElement("audio");
        this.audioElement = isc.addProperties(this.audioElement, {
            id : isc.ClassFactory.getDOMID("audioElement"),
            preload : 'none',
            onended : function () {
                if (_this._playbackEnded != null) _this._playbackEnded();
            },
            oncanplay : function () {
                _this._canPlay();
            },
            oncanplaythrough : function () {
                _this._canPlayThrough();
            },
            ontimeupdate : function () {
                _this.timeChanged(_this.getCurrentTime());
            },
            style : "visibility:hidden;position:absolute;left:0px;top:0px;"
        } );
    }
    this.audioElement.innerHTML = sources;
    this.audioElement.load();
},

//> @attr sound.autoPlay (boolean : false : IRW)
// Should the specified +link{sound.src,audio file} be played automatically?
// <P>
// If set to <code>false</code> developers may play the audio explicitly via 
// +link{sound.play()}.
// @visibility external
//<

//> @method sound.play()
// Play the audio file.
// If necessary the file will be loaded first.
// @param [playbackCompleteCallback] (PlaybackCompleteCallback) notification fired when playback completes
// @visibility external
//<
play : function (playbackCompleteCallback) {
    if (playbackCompleteCallback != null) this._playbackEnded = playbackCompleteCallback;

    if (this.audioElement != null) {
        var state = this.audioElement.readyState;
        if (state == 1 || state == 3 || state == 4) {
            this.audioElement.play();
        } else {
            this.playOnLoad = true;
            if (!this._loading) this.load();
        }
    } else {
        isc.logWarn("There is no audio element defined to play. You need to set the 'src' property and then call load().");
    }
},

//> @method sound.pause()
// Pause playback of the audio file.
// @visibility external
//<
pause : function () {
     if (this.audioElement != null) this.audioElement.pause();
},

//> @method sound.reset()
// If playback is currently paused, reset the playback position to the start of the audio
// file so a call to +link{sound.play()} will play from the start, rather than resuming
// playback from the current position.
// @visibility external
//<
reset : function () {
    if (this.audioElement != null && this.audioElement.paused) {
        this.audioElement.currentTime = 0;
    }
},

//> @method sound.timeChanged()
// Notification method fired repeatedly to indicate a change in currentTime
// value while an audio file is playing.
// @param currentTime (float) Current playback position in seconds.
// @visibility external
//<
timeChanged : function (currentTime) { 
},

//> @method sound.getDuration()
// Retrieves the duration of the current audio file in seconds.
// @return (Float) duration of the audio file in seconds. If the
//   file has not been loaded, or no +link{sound.src} is defined, this method will
//   return null.
// @visibility external
//<
getDuration : function () {
    if (this.audioElement != null && this.src != null) return this.audioElement.duration;
    else return null;
},

//> @method sound.getCurrentTime()
// Retrieves the current playback time of a playing or paused audio file in seconds.
// @return (Float) current playback time audio file in seconds. If the
//   file has not been loaded, or no +link{sound.src} is defined, this method will
//   return zero.
// @visibility external
//<
getCurrentTime : function () {
    if (this.audioElement != null && this.src != null) return this.audioElement.currentTime;
    else return null;
},

//> @method sound.setCurrentTime()
// Move playback to a particular time in a loaded audio file.
// @param time (Float) time to move to. This method will have no effect if the
//  file has not been loaded or no +link{sound.src} element is defined.
// @visibility external
//<
setCurrentTime : function (time) {
    if (this.audioElement != null && this.src != null) this.audioElement.currentTime = time;
}

});

isc.Sound.addClassMethods({

//> @classMethod Sound.isSupported()
// Returns true for browsers which natively support HTML5 Audio, used by the
// Sound class
// @return (boolean) true if Audio is supported in this browser
// @visibility external
//<
isSupported : function () {
    return (isc.Browser.supportsHTML5Audio != null) ? true : false;
},

//> @classMethod Sound.supportsFileType()
// Can this browser play media of the specified fileType? Note that 
// @param fileType (String) audio file type. Some typical
//   values are "audio/mpeg", "audio/ogg", "audio/wav", "audio/mp3".
// @return (boolean) true if the specified file-type is supported in this browser. 
// @visibility internal
//<
supportsFileType : function (fileType) {
    if (fileType == null) return false;
    
    var audio = this._audio,
        isFileTypeSupported = false;
    if (audio == null) {
        audio = document.createElement('audio');
        this._audio = audio;
    }
    
    if (this._fileType == null || this._fileType != fileType) {
        this._fileType = fileType;
        var playTypeSupported = audio.canPlayType(fileType);
        
        if (playTypeSupported != "") isFileTypeSupported = true;
        
        this._isFileTypeSupported = isFileTypeSupported;
        
    } else {
        isFileTypeSupported = this._isFileTypeSupported;
    }
    return isFileTypeSupported;
},

//> @classMethod Sound.play()
// Convenience method to load and play a specified audio file.
// <P>
// For more explicit control over loading and playback of audio files, developers may
// create an instance of Sound and call methods directly on that object.
// @param src (String) URL of the audio clip to play
// @param [playbackCompleteCallback] (PlaybackCompleteCallback) callback to execute when the clip playback completes
// @visibility external
//<
play : function (src, playbackCompleteCallback) {
    
    if (src == null) {
        isc.logWarn("'src' is null. Please, set it first.");
        return;
    }
    var audioElement = isc.Sound.create({
        src : src,
        autoLoad : true
    });
    audioElement.play(playbackCompleteCallback);
}

});
