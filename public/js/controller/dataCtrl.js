angular.module('app').controller('dataCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv, $window) {

    var gridApi;

    $scope.selectedArray = []
        // $scope.selectedSubArray = []
    console.log($scope.selectedArray)

    // window.onclick = (event) => {
    //     var test = document.getElementsByClassName('ui-grid-row')
    //     console.log(test)
    // }


    $scope.gridOptions = {
        enableCellEditOnFocus: true,
        enableColumnResizing: true,
        enableFiltering: true,
        enableGridMenu: true,
        infiniteScrollRowsFromEnd: 25,
        infiniteScrollUp: true,
        infiniteScrollDown: true,
        enableRowSelection: true,
        multiSelect: false,
        expandableRowTemplate: './views/expandableRow.html',
        expandableRowHeight: 150,
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        },
        onRegisterApi: function(gridApi) {
            // console.log($scope.subGridVariable)
            gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                // console.log("outter: ", row)
                if (row.isSelected) {
                    $scope.selectedArray = [row.entity.id]
                }
            })

            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log(rowEntity, 'row')
                console.log(colDef, 'your')
                console.log(newValue, 'boat')
                console.log(oldValue, 'ok')
                dataSrv.changePatient(rowEntity);
            })

            $scope.receivePatients = () => {
                dataSrv.getPatients().then((response) => {
                    $scope.gridOptions.data = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.receiveVisits(response.data[i].id, i)
                    }
                })
            }
            $scope.receivePatients();

            $scope.test = () => {
                alert('ehy')
                console.log(document.getElementsByClassName("'ui-grid-row-selected': row.isSelected"))
            }

            $scope.subGridScope = {
                clickMeSub: function() {
                    // console.log($event.target.parentElement.parentElement)
                    console.log(this)
                        // alert('hi', $event);
                }
            };

            $scope.receiveVisits = (id, i) => {
                dataSrv.getVisits(id).then((response) => {
                    // response.data.map(e => {
                    //     e['delete?'] = 'x'
                    // })

                    $scope.gridOptions.data[i].subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        columnDefs: [
                            { name: 'id', cellTemplate: `<button class="btn primary" ng-click="grid.appScope.clickMeSub()">Click Me</button>` },

                            { name: 'visit_id', enableCellEdit: false },
                            { name: 'date' },
                            { name: 'area_hurt' },
                            { name: 'reason' },
                            { name: 'prescription' },
                            { name: 'followup' },
                            { name: 'notes' }
                        ],
                        data: response.data
                    };
                })
            };

            // gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            //         if (row.isExpanded) {
            //             row.entity.subGridOptions = {
            //                 columnDefs: [
            //                     { name: 'Visit_id' },
            //                     { name: 'Date' },
            //                     { name: 'Area_hurt' },
            //                     { name: 'Reason' },
            //                     { name: 'Prescription' },
            //                     { name: 'Followup' },
            //                     { name: 'Notes' }
            //                 ]
            //             }

            //             let data = []
            //             for (let i = 0; i < $scope.gridOptions.data; i++) {
            //                 data.push($scope.gridOptions.data[i].subGridOptions.data)
            //             }
            //             console.log(data)
            //             row.entity.subGridOptions.data = data;
            //             console.log(row.entity.subGridOptions, 'subgrid')
            //         }
            //     })
            // gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            //     console.log(document.getElementsByClassName("'ui-grid-row-selected': row.isSelected"))
            //     console.log(row.isSelected)
            //     console.log(row.entity.subGridOptions)
            // })

        }

    };





    // $scope.receivePatients = () => {
    //     dataSrv.getPatients().then((response) => {
    //         $scope.gridOptions.data = response.data;
    //         for (var i = 0; i < response.data.length; i++) {
    //             $scope.receiveVisits(response.data[i].id, i)
    //         }
    //     })
    // }
    // $scope.receivePatients();

    // $scope.receiveVisits = (id, i) => {
    //     dataSrv.getVisits(id).then((response) => {
    //         // response.data.map(e => {
    //         //     e['delete?'] = 'x'
    //         // })
    //         $scope.gridOptions.data[i].subGridOptions = {
    //             data: response.data
    //         };
    //     })
    // };

    // const deleteCell = document.getElementsByClassName('ui-grid-coluiGrid-0093');
    // const deleteVisitFn = () => {
    //     alert('This works')
    // }
    // console.log(deleteCell)
    // deleteCell.map(e => {
    //     e.addEventListener('click', deleteVisitFn)
    // })

    $scope.addPatient = () => {
        dataSrv.addNewPatient().then((response) => {})
        $scope.receivePatients();
    };

    $scope.addVisit = (id) => {
        dataSrv.addNewVisit(id[0]).then((response) => {})
        $scope.receivePatients();
    };


    $scope.removePatient = (id) => {
        dataSrv.removePatient(id[0]).then((response) => {})
        $scope.receivePatients();
    };




    $scope.toggleFilterRow = function() {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };



});