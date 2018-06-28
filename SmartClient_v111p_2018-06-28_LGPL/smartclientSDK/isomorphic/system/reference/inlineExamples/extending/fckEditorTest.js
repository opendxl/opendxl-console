
// Define dynamic text edit control based upon FCKeditor, a Javascript-based rich text edit control
isc.defineClass("DynTextEdit","Canvas").addProperties({
  overflow: "visible",
  canDragResize: true,
  redrawOnResize:true,
  zIndex:0,
  getInnerHTML : function () {
	  return "<textarea STYLE='width:100%;height:100%' ID=" + this.getID() + "_ta></textarea>";
  },
  redrawOnResize:false,

  draw : function() {
      this.Super("draw",arguments);			
      this.loadEditor();
      return this;
  },
		
  loadEditor: function() {
      if (this.oFCKeditor == null) {
          this.oFCKeditor = new FCKeditor(this.getID() + "_ta");  // create an FCKeditor control for this Canvas
          this.oFCKeditor.BasePath = "/fckeditor/";
          this.oFCKeditor.Height = "100%";
          this.oFCKeditor.Width = "100%";
          this.oFCKeditor.Config['ToolbarLocation'] = 'In';
          //this.oFCKeditor.ToolbarSet = 'Basic';
          this.oFCKeditor.Value = 'This is some EMBEDDED FCKeditor <strong>sample text in SmartClient!</strong>';  // hard-coded text for testing
          this.oFCKeditor.ReplaceTextarea();
      }
  }

});

isc.defineClass("DynTextItem","CanvasItem").addProperties({
        _createCanvas : function () {
            this.canvas = {
                _constructor: "DynTextEdit",
                height: this.height,
                width: this.width
            };
            this.Super("_createCanvas", arguments);  
        }
});

isc.DynamicForm.create({
        showEdges:true,
        ID:"exampleForm",
        height:400, width:600,
        fields: [
            {name:"firstName", title:"First Name"},
            {name:"lastName", title:"Last Name"},
            {name:"descripton", title:"Describe yourself below", editorType:"DynTextItem", height:400, width:600, colSpan:2, titleOrientation:"top"}
        ]
});

