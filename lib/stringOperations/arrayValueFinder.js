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

export default {
  stringValueSplitter
};
