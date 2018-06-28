var progressbar = isc.Progressbar.create({
    breadth: 16,
    showTitle: true,
    title:"00:00 / 00:00"
});

var audioIsSupported = isc.Sound.isSupported(),
    audio = null;

if (audioIsSupported) {
    audio = isc.Sound.create({
        src: isc.Page.getIsomorphicDocsDir() + "inlineExamples/audios/crescendo.mp3",
        autoLoad: true,
        duration: "00:00",
        formatTime : function (seconds) {
            if (seconds == null) return "--:--";
            var minutes = Math.floor(seconds / 60) || 0;
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            var seconds = Math.floor(seconds % 60) || 0;
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },
        timeChanged : function (currentTime) {
            progressbar.setPercentDone(Math.floor((currentTime * 100) / this.getDuration()));
            progressbar.setTitle(this.formatTime(currentTime) + " / " + this.formatTime(this.getDuration()));
        }
    });
} else {
    isc.warn("Your browser does not support HTML5 Audio");
}

var hLayout = isc.HLayout.create({
    autoDraw: false,
    membersMargin: 10,
    width: 320,
    height: 1,
    disabled: !audioIsSupported,
    members: [
        isc.IButton.create({
            title: "Play",
            click : function () {
                audio.play();
            }
        }),
        isc.IButton.create({
            title: "Pause",
            click : function () {
                audio.pause();
            }
        }),
        isc.IButton.create({
            title: "Reset",
            click : function () {
                audio.pause();
                audio.reset();
            }
        })
    ]
});

isc.VStack.create({
    isGroup: true,
    groupTitle: "Audio Playback",
    width: 430,
    membersMargin: 10,
    layoutMargin: 20,
    defaultLayoutAlign: "center",
    members: [progressbar, hLayout]
});