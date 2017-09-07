var fs = require("fs");
var cmudictFile = readFile('./cmudict.txt'); //grabs raw dictionary data, function listed below
var splitLines = []; //result of formatData, each line is an array with the word and its dissection
var dictObj = {}; //result of countSyllables(), an object with whole dictionary using syllables as keys
var macBethText = readFile('./macbeth.txt');


//grabs raw data from file
function readFile(file){
  return fs.readFileSync(file).toString();
}

//splits data into individual lines
function formatData(data){    
   var lines = data.toString().split("\n"),
       lineSplit
   lines.forEach(function(line){
    lineSplit = line.split("  ");
    splitLines.push(lineSplit);
  });   
}

//creates object with number of syllables as keys and corresponding array of words
function countSyllables(linesArr){
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
}

//generates random number based on parameters
function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//prints haiku to console
function createHaiku(structureArr, obj){
    structureArr.forEach(function(line){
        let lineArr = [];
        line.forEach(function(syllableCount){
            let randomNumber = randomInt(1, obj[syllableCount].length);
            lineArr.push(obj[syllableCount][randomNumber]);
        })
        console.log(lineArr.join(' '));
    })
}

formatData(cmudictFile);
countSyllables(splitLines);
createHaiku([[5],[7],[5]], dictObj);