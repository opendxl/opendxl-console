var browserSupportsDataURLs = !(isc.Browser.isIE && isc.Browser.version < 8);

isc.FacetChart.create({
    ID: "multiSeriesChart",
    title: "Revenue",
    facets: [{
        id: "time",
        title: "Period"
    },{
        id: "region",
        title: "Region"
    }],
    minWidth: 360,
    maxWidth: 860,
    minHeight: 180,
    maxHeight: 670,
    data: data,
    valueProperty: "value",
    chartType: "Area",
    canDragResize: true,
    dragResizeAppearance: "outline",
    showEdges: true
});

var downloadForm = isc.DynamicForm.create({
    autoDraw: false,
    topPadding: 5,
    width: "100%",
    numCols: 2,
    items: [{
        name: "format",
        type: "select",
        title: "Export format",
        valueMap: {
            "png": "PNG",
            "jpeg": "JPEG"
        },
        required: true,
        defaultValue: "png",
        redrawOnChange: true
    }, {
        name: "quality",
        type: "integer",
        title: "JPEG quality",
        editorType: "SliderItem",
        minValue: 0,
        maxValue: 100,
        numValues: 21,
        defaultValue: 80,
        showIf: "form.getValue('format') == 'jpeg'",
        titleVAlign: "top",
        colSpan: 2,
        height: 50,
        required: true
    }, {
        title: "Download as Image",
        autoFit: true,
        type: "button",

        click : function (form) {
            var format = form.getValue("format");
            isc.RPCManager.exportImage(multiSeriesChart.getSvgString(), {
                exportDisplay: "download",
                exportImageFormat: format,
                exportImageQuality: form.getValue("quality") / 100,
                exportFilename: "Revenue"
            });
        }
    }]
});

isc.VLayout.create({
    ID: "imageExportSideLayout",
    width: 250,
    membersMargin: 20,
    members: [
        downloadForm,

        isc.IButton.create({
            ID: "getDataURLButton",
            title: "Get PNG Data URL",
            autoFit: true,
            click : function () {
                if (!browserSupportsDataURLs) {
                    isc.say("This feature is not supported in IE 6 or 7.");
                    return;
                }

                var getDataURLRes = multiSeriesChart.getDataURL(function (dataURL) {
                    if (getDataURLRes == null) {
                        isc.clearPrompt();
                    }

                    if (isc.Browser.isIE && isc.Browser.version < 9 && dataURL.length > 32768) {
                        isc.say("A data URL was generated, but it cannot be displayed in Internet Explorer 8 because it is longer than the 32 KiB limit." +
                                "<p>See the <a href='http://msdn.microsoft.com/en-us/library/ie/cc848897.aspx' target='_blank'><code>data</code> Protocol</a> page on MSDN for more information.");
                    } else {
                        snapshotImg.setSrc(dataURL);
                    }
                }, "png");
                if (getDataURLRes == null) {
                    isc.showPrompt("${loadingImage} The chart is being converted to an image.", { title: "Loading" });
                }
            }
        }),
        isc.Img.create({
            ID: "snapshotImg",
            border: "3px solid blue",
            width: 200,
            height: 150
        })
    ]
});

if (!browserSupportsDataURLs) {
    getDataURLButton.disable();
    snapshotImg.hide();
}

// Overall layout
isc.HLayout.create({
    ID: "pngChartExportLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        multiSeriesChart,
        imageExportSideLayout
    ]
});
