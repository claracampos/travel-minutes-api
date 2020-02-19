const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

exports.fetchUsers = async () => {
  const client = await MongoClient.connect(process.env.URI, {
    useUnifiedTopology: true
  });
  const users = client.db("travel-minutes").collection("users");
  return users;
};
