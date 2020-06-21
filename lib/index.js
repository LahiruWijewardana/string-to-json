import Path from 'path';
import Customlog from './helpers/Customlog';
import ValueChecker from './valueChecker';

const LOGGER = new Customlog(Path.basename(__filename));

const prepareJsonString = async (jsonString) => {
  try {
    jsonString = jsonString.replace(/{/g, '');
    jsonString = jsonString.replace(/}/g, '');

    return jsonString.trim();
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const splitKeyValuesAndCreateObject = async (keyValueString) => {
  try {
    const splitKeyValueArray = keyValueString.split(',');

    const splitKeyValueArrayLength = splitKeyValueArray.length;
    const returnObject = {};

    for (let keyValuePairCounter = 0; keyValuePairCounter < splitKeyValueArrayLength; keyValuePairCounter += 1) {
      const keyValuePair = splitKeyValueArray[keyValuePairCounter].trim();

      const keyValueSplit = keyValuePair.split(':');

      returnObject[keyValueSplit[0].trim()] = await ValueChecker.valueStringCheck(keyValueSplit[1].trim());
    }

    return returnObject;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const converter = async (jsonString) => {
  try {
    LOGGER.info(jsonString);

    jsonString = await prepareJsonString(jsonString);
    const jsonObject = await splitKeyValuesAndCreateObject(jsonString);
    LOGGER.info(jsonObject);
    return jsonObject;
  } catch (error) {
    LOGGER.error(error);
  }
};

export default {
  converter
};
