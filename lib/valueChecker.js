const Path = require('path');
const Customlog = require('./helpers/Customlog');
const JsonConverter = require('.');
const StringOperations = require('./stringOperations');

const LOGGER = new Customlog(Path.basename(__filename));

const valueStringCheck = async (valueString) => {
  try {
    if (!isNaN(valueString)) {
      return await valueStringToNumber(valueString);
    }

    if (valueString[0] === '"') {
      return await valueStringToString(valueString);
    }

    if (valueString[0] === '{') {
      return await valueStringToObject(valueString);
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

async function valueStringToObject(valueString) {
  return await JsonConverter.convertJson(valueString);
}

async function valueStringToArray(valueString) {
  const arrayString = await StringOperations.prepareArrayString(valueString);
  return await StringOperations.buildArray(arrayString);
}

exports.valueStringCheck = valueStringCheck;
