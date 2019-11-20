'use strict';

var app = angular.module('elicitorApp');

app.directive('eaDictionaryMaint', function(DictionaryService) {
        return {
            restrict: 'EA',
            link: function (scope, elm, attrs) {
                scope.testVar2 = "Testing variable from eaDictionaryMaint";

                scope.doSubmitWord = function(dictionaryData) {
                    console.log(dictionaryData, 'eaDictionaryMaint:doSubmitWord word-data');
                    if(dictionaryData) {
                        DictionaryService.save(dictionaryData);
                    }
                };

                var init = function() {
                };
                init();
            },
            templateUrl: 'scripts/eaDictionaryMaint.html'
        }
    }
);

