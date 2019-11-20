'use strict';

var app = angular.module('app', []);

app.controller('MyCtrl', function($scope, $window) {


    $scope.colorList = ['Red', 'Orange', 'Blue', 'White', 'Black', 'Green', 'Purple', 'Gray', 'Brown'];

});
