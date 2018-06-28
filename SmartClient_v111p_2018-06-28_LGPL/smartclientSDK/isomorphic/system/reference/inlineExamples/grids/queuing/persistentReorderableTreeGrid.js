isc.TreeGrid.create({
    width: 430,
    height: 400,
    dataSource: "employees",
    autoFetchData: true,
    autoSaveEdits: true,
    canAcceptDroppedRecords: true,
    canDragRecordsOut: true,
    canEdit: true,
    canReorderRecords: true,
    canReparentNodes: true,
    canSort: false,
    nodeIcon: "icons/16/person.png",
    folderIcon: "icons/16/person.png",
    showOpenIcons: false,
    showDropIcons: true,
    dropIconSuffix: "into",
    closedIconSuffix: "",
    dragDataAction: "move",
    sortField: "userOrder",
    fields: [
        {
            name: "EmployeeId",
            title: "ID",
            width: "15%"
        },
        {
            name: "Name",
            formatCellValue : function (value, record) {
                return value + "&nbsp;-&nbsp;" + record.Job;
            },
            treeField: true
        }
    ],

    folderDrop : function (draggedNodes, folder, targetIndex, sourceWidget) {
        var draggedNodes_length = draggedNodes.getLength();
        if (this == sourceWidget && draggedNodes_length > 0) {
            var folderChildren = folder.children;

            isc.RPCManager.startQueue();

            var ds = isc.DS.get(this.dataSource);
            var request = {
                operation: this.updateOperation,
                application: this.application,
                // `oldValues` is optional, but supplying it with the request allows the server
                // to detect concurrent edits.
                oldValues: {}
            };

            var numDraggedNodesBeforeTargetIndex = 0;
            for (var ri = draggedNodes_length; ri > 0; --ri) {
                var draggedNode = draggedNodes.get(ri - 1);
                var pos = folderChildren.findIndex("EmployeeId", draggedNode.EmployeeId);
                if (pos >= 0) {
                    folderChildren.removeAt(pos);
                    if (pos < targetIndex) {
                        numDraggedNodesBeforeTargetIndex++;
                    }
                    folderChildren.addAt(draggedNode, targetIndex - numDraggedNodesBeforeTargetIndex);
                }
            }
            
            // Assign the correct index to any nodes that were not already children of the target folder
            var numDraggedNodesNotInTargetFolder = 0;
            for (var ri = 0; ri < draggedNodes_length; ri++) {
                var draggedNode = draggedNodes.get(ri);
                var pos = folderChildren.findIndex("EmployeeId", draggedNode.EmployeeId);
                if (pos == -1) {
                    draggedNode.userOrder = (targetIndex + ri) - numDraggedNodesBeforeTargetIndex;
                    numDraggedNodesNotInTargetFolder++;
                }
            }

                
            // Update the userOrder field of all children of `folder`.
            var folderChildren_length = folderChildren.getLength();
            for (var i = 0; i < folderChildren_length; ++i) {
                var node = folderChildren.get(i);
                var updates = {
                    EmployeeId: node.EmployeeId,
                    ReportsTo: folder.EmployeeId,
                    userOrder: i < targetIndex ? i : i + numDraggedNodesNotInTargetFolder
                };
                request.oldValues.ReportsTo = node.ReportsTo;
                request.oldValues.userOrder = node.userOrder;
                node.ReportsTo = folder.EmployeeId;
                node.userOrder = i < targetIndex ? i : i + numDraggedNodesNotInTargetFolder;
                ds.updateData(updates, null, request);
            }

            isc.RPCManager.sendQueue();
        }

        this.Super("folderDrop", arguments);
    }
});
