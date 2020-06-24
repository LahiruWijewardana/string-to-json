const Path = require('path');
const Customlog = require('../helpers/Customlog');

const LOGGER = new Customlog(Path.basename(__filename));

/*
* Return array of index values in string that contain specified charactor
*/
const charOccurrencesFinder = async (valueString, findingChar) => {
  try {
    const occurrenceArray = [];

    let startIndex = 0;
    while (valueString.indexOf(findingChar, startIndex) !== -1) {
      const occurrenceIndex = valueString.indexOf(findingChar, startIndex);
      occurrenceArray.push(occurrenceIndex);

      startIndex = occurrenceIndex + 1;
    }

    return occurrenceArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const getClosingBracketIndexOfMainObject = async (separatedString) => {
  try {
    const allOpenIndexes = await charOccurrencesFinder(separatedString, '{');
    const allCloseIndexes = await charOccurrencesFinder(separatedString, '}');

    let closeIndexHasNoOpen = 0;
    let closeIndexCounter = 0;
    while (true) {
      closeIndexHasNoOpen = allCloseIndexes[closeIndexCounter];

      const lowestOpenOccurrence = allOpenIndexes.findIndex(element => element < closeIndexHasNoOpen);
      if (lowestOpenOccurrence === -1) {
        break;
      }

      allOpenIndexes.splice(lowestOpenOccurrence, 1);
      closeIndexCounter += 1;
    }

    return closeIndexHasNoOpen;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const findObjects = async (keyValuePair, preparedValue, fullString, splitCharindex) => {
  try {
    // If object not found inside key value pairs. Return key value pair
    if (preparedValue[0] !== '{') {
      return {
        keyValuePair,
        splitCharindex,
        objectFound: false
      };
    }

    /* 
    * There is an object in value.
    *  Continue to check what is the main object start and end indexes
    */
    const firstOpenIndex = keyValuePair.indexOf('{');
    const lastCloseIndex = fullString.lastIndexOf('}');
    const separatedString = fullString.substring(firstOpenIndex + 1, lastCloseIndex);

    const separatedStringFirstOpenIndex = separatedString.indexOf('{');
    /*
    * If there is only one object found as the value. Return the key and value object
    * Example string - testField: { value: "hi Guys" }
    */
    if (separatedStringFirstOpenIndex === -1) {
      return {
        keyValuePair: fullString.substring(0, lastCloseIndex + 1),
        splitCharindex: lastCloseIndex,
        objectFound: true
      };
    }

    const separatedStringFirstCloseIndex = separatedString.indexOf('}');
    /*
    * If there are separate objects found. Return key and first value object
    * Example string - firstTestField: { value: "hi Guys" }, secondTestField: { value: "How are you" }
    */
    if (separatedStringFirstCloseIndex < separatedStringFirstOpenIndex) {
      return {
        keyValuePair: fullString.substring(0, firstOpenIndex + separatedStringFirstCloseIndex + 2),
        splitCharindex: firstOpenIndex + separatedStringFirstCloseIndex + 2,
        objectFound: true
      }
    }

    /*
    * There are object inside object. Finding the index of the closing bracket index of main object
    * Example string - firstTestField: { value: "hi Guys", insideField: { secondValue: "Where are you" } }, secondTestField: { value: "How are you" }
    */
    const mainClosingIndex = await getClosingBracketIndexOfMainObject(separatedString);

    return {
      keyValuePair: fullString.substring(0, firstOpenIndex + mainClosingIndex + 2),
      splitCharindex: firstOpenIndex + mainClosingIndex + 2,
      objectFound: true
    }
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

exports.findObjects = findObjects;
exports.charOccurrencesFinder = charOccurrencesFinder;
