'use strict';

pointyApp.controller('PatientController', ['$scope', 'PatientService', '$routeParams',

function PatientController($scope, PatientService, $routeParams) {
    $scope.showFeedback = false;

    $scope.savePatient = function(patient, form) {
        console.log(patient);

        if (form.$valid) {
            var aPromise = PatientService.save(patient);
            aPromise.then(function(object) {
                patient.id = object.id;
                showAlert("success", "Patient registered successfully!");
            }, function errorCallback(error) {
                showAlert("error", error);
            });
        } else {
            showAlert("error", "Invalid form: " + form);
        }
    };

    $scope.listPatients = function() {
        PatientService.list().then(function(o) {
            $scope.patientList = o;
            if (o.length == 0) {
                showAlert("warning", "No patients registered!");
            } else {
                showAlert("info", "Found " + o.length + " patients!");
            }
        }, function(e) {
            showAlert("error", e);
        });
    };

    $scope.patientDetail = function() {
        if ($routeParams != undefined && $routeParams.patientId != undefined) {
            PatientService.patientDetail($routeParams.patientId).then(function(object) {
                $scope.patient = object;
            }, function(e) {
                showAlert("error", "Error retrieving patient " + e);
            });
        }
    };

    $scope.deletePatient = function() {
        if ($routeParams != undefined && $routeParams.patientId != undefined) {
            PatientService.deletePatient($routeParams.patientId).get().then(function(object) {
                $scope.patient = {};
                showAlert("info", "Deleted patient with Id: " + $routeParams.patientId);
            }, function(e) {
                showAlert("error", "Error deleting patient. " + e);
            });
        }
    };

    /**
     * Clear the patient object
     */
    $scope.newPatient = function(patient) {
        $scope.patient = {};
        this.closeAlert();
    };

    $scope.closeAlert = function() {
        $scope.showFeedback = false;
    };

    function showAlert(type, message) {
        $scope.status = message;
        $scope.showFeedback = "true";
        $scope.alertType = type;
    }
}

]);