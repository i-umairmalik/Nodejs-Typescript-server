import path from "path";
import nconf from "nconf";

nconf.env().argv();

const env = nconf.get("env");
console.log("env", env)
// console.log("Loaded Config File >", path.join(__dirname, './env', `${env}.json`));

nconf.file({ file: path.join(__dirname, "./env", `${env}.json`) });

// module.exports = nconf;

export default nconf;
