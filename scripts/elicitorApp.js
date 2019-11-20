'use strict';

var app = angular.module('elicitorApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap']);
/*

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
});
*/

app.config(['$routeProvider','$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider.
            when('/gen', {
                templateUrl: 'templates/ea-gen.html'
            }).
            when('/contribute', {
                templateUrl: 'templates/ea-contribute.html'
            }).
            otherwise({
                redirectTo: '/gen'
            });

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
]);

app.factory('EAWords', function($resource) {
//    return $resource('http://localhost:63342/Elicitor/webapp/data/words/1.json/:id', {id:"@id"});
    return $resource('/data/words/:id', {id:"@id"});
});

app.factory('Words', function($http, $q) {
    return {
        get: function() {
            return $http.get('data/userData/ea-words-test.json');
        },
        save: function(wordList) {
            $http.post('data/userData/ea-words-test.json', wordList, {
                transformRequest: [
                    function(data, headersGetter) {
                        for(var i=0; i<data.length; i++) {
                            var item = data[i];
                            item.updatedOn = new Date();
                        }
                        return data;
                    }
                ].concat($http.defaults.transformRequest)
            }).then(
                function(response) {
                    console.log(response, 'Save : success');
                },function(response) {
                    console.log(response, 'Save : error');
                }
            );
        }
    }
});

app.factory('DictionaryService', function($resource, $q) {

    var obj = { wordList: null };

    //Define class
//    var DictionaryWord = $resource('./data/ea-words.json');
    var DictionaryWord = $resource('./data/ea-words.json/:word', {word:'@id'}, {'save': {isArray: false/*true*/}});

    obj.load = function() {
        var deferObj = $q.defer();

        var words = DictionaryWord.query(function() {
            console.log('isside new DictionaryWord query .........');
            console.log(words, 'WordList');
            obj.wordList = words;

            var aWord = words[0];
//            expect(aWord instanceof DictionaryWord).toEqual(true);
            aWord.meaning = 'Adding meaning to word';

//            aWord.$save();

            deferObj.resolve(words);
        });
        console.log(obj.wordList, 'JUST AFTER new DictionaryWord query .........');
        return deferObj.promise;

/*
        var promiseData = $resource('./data/ea-words.json').query();

        promiseData.$promise.then(
            function(data) {
                obj.content = data;
                deferObj.resolve(data);
            }, function(reason) {
                console.warn(status, 'DictionaryService: Error while loading dictionary');
                deferObj.reject(status);
            }
        );
        return deferObj.promise;
*/
    };
    obj.save = function() {
        var deferObj = $q.defer();

        var promiseData = $resource('./data/ea-words.json').$save();

        promiseData.$promise.then(
            function(data) {
                obj.content = data;
                deferObj.resolve(data);
            }, function(reason) {
                console.warn(status, 'DictionaryService: Error while loading dictionary');
                deferObj.reject(status);
            }
        );
        return deferObj.promise;
    };

    return obj;
});
app.controller('elicitorAppCtrl', function($scope, $resource, DictionaryService, Words, EAWords) {
    $scope.activeGen = true;
    $scope.activeContribute = false;

    var pageHeaderHome = "Welcome to Elicitor";
    var pageDescHome = "Got bored posting the same wishes like 'Happy Birthday John', 'Happy Anniversary Ram'?" +
        " Here is a unique way. " +
        " 1. Just type 'name / lastname / any word' and hit the 'Generate' button" +
        " 2. Hit the generate button" +
        " 3. Copy the text and make your wish special";

    var pageHeaderContribute = "Contribute Word";
    var pageDescContribute = "Welcome to Word";

    $scope.currentPageHeader = pageHeaderHome;
    $scope.currentPageDesc = pageDescHome;

    $scope.onChangeMainMenu = function(menu) {
        console.log(menu, 'onChangeMainMenu .. menu');
        $scope.activeGen = false;
        $scope.activeContribute = false;

        if(menu === 'activeContribute') {
            $scope.activeContribute = true;
            $scope.currentPageHeader = pageHeaderContribute;
            $scope.currentPageDesc = currentPageDesc;
        } else {
            $scope.activeGen = true;
            $scope.currentPageHeader = pageHeaderHome;
            $scope.currentPageDesc = pageDescHome;
        }
    };
    var loadDataUsingEAWords = function() {
        $scope.wordList = {};
        EAWords.query().$promise.then(function(data) {
            $scope.wordList = data;
            console.log($scope.wordList, 'loadDataUsingEAWords wordList');
        });
    };
/*
    var loadDataUsingWords = function() {
        $scope.wordList = {};
        Words.get().success(function(data) {
            $scope.wordList = data;
            console.log($scope.wordList, 'loadDataUsingWords wordList');
        });
    };
*/
    $scope.saveTestData = function() {
//        $scope.wordList.push({ "word": "NEW", "category": "BAD", "meaning": "Added for testing" })
        var aWord = $scope.wordList[0];
        console.log(aWord, 'saveTestData wordList before  ');
        aWord.category = "BAD";
        console.log(aWord, 'saveTestData wordList after  ');

        aWord.$save();
    };
/*
    $scope.saveTestData = function() {
        $scope.wordList.push({ "word": "NEW", "category": "BAD", "meaning": "Added for testing" })
        console.log($scope.wordList, 'loadDataUsingWords wordList after adding NEW');

        Words.save($scope.wordList);
    };
*/
    var loadData = function() {
        var dictionary = DictionaryService;
        var promiseData = dictionary.load();

        promiseData.then(
            function(data) {
                console.log(dictionary, 'Dictionary loaded');
                loadWords(dictionary.wordList);

            }, function(reason) {
            }
        );
    };
    //INIT
    initElicitorDictionary();
    loadData();
//    loadDataUsingWords();
//    loadDataUsingEAWords();
//    loadTestWords();

});
