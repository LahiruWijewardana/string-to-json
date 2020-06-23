import Path from 'path';
import Customlog from '../helpers/Customlog';
import jsonObjectFInder from './jsonObjectFinder';

const LOGGER = new Customlog(Path.basename(__filename));

const stringValueSplitter = async (arrayString) => {
  try {
    const stringOpenCloseIndexes = await jsonObjectFInder.charOccurrencesFinder(arrayString, '"');
    LOGGER.info(stringOpenCloseIndexes);

    const stringArray = [];
    for (let stringIndexCounter = 0; stringIndexCounter < stringOpenCloseIndexes.length; stringIndexCounter += 2) {
      const stringValue = arrayString.substring(stringOpenCloseIndexes[stringIndexCounter] + 1, stringOpenCloseIndexes[stringIndexCounter + 1]);
      LOGGER.info(stringValue);
      stringArray.push(stringValue);
    }

    return stringArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const findArray = async (keyValuePair, preparedValue, fullString, splitCharindex) => {
  try {
    // If array not found inside key value pairs. Return key value pair
    if (preparedValue[0] !== '[') {
      return {
        keyValuePair,
        splitCharindex
      };
    }

    /* 
    * There is an array in value.
    * Continue to check what is the main array start and end indexes
    */
    const firstOpenIndex = keyValuePair.indexOf('[');
    const lastCloseIndex = fullString.lastIndexOf(']');
    const separatedString = fullString.substring(firstOpenIndex + 1, lastCloseIndex);

    const separatedStringFirstOpenIndex = separatedString.indexOf('[');
    /*
    * If there is only one array found as the value. Return the key and value array
    * Example string - testField: [ value1, value2 ]
    */
    if (separatedStringFirstOpenIndex === -1) {
      return {
        keyValuePair: fullString.substring(0, lastCloseIndex + 1),
        splitCharindex: lastCloseIndex
      };
    }

    const separatedStringFirstCloseIndex = separatedString.indexOf(']');
    /*
    * If there are separate array found. Return key and first value array
    * Example string - firstTestField: [ value1, value2 ], secondTestField: [ value3, value4 ]
    */
    if (separatedStringFirstCloseIndex < separatedStringFirstOpenIndex) {
      return {
        keyValuePair: fullString.substring(0, firstOpenIndex + separatedStringFirstCloseIndex + 2),
        splitCharindex: firstOpenIndex + separatedStringFirstCloseIndex + 2
      }
    }
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

export default {
  stringValueSplitter,
  findArray
};
