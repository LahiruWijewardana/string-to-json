const Path = require('path');
const Customlog = require('../helpers/Customlog');
const ObjectFinder = require('./jsonObjectFinder');
const ArrayValueFinder = require('./arrayValueFinder');

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

const prepareArrayString = async (arrayString) => {
  try {
    arrayString = await resetCharactor(arrayString.indexOf('['), arrayString);
    arrayString = await resetCharactor(arrayString.lastIndexOf(']'), arrayString);

    return arrayString.trim();
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

const prepareValueOnly = async (keyValuePair) => {
  try {
    const seperatedValue = await keyValueSplitter(keyValuePair);
    return seperatedValue[1].trim();
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
      const preparedValue = await prepareValueOnly(keyValuePair);

      let returnValue = await ObjectFinder.findObjects(keyValuePair, preparedValue, allKeyValuePairsString, splitCharindex);
      if (!returnValue.objectFound) {
        returnValue = await ArrayValueFinder.findArray(keyValuePair, preparedValue, allKeyValuePairsString, splitCharindex);
      }
      keyValuePairArray.push(returnValue.keyValuePair);

      allKeyValuePairsString = allKeyValuePairsString.substring(returnValue.splitCharindex + 1).trim();
      if (allKeyValuePairsString[0] === ',') {
        allKeyValuePairsString = allKeyValuePairsString.slice(1).trim();
      }
    }

    if (allKeyValuePairsString !== '') {
      keyValuePairArray.push(allKeyValuePairsString);
    }

    return keyValuePairArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const buildArray = async (arrayString) => {
  try {
    if (arrayString[0] === '"') {
      return await ArrayValueFinder.stringValueSplitter(arrayString);
    }

    if (arrayString[0] === '{') {
      return await ArrayValueFinder.objectValueSplitter(arrayString);
    }
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
}; 

exports.prepareJsonString = prepareJsonString;
exports.prepareJsonString = prepareJsonString;
exports.keyValuePairSplitter = keyValuePairSplitter;
exports.keyValueSplitter = keyValueSplitter;
exports.prepareArrayString = prepareArrayString;
exports.buildArray = buildArray;
