import { ObjectId } from "mongodb";
import { database } from "../config.js";

const { user_coll: USERS, transaction_coll: TRANSACTIONS } = database;

// might split this into multiple DB Services
export default class DatabaseService {
  constructor(db) {
    this.db = db.db(database.db_name);
  }

  // helper methods
  // call this with the `$set` part of the update statement
  _setModified = (findObj) => {
    console.log("findObj: ", findObj);
    const res = { ...findObj, modified: Date.now() };
    console.log("res: ", res);
    return res;
  };

  _findById = (id) => {
    console.log("id: ", id);
    return { _id: new ObjectId(id) };
  };

  _findByUserId = (userId) => {
    return { userId: new ObjectId(userId) };
  };

  _findByUserIdAndId = (userId, id) => {
    return { ...this._findByUserId(userId), ...this._findById(id) };
  };

  // user -> doesn't currently use deleted, so not using helper methods above
  insertUser = async (user) => {
    return await this.db.collection(USERS).insertOne(user);
  };

  findUserByEmail = async (email) => {
    return await this.db.collection(USERS).findOne({ email });
  };

  insertTransaction = async (transaction) => {
    return await this.db.collection(TRANSACTIONS).insertOne(transaction);
  };

  // transactions
  getTransactionsForUserId = async (userId) => {
    return await this.db
      .collection(TRANSACTIONS)
      .find(this._findByUserId(userId))
      // .project({ _id: 1, name: 1, created: 1, modified: 1 })
      .project({ userId: 0 })
      .toArray();
  };

  // transaction
  saveTransaction = async (userId, transaction) => {
    console.log("transaction: ", transaction);
    const id = transaction._id;
    // need to make sure we don't have an _id on the document, if we are inserting, it will get created,
    // if we are updating, we aren't allowed to set it
    delete transaction._id;
    return await this.db
      .collection(TRANSACTIONS)
      // first arg is the "find", second is the "update"
      .findOneAndUpdate(
        this._findByUserIdAndId(userId, id),
        {
          $setOnInsert: {
            userId: new ObjectId(userId),
          },
          $set: this._setModified(transaction),
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
  };

  deleteTransaction = async (userId, transactionId) => {
    return await this.db
      .collection(TRANSACTIONS)
      .deleteOne(this._findById(userId, transactionId));
  };
}
