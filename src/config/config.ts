const path = require("path");
const nconf = require("nconf");

nconf.env().argv();

const env: string = nconf.get("env");

// console.log("Loaded Config File >", path.join(__dirname, './env', `${env}.json`));

nconf.file({ file: path.join(__dirname, "./env", `${env}.json`) });

export default nconf;
