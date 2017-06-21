angular.module('app').controller('addPatientCtrl', function($scope, addPatientSrv) {
    $scope.submitPatient = function(patient) {
        addPatientSrv.addPatient(patient).then((response) => {
            if (!response) {
                alert('Try Again')
            }
            $state.go('home');
        })
    }
})