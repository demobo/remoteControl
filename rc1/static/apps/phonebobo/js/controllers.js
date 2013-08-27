'use strict';

/* Controllers */

function PhoneListCtrl($scope, $http) {
  $http.get('phones/phones.json').success(function(data) {
    $scope.phones = data;
  });

  $scope.orderProp = 'age';
}

//PhoneListCtrl.$inject = ['$scope', '$http'];

function MicrodataListController($scope, phoneService) {
  $scope.source = {};
  $scope.origin = {};
  $scope.microdatas = [];
}

MicrodataListController.$inject = ['$scope','phoneService'];


