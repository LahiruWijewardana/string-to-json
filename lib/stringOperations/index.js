import Path from 'path';
import Customlog from '../helpers/Customlog';
import ObjectFinder from './jsonObjectFInder';

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

// Assume there are no commas inside string values
const keyValuePairSplitter = async (allKeyValuePairsString) => {
  try {
    const keyValuePairArray = [];

    while (allKeyValuePairsString.indexOf(',') !== -1) {
      const splitCharindex = allKeyValuePairsString.indexOf(',');

      const keyValuePair = allKeyValuePairsString.substring(0, splitCharindex);
      const returnObject = await ObjectFinder.findObjects(keyValuePair, allKeyValuePairsString, splitCharindex);

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
