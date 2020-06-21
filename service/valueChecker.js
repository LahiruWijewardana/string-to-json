import Path from 'path';
import Customlog from '../helpers/Customlog';

const LOGGER = new Customlog(Path.basename(__filename));

const valueStringCheck = async (valueString) => {
  try {
    if (!isNaN(valueString)) { // eslint-disable-line no-restricted-globals
      return await valueStringToNumber(valueString);
    }

    if (valueString[0] === '"') {
      return await valueStringToString(valueString);
    }

    if (valueString[0] === '[') {
      return await valueStringToArray(valueString);
    }

    return valueString;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

async function valueStringToNumber(numberString) {
  return parseFloat(numberString);
}

async function valueStringToString(valueString) {
  valueString = valueString.replace(/"/g, '');
  return valueString.trim();
}

async function valueStringToArray(valueString) {
  return valueString;
}

export default {
  valueStringCheck
};
