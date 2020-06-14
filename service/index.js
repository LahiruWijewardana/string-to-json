import Path from 'path';
import Customlog from '../helpers/Customlog';

const LOGGER = new Customlog(Path.basename(__filename));

const converter = async () => {
  try {
    LOGGER.info('Inside converter');

    let stringJson = ' { app_id: "MOB0006", serviceProvider: 5 } ';
    LOGGER.info(stringJson);

    stringJson = stringJson.trim();
    LOGGER.info(stringJson);

    let replcedString = stringJson.replace(/{/g, '');
    replcedString = replcedString.replace(/}/g, '');
    // replcedString = replcedString.replace(/"/g, '\'');
    replcedString = replcedString.trim();
    LOGGER.info(replcedString);

    const splitArray = replcedString.split(',');
    LOGGER.info(splitArray);

    const splitArrayLength = splitArray.length;
    const returnObject = {};

    for (let stringCounter = 0; stringCounter < splitArrayLength; stringCounter += 1) {
      let keyValuePair = splitArray[stringCounter];
      keyValuePair = keyValuePair.trim();
      LOGGER.info(keyValuePair);

      const keyValuePairSplit = keyValuePair.split(':');

      splitArray[stringCounter] = {
        key: keyValuePairSplit[0].trim(),
        value: keyValuePairSplit[1].trim()
      };

      returnObject[keyValuePairSplit[0].trim()] = keyValuePairSplit[1].trim();
    }

    LOGGER.info(returnObject);
  } catch (error) {
    LOGGER.error(error);
  }
};

export default {
  converter
};
