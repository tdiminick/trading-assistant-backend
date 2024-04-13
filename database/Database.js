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
    return { ...findObj, modified: Date.now() };
  };

  _setDeleted = () => {
    return { deleted: Date.now() };
  };

  _findNondeleted = (findObj) => {
    return { ...findObj, deleted: { $exists: false } };
  };

  _findById = (id) => {
    console.log("id: ", id);
    return this._findNondeleted({ _id: new ObjectId(id) });
  };

  _findByUserId = (userId) => {
    return { userId: userId };
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

  // userspaces
  getTransactionsForUserId = async (userId) => {
    return await this.db
      .collection(TRANSACTIONS)
      .find(this._findByUserId(userId))
      // .project({ _id: 1, name: 1, created: 1, modified: 1 })
      .toArray();
  };

  // userspace
  findTransaction = async (transactionId) => {
    return await this.db
      .collection(TRANSACTIONS)
      .findOne(this._findById(transactionId));
  };

  deleteTransaction = async (transactionId) => {
    return await this.db
      .collection(TRANSACTIONS)
      .updateOne(this._findById(transactionId), {
        $set: this._setDeleted(),
      });
  };

  updateTransactionName = async (transactionId, transactionName) => {
    return await this.db
      .collection(TRANSACTIONS)
      // first arg is the "find", second is the "update"
      .updateOne(this._findById(transactionId), {
        $set: this._setModified({ name: transactionName }),
      });
  };
}
