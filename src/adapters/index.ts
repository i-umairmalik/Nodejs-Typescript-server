// const pgsql = require('./pgsql');
// const redis = require("./redis");
const mongodb = require("./mongo");
// const cloudinary = require("./cloudinary");
// const neo4j = require("./neo4j");

const adapters = async (logger: any, config: any) => ({
//   cache: {
//     secondary: await redis(logger, config),
//   },
  db: {
    primary: await mongodb(logger, config),
  },
  //   imageUpload: {
  //     primary: await cloudinary(logger, config)
  //   },
  //   graphDB:{
  //     primary: await neo4j(logger, config)
  //   }
});

export default adapters;
