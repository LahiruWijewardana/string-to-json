class Customlog {
  constructor(className) {
    this.className = className;
  }

  info(message) {
    if (typeof message !== 'object') {
      console.log(`${new Date().toISOString()} INFO ${this.className}:${this.getLineNumber()} - ${message}`); // eslint-disable-line
    } else {
      console.log(`${new Date().toISOString()} INFO ${this.className}:${this.getLineNumber()}`); // eslint-disable-line
      console.log(message); // eslint-disable-line
    }
  }

  error(message) {
    if (typeof message !== 'object') {
      console.error(`${new Date().toISOString()} ERROR ${this.className}:${this.getLineNumber()} - ${message}`); // eslint-disable-line
    } else {
      console.error(`${new Date().toISOString()} ERROR ${this.className}:${this.getLineNumber()}`); // eslint-disable-line
      console.error(message); // eslint-disable-line
    }
  }

  getLineNumber() {
    this.trace = ((new Error().stack).split('at ')[3]).split(':')[1]; // eslint-disable-line
    return this.trace;
  }
}

module.exports = Customlog;
