'use strict';

var app = angular.module('elicitorApp');

function ResultDataItem(inAcr, inWord, inMeaning) {
    this.acronym = inAcr;
    this.word = inWord;
    this.meaning = inMeaning;
}

app.directive('acronymInputForm', function(DictionaryService) {
        return {
            restrict: 'EA',
            link: function (scope, elm, attrs) {
                scope.testVar = "Testing variable";

                scope.categoryList = [];

                scope.userData = {};
                scope.userData.word = '';
                scope.userData.category = '';


                scope.resultData = [];

                function Category(inCaption, inCode, inCssClass, inState) {
                    this.caption = inCaption;
                    this.code = inCode;
                    this.cssClass = inCssClass;
                    this.state = (inState) ? inState : '';
                }
                scope.doGenerateElicite = function() {
                    var inputStr = scope.userData.word;
                    if(!inputStr) {
                        return;
                    }
                    inputStr = inputStr.toUpperCase();
                    var inputCategory = scope.userData.category;
                    console.log('acronymInputForm:doGenerateElicite  userData.word=' + inputStr);



                    //Validate input
                    //Split it with SPACE character
                    //Browse through each character in a word, do this for all words

                    var STR_SPACE = " ";
                    var wordList = inputStr.split(STR_SPACE);
                    console.log(wordList, 'List of words');

                    scope.resultData = [];
                    var wordIndex = '';
                    for(wordIndex in wordList) {
                        var aWord = wordList[wordIndex];
                        console.log('aWord=' + aWord);

                        for(var charIndex=0; charIndex<aWord.length; charIndex++) {
                            var acronym = aWord[charIndex];
                            console.log('     L...> aChar=' + acronym);
                            var wordInfo = getWordInfo(acronym, inputCategory);
                            console.log('     L...> aWord=' + wordInfo.word);

                            var resultDataItem = new ResultDataItem(acronym, wordInfo.word, '');
                            scope.resultData.push(resultDataItem);
                        }
                    }
                };
                scope.onInputCategory = function(code) {
                    scope.userData.category = code;

                    scope.categoryList[EC_ANY].state = '';
//                    scope.categoryList[EC_GOOD].state = '';
//                    scope.categoryList[EC_BAD].state = '';
//                    scope.categoryList[EC_FUNNY].state = '';
                    scope.categoryList[EC_SPELLOUT].state = '';

                    scope.categoryList[code].state = STATE_ACTIVE;
                };
                var init = function() {
                    scope.categoryList[EC_ANY] = new Category('Any', EC_ANY, 'label-default', STATE_ACTIVE);
                    scope.categoryList[EC_GOOD] = new Category('Good', EC_GOOD, 'label-primary');
                    scope.categoryList[EC_BAD] = new Category('Bad', EC_BAD, 'label-danger');
                    scope.categoryList[EC_FUNNY] = new Category('Funny', EC_FUNNY, 'label-info');
                    scope.categoryList[EC_SPELLOUT] = new Category('Spell Out', EC_SPELLOUT, 'label-warning');
                };
                init();
            },
            templateUrl: 'scripts/acronymInput.html'
        }
    }
);

