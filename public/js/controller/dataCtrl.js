angular.module('app').controller('dataCtrl', function($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, dataSrv) {

    var gridApi;

    $scope.selectedArray = []
    console.log($scope.selectedArray)
        // $scope.row.entity.subGridOptions = {
        //     enableCellEditOnFocus: true,
        //     enableColumnResizing: true,
        //     enableFiltering: true,
        //     enableGridMenu: true,
        //     infiniteScrollRowsFromEnd: 25,
        //     infiniteScrollUp: true,
        //     infiniteScrollDown: true,
        //     enableRowSelection: true,
        //     multiSelect: false,
        //     onRegisterApi: function(gridApi) {
        //         let subgridApi = gridApi;
        //         subgridApi.selection.on.rowSelectionChanged($scope, function(row) {
        //             console.log("inner: ", row)
        //             if (row.isSelected) {
        //                 $scope.selectedArray = [row.entity.id]
        //             }
        //         })
        //     }
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
        onRegisterApi: function(gridApi) {
            gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log("outter: ", row)
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
        }

    };

    $scope.test = () => {
        console.log(document.getElementsByClassName('ui-grid-row-selected'))
    }

    $scope.receivePatients = () => {
        dataSrv.getPatients().then((response) => {
            $scope.gridOptions.data = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.receiveVisits(response.data[i].id, i)
            }
        })
    }
    $scope.receivePatients();

    $scope.receiveVisits = (id, i) => {
        dataSrv.getVisits(id).then((response) => {
            // response.data.map(e => {
            //     e['delete?'] = 'x'
            // })
            $scope.gridOptions.data[i].subGridOptions = {
                data: response.data
            };
        })
    };

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