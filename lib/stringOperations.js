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

// Assume there are no commas inside string values
const keyValuePairSplitter = async (keyValuePairString) => {
  try {
    const keyValuePairArray = [];

    while (keyValuePairString.indexOf(',') !== -1) {
      const splitCharindex = keyValuePairString.indexOf(',');
      keyValuePairArray.push(keyValuePairString.substring(0, splitCharindex));

      keyValuePairString = keyValuePairString.substring(splitCharindex + 1)
    }
    keyValuePairArray.push(keyValuePairString);

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
