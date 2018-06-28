isc.Slider.create({
    ID: "vSlider",
    minValue: 1,
    maxValue: 5,
    numValues: 5,
    title: "Rating",
    valueChanged : function (value) {
        if (!window.hSlider) return;
        if (hSlider.getValue() != value) hSlider.setValue(value);
    }
});

isc.Slider.create({
    ID: "hSlider",
    vertical: false,
    top: 240,
    left: 100,
    minValue: 1,
    maxValue: 5,
    numValues: 5,
    title: "Rating",
    valueChanged : function (value) {
        if (!window.vSlider) return;
        if (vSlider.getValue() != value) vSlider.setValue(value)
    }
});
