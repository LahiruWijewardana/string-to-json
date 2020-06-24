String to Json converter
==============

Convert a string that contains a Json object to Json object format. This can convert json object that have arrays inside and keys with dot notation. Mainly focusing on MongoDB queries.
```js

For example

This will convert string like this to '{ appName: "JsonTest", keywords: { $in: [ "json", "string" ] } }'
Object like below
{
    appName: 'JsonTest',
    keywords: {
        $in: [ 'json', 'string' ]
    }
}

```

-------------


## Assumptions
* Strings inside the object do not contain commas. For example, this string values is not valid: "Hi, How are you"

## Installation
    $ npm install string-to-json-converter

## Quick Start

```js
    import StringToJson from 'string-to-json-converter';

    const jsonString = '{ appName: "JsonTest", keywords: { $in: [ "json", "string" ] } }';
    // IMPORTANT - String should provide within single quotes. String inside the object should provide within double quotes.

    const resultJsonObject = await StringToJson.convertJson(jsonString);
```
## License
MIT

