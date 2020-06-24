const Path = require('path');
const Customlog = require('./helpers/Customlog');
const {valueStringCheck} = require('./valueChecker');
const StringOperations = require('./stringOperations');

const LOGGER = new Customlog(Path.basename(__filename));

const splitKeyValuesAndCreateObject = async (keyValueString) => {
  try {
    const splitKeyValueArray = await StringOperations.keyValuePairSplitter(keyValueString);

    const splitKeyValueArrayLength = splitKeyValueArray.length;
    const returnObject = {};

    for (let keyValuePairCounter = 0; keyValuePairCounter < splitKeyValueArrayLength; keyValuePairCounter += 1) {
      const keyValuePair = splitKeyValueArray[keyValuePairCounter].trim();
      const keyValueSplit = await StringOperations.keyValueSplitter(keyValuePair);

      const formattedKeyString = await valueStringCheck(keyValueSplit[0].trim());
      returnObject[formattedKeyString] = await valueStringCheck(keyValueSplit[1].trim());
    }

    return returnObject;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const convertJson = async (jsonString) => {
  try {
    jsonString = await StringOperations.prepareJsonString(jsonString);
    const jsonObject = await splitKeyValuesAndCreateObject(jsonString);

    return jsonObject;
  } catch (error) {
    LOGGER.error(error);
  }
};

exports.convertJson = convertJson;
