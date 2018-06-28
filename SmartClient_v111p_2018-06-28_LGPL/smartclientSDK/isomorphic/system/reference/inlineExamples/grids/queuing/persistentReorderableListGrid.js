// Implements a data structure called a deque, or double-ended queue.
//
// This is used by the sample to permute the userOrders of dropped records.
//
// See:  http://en.wikipedia.org/wiki/Deque
isc.ClassFactory.defineClass("Deque").addProperties({
    store : [],
    isEmpty : function () {
        return this.store.length == 0;
    },
    getLength : function () {
        return this.store.length;
    },
    pushFront : function (element) {
        this.store.push(element);
    },
    popFront : function () {
        return this.store.pop();
    },
    pushBack : function (element) {
        this.store.unshift(element);
    },
    popBack : function () {
        return this.store.shift();
    }
});

isc.ListGrid.create({
    width: "100%",
    height: 400,
    dataSource: "employees",
    autoFetchData: true, // Fetch the data from `employees` on page load.
    autoSaveEdits: true,
    canEdit: true,
    canGroupBy: false,
    canReorderRecords: true,
    canSort: false, // Disable user sorting because we rely on records being sorted by userOrder.
    sortField: "userOrder",

    recordDrop : function (draggedRecords, targetRecord, targetIndex, sourceWidget) {
        if (this == sourceWidget && draggedRecords.getLength() > 0) {
            draggedRecords.sort(function (lhs, rhs) {
                return (lhs.userOrder - rhs.userOrder);
            });

            var data = this.data;

            // Compute the range of records that need to be updated as all records at `minIndex`
            // through `maxIndex`, inclusive.
            var draggedIndices = draggedRecords.map(function (draggedRecord) {
                return data.findIndex("EmployeeId", draggedRecord.EmployeeId);
            });
            var minIndex = Math.min(draggedIndices.min(), targetIndex);
            var maxIndex = Math.max(draggedIndices.max(), targetIndex - 1);

            // Start the queue.
            isc.RPCManager.startQueue();

            var ds = isc.DS.get(this.dataSource);
            var request = {
                operation: this.updateOperation,
                application: this.application,
                // `oldValues` is optional, but supplying it with the request allows the server
                // to detect concurrent edits.
                oldValues: {}
            };

            // We need to update the userOrders of all records in [`minIndex`, `maxIndex`].
            // To do this, we utilize a deque.

            // First consider the records in [`minIndex`, `targetIndex`).  For each record in
            // this range, we push the userOrder of the record to the back of the deque and if
            // the record was *not* a dragged record, then we update its userOrder to the value
            // popped from the front of the deque. The deque's size at the end of that loop is
            // exactly the number of dragged records that were before the target record,
            // `numDraggedRecordsBeforeTargetIndex`.  Furthermore, the deque contains the
            // userOrder values that need to be assigned to the first
            // `numDraggedRecordsBeforeTargetIndex` dragged records, so we empty the deque and
            // update the userOrder values of those dragged records accordingly.

            // This same algorithm can be used in reverse to handle the records at and after
            // the target record, but we instead simplify the code with an observation:
            // instead of thinking about the dragged records at and after the target record as
            // the dragged records, treat the *non-dragged* records at and after the target
            // record as the dragged records being dragged to `maxIndex`.  Then we do not need
            // to use the reverse algorithm to process the affected records at and after the
            // target record.

            var deque = isc.Deque.create();

            // The purpose of `prevUserOrder` is to give each record a unique userOrder even
            // if the assumption that records have unique userOrders does not hold.
            // Other Feature Explorer samples utilize the employees.userOrder field and may break
            // this invariant.
            var prevUserOrder = -1;
            if (minIndex > 0) {
                var record = data.get(minIndex - 1);
                prevUserOrder = record.userOrder;
            }

            var updateUserOrders = function (minIndex, targetIndex, draggedIndices) {
                var i;
                for (i = minIndex; i < targetIndex; ++i) {
                    var record = data.get(i);
                    deque.pushBack(record.userOrder);
                    if (!draggedIndices.contains(i)) {
                        var newUserOrder = Math.max(deque.popFront(), prevUserOrder + 1);
                        var updates = {
                            EmployeeId: record.EmployeeId,
                            userOrder: newUserOrder
                        };
                        request.oldValues.userOrder = record.userOrder;
                        record.userOrder = updates.userOrder; // Update the record's userOrder to
                                                              // what it will be set to.
                        prevUserOrder = newUserOrder;
                        ds.updateData(updates, null, request);
                    }
                }

                // Empty the deque.
                var numDraggedRecordsBeforeTargetIndex = deque.getLength();
                for (var j = 0; !deque.isEmpty(); ++j) {
                    var record = data.get(draggedIndices[j]);
                    var newUserOrder = Math.max(deque.popFront(), prevUserOrder + 1);
                    var updates = {
                        EmployeeId: record.EmployeeId,
                        userOrder: newUserOrder
                    };
                    request.oldValues.userOrder = record.userOrder;
                    record.userOrder = updates.userOrder; // Update the record's userOrder to
                                                          // what it will be set to.
                    prevUserOrder = newUserOrder;
                    ds.updateData(updates, null, request);
                }
            };

            updateUserOrders(minIndex, targetIndex, draggedIndices);

            var nonDraggedIndices = new Array();
            for (var i = targetIndex; i <= maxIndex; ++i) {
                if (!draggedIndices.contains(i)) {
                    nonDraggedIndices.push(i);
                }
            }

            updateUserOrders(targetIndex, maxIndex + 1, nonDraggedIndices);

            // Send the queue.
            isc.RPCManager.sendQueue();
        }

        // Call the super implementation of recordDrop() to update the order of rows in the ListGrid.
        this.Super("recordDrop", arguments);
    }
});
