import Path from 'path';
import Customlog from './helpers/Customlog';

const LOGGER = new Customlog(Path.basename(__filename));

const resetCharactor = async (resetingIndex, valueString) => {
  try {
    return valueString.substring(0, resetingIndex) + '' + valueString.substring(resetingIndex + 1);
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const prepareJsonString = async (jsonString) => {
  try {
    jsonString = await resetCharactor(jsonString.indexOf('{'), jsonString);
    jsonString = await resetCharactor(jsonString.lastIndexOf('}'), jsonString);

    return jsonString.trim();
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const keyValueSplitter = async (keyValuePair) => {
  try {
    const splitCharindex = keyValuePair.indexOf(':');
    return [keyValuePair.substring(0, splitCharindex), keyValuePair.substring(splitCharindex + 1)]
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const jsonObjectFinder = async (keyValuePair, fullString, splitCharindex) => {
  try {
    const firstOpenIndex = keyValuePair.indexOf('{');
    // If object not found inside key value pairs. Return key value pair
    if (firstOpenIndex === -1) {
      return {
        keyValuePair,
        splitCharindex
      };
    }

    const lastCloseIndex = fullString.lastIndexOf('}');
    LOGGER.info(`---- lastCloseIndex: ${lastCloseIndex}`);

    const separatedString = fullString.substring(firstOpenIndex + 1, lastCloseIndex);
    LOGGER.info(`---- separatedString: ${separatedString}`);

    const separatedStringFirstOpenIndex = separatedString.indexOf('{');
    LOGGER.info(`---- separatedStringFirstOpenIndex: ${separatedStringFirstOpenIndex}`);
    // If there is only one object found as the value. Return the key and value object
    if (separatedStringFirstOpenIndex === -1) {
      return {
        keyValuePair: fullString.substring(0, lastCloseIndex + 1),
        splitCharindex: lastCloseIndex
      };
    }

    const separatedStringFirstCloseIndex = separatedString.indexOf('}');
    LOGGER.info(`---- separatedStringFirstCloseIndex: ${separatedStringFirstCloseIndex}`);
    // If there are separate objects found. Return key and first value object
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

// Assume there are no commas inside string values
const keyValuePairSplitter = async (allKeyValuePairsString) => {
  try {
    const keyValuePairArray = [];

    while (allKeyValuePairsString.indexOf(',') !== -1) {
      const splitCharindex = allKeyValuePairsString.indexOf(',');

      const keyValuePair = allKeyValuePairsString.substring(0, splitCharindex);
      const returnObject = await jsonObjectFinder(keyValuePair, allKeyValuePairsString, splitCharindex);

      LOGGER.info(`==== KeyValuePair: ${returnObject.keyValuePair}`);

      keyValuePairArray.push(returnObject.keyValuePair);

      allKeyValuePairsString = allKeyValuePairsString.substring(returnObject.splitCharindex + 1)
    }
    keyValuePairArray.push(allKeyValuePairsString);
    LOGGER.info(`---- keyValuePairArray: ${keyValuePairArray}`);

    return keyValuePairArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

export default {
  prepareJsonString,
  keyValuePairSplitter,
  keyValueSplitter
};
