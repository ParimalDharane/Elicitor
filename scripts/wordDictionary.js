/**
 * Elicitor Category Constants
 */
var EC_ANY              = 'ANY';
var EC_GOOD             = 'GOOD';
var EC_BAD              = 'BAD';
var EC_FUNNY            = 'FUNNY';
var EC_SPELLOUT         = 'SPELLOUT';
var STATE_ACTIVE        = 'active fa fa-check';

var eleWordDictionary = {};

var wordMap = [];

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function generateRandomIntNum(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    num = num === 0 ? min : num;
    return num;
}
function generateRandomNumber(max) {
    return Math.floor((Math.random() * max-1) + 1);
}

/**
 * Stores Single Word
 * @param inAcronym
 * @param inWord
 * @param inMeaning
 * @constructor
 */
function WordInfo(inAcronym, inWord, inMeaning) {
    this.acronym = inAcronym;
    this.word = inWord;
    this.meaning = inMeaning;
}
/**
 * Stores WordInfo List against an acronym
 * @param inAcronym
 * @constructor
 */
function AcroWordList(inAcronym) {
    this.acronym = inAcronym;
    this.wordArray = []; /* An Array of WordInfo */
}
/**
 * Stores AcroWordList against Category
 * @param inCategory
 * @constructor
 */
function CategoryWordList(inCategory) {
    this.category = inCategory;
    this.acroWordMap = []; /* Key=Acronym, Val=AcroWordList */
}
function WordDictionary() {
    this.wordListAny = new CategoryWordList(EC_ANY);
    this.wordListGood = new CategoryWordList(EC_GOOD);
    this.wordListBad = new CategoryWordList(EC_BAD);
    this.wordListFunny = new CategoryWordList(EC_FUNNY);
    this.wordListSpellout = new CategoryWordList(EC_SPELLOUT);
}
function addWordToAcroWordList(acroWordList, wordInfo) {
    acroWordList.push(wordInfo);
    /* TODO check for duplicate first beforing adding the wordInfo
    var found = acroWordList.contains(wordInfo);
    if(!found) {
        acroWordList.push(wordInfo);
    }
    */
}
function addWordToWordList(wordList, wordInfo) {
    var acroWordList = wordList.acroWordMap[wordInfo.acronym];
    if(!acroWordList) {
        acroWordList = new AcroWordList(wordInfo.acronym);
        wordList.acroWordMap[wordInfo.acronym] = acroWordList;
    }
    addWordToAcroWordList(acroWordList.wordArray, wordInfo);
}
function getWordListForCategory(inCategory) {
    var retWordList = null;
    if(inCategory === EC_GOOD) {
        retWordList = eleWordDictionary.wordListGood;
    } else if(inCategory === EC_BAD) {
        retWordList = eleWordDictionary.wordListBad;
    } else if(inCategory === EC_FUNNY) {
        retWordList = eleWordDictionary.wordListFunny;
    } else if(inCategory === EC_SPELLOUT) {
        retWordList = eleWordDictionary.wordListSpellout;
    } else if(inCategory === EC_ANY) {
        retWordList = eleWordDictionary.wordListAny;
    }
    return retWordList;
}
function getAcroWordListForAcronym(categoryWordList, acronym) {
    return categoryWordList.acroWordMap[acronym];
}
function getRandomWordFromAcroWordList(acroWordList) {
//    var randomIndex = 0; //TODO random
//    return acroWordList.wordArray[randomIndex];

    return acroWordList.wordArray[generateRandomNumber(acroWordList.wordArray.length)];

}
function addWord(inWord, inCategory, inMeaning) {
    if(!inWord) {
        console.warn(inWord, 'wordDictionary:addWord - the word is null');
        return;
    }
    if(!inCategory) {
        inCategory = EC_ANY;
    }
    if(!inMeaning) {
        inMeaning = '';
    }
    //Make it UPPER CASE
    inWord = inWord.toUpperCase();

    //Create a WordInfo
    var acronym = inWord[0];
    var wordInfo = new WordInfo(acronym, inWord, inMeaning);

    if(inCategory !== EC_ANY) {
        var wordList = getWordListForCategory(inCategory);
        addWordToWordList(wordList, wordInfo);
    }
    //add to common dictionary regardless of the category
    addWordToWordList(eleWordDictionary.wordListAny, wordInfo);
}
function initElicitorDictionary() {
    eleWordDictionary = new WordDictionary();
}
function getWordInfo(inAcronym, inCategory) {
    if(!inCategory) {
        inCategory = EC_ANY;
    }

    var wordList = getWordListForCategory(inCategory);

    var acroWordList = getAcroWordListForAcronym(wordList, inAcronym);

    var wordInfo = getRandomWordFromAcroWordList(acroWordList);

    return wordInfo;
}

function loadWords(wordList) {
    for(var i=0; i<wordList.length; i++) {
        var aWord = wordList[i];
        addWord(aWord.word, aWord.category, aWord.meaning);
    }
}
function loadTestWords() {
    addWord('SUPERB', EC_GOOD);
    addWord('SILLY', EC_FUNNY);
    addWord('IMMORTAL', EC_GOOD);
    addWord('YOYO', EC_GOOD);
    addWord('ACTIVE', EC_GOOD);
}