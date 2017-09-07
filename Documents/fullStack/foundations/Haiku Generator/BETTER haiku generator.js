var fs = require("fs");
let cmudictFile = readFile('./cmudict.txt');
let simpsons = readFile('./simpsons.txt');
let bible = readFile('./bible.txt');
let wordsOnlyText = removeEverythingExceptWords(simpsons); //PLUG IN DIFFERENT TEXT HERE, e.g. simpsons, bible
let splitLines = formatData(cmudictFile);
let dictObjSyllableKeys = countSyllables(splitLines);
let dictObjWordKeys = reverseKeyValuePairs(dictObjSyllableKeys);
let markovText = markovize(wordsOnlyText);
let haiku = createHaiku(wordsOnlyText, dictObjWordKeys, markovText);
console.log(haiku);

//grabs raw data from file
function readFile(file){
  return fs.readFileSync(file).toString();
}

//splits data into individual lines
function formatData(data){
    var arr = [];
    var lines = data.toString().split("\n"), lineSplit
    lines.forEach(function(line){
        lineSplit = line.split("  ");
        arr.push(lineSplit);
    });
  return arr;
}

//creates object with number of syllables as keys and corresponding array of words
function countSyllables(linesArr){
    let dictObj = {}
    linesArr.forEach(function(line){
        if (line[1]) {
            let parsedWord = line[1].toString();
            let syllables = parsedWord.replace(/[^0-9]/g,"").length
            let word = line[0];
            if (word[word.length-1] !== ')'){
                if (!dictObj[syllables]) dictObj[syllables] = [line[0]];
                else dictObj[syllables].push(line[0]);
            }
        }
    })
    return dictObj;
}

//generates random number based on parameters
function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//creates objects with words as key and syllables as value
function reverseKeyValuePairs(obj){
    let returnObj = {};
    for (key in obj){
        obj[key].forEach(function(value){
            returnObj[value] = key;
        })
    }
    return returnObj;
}

//does what it says
function removeEverythingExceptWords(str){
    let returnStr = '';
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    alphabet += alphabet.toUpperCase() + " '";
    for (let i = 0; i<str.length; i++){
      if(alphabet.includes(str[i])) returnStr += str[i].toUpperCase();
    }
    return returnStr;
  }

//finds lines that match target syllable number
function findLinesinText(text, obj, targetSyllNum){
    let returnLine = '', returnArr = [];
    let textArr = text.split(' ')
    
    for (let i = 0; i < textArr.length; i++){
      let count = 0, currentLineArr = [];
      for (let j = 0; j < 5; j++){
        if (count === targetSyllNum){
          returnLine += currentLineArr.join(' ');
          returnArr.push(returnLine);
          returnLine = '';
          break;
        }
        let word = textArr[i+j];
        if (word){
          word = word.toUpperCase();
          if (obj[word]){
            count += Number(obj[word]);
            currentLineArr.push(word);
          }
        }
      }
    }
  return returnArr;
}

//returns markov chain object
function markovize(str){
    let newStr = removeEverythingExceptWords(str);
    let strArr = newStr.split(' ');
    let returnObj = {};
    strArr.forEach(function(word, i){
      if (returnObj[word.toUpperCase()] === undefined && strArr[i+1] !== undefined && strArr[i+1] !== ''){
        returnObj[word.toUpperCase()] = [strArr[i+1].toUpperCase()];
      } else if (strArr[i+1] !== undefined && strArr[i+1] !== ''){
        returnObj[word.toUpperCase()].push(strArr[i+1].toUpperCase());
      }
    });
    return returnObj;
  }

  //returns array of lines with first word as key
  function getLineKeys(strArr){
    let returnObj = {};
    strArr.forEach(function(line){
      let lineArr = line.split(' ');
      if (returnObj[lineArr[0]] === undefined){
        returnObj[lineArr[0]] = [line];
      } else returnObj[lineArr[0]].push(line);
    });
    return returnObj;
  }

// //returns haiku
function createHaiku(text, obj, markovObj){
    let haikuArr = [];
    let nextWord, lineTwo, lineThree;
    let fiveLineArr = findLinesinText(text, obj, 5);
    let fiveLineObj = getLineKeys(fiveLineArr);
    let sevenLineArr = findLinesinText(text, obj, 7);
    let sevenLineObj = getLineKeys(sevenLineArr);
    let lineOne = (fiveLineArr[randomInt(0, fiveLineArr.length-1)]);

    //uses markov chain to start next line of haiku with a word that chains from the last word of the previous line
    //if no line fits criteria, a random line is generated
    let lineArr = lineOne.split(' ');
    let lastWord = lineArr[lineArr.length-1].toUpperCase();
    if (markovObj[lastWord]){
        nextWord = markovObj[lastWord][randomInt(0, markovObj[lastWord].length-1)];
        if (sevenLineObj[nextWord]){
            lineTwo = sevenLineObj[nextWord][randomInt(0, sevenLineObj[nextWord].length-1)]
        } else lineTwo = sevenLineArr[randomInt(0, sevenLineArr.length-1)];
    } else lineTwo = sevenLineArr[randomInt(0, sevenLineArr.length-1)];

    //same process as line 2
    lineArr = lineTwo.split(' ');
    lastWord = lineArr[lineArr.length-1].toUpperCase();
    if (markovObj[lastWord]){
        nextWord = markovObj[lastWord][randomInt(0, markovObj[lastWord].length-1)];
        if (fiveLineObj[nextWord]){
            lineThree = fiveLineObj[nextWord][randomInt(0, fiveLineObj[nextWord].length-1)]
        } else lineThree = fiveLineArr[randomInt(0, fiveLineArr.length-1)];
    } else lineThree = fiveLineArr[randomInt(0, fiveLineArr.length-1)];

    haikuArr.push(lineOne);
    haikuArr.push(lineTwo);
    haikuArr.push(lineThree);
    return haikuArr.join('\n');
}