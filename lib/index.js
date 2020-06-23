import Path from 'path';
import Customlog from './helpers/Customlog';
import ValueChecker from './valueChecker';
import StringOperations from './stringOperations';

const LOGGER = new Customlog(Path.basename(__filename));

const splitKeyValuesAndCreateObject = async (keyValueString) => {
  try {
    const splitKeyValueArray = await StringOperations.keyValuePairSplitter(keyValueString);

    const splitKeyValueArrayLength = splitKeyValueArray.length;
    const returnObject = {};

    for (let keyValuePairCounter = 0; keyValuePairCounter < splitKeyValueArrayLength; keyValuePairCounter += 1) {
      const keyValuePair = splitKeyValueArray[keyValuePairCounter].trim();
      const keyValueSplit = await StringOperations.keyValueSplitter(keyValuePair);

      const formattedKeyString = await ValueChecker.valueStringCheck(keyValueSplit[0].trim());
      returnObject[formattedKeyString] = await ValueChecker.valueStringCheck(keyValueSplit[1].trim());
    }

    return returnObject;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const convertJson = async (jsonString) => {
  try {
    LOGGER.info(jsonString);

    jsonString = await StringOperations.prepareJsonString(jsonString);
    const jsonObject = await splitKeyValuesAndCreateObject(jsonString);
    LOGGER.info(jsonObject);
    return jsonObject;
  } catch (error) {
    LOGGER.error(error);
  }
};

convertJson('{ app_id: "MOB0006", "app_data.key_word": [ "bid", "bd", "mw" ] }');

export default {
  convertJson
};
