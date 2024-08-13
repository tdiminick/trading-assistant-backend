import { ObjectId } from 'mongodb';

import logger from './logger.js';

const createTransaction = async (db, transactionName, userId) => {
	const transactionDoc = {
		name: transactionName,
		userId: new ObjectId(userId),
		created: Date.now(),
		modified: null,
		transactions: [],
	};
	const pResult = await db.insertTransaction(transactionDoc);
	logger.info(`A new transaction was created, ${transactionName}, id: ${pResult.insertedId}`);

	return pResult.insertedId;
};

// will eventually add permission checks, transactionion objects, etc here
const getTransactions = async (db, userId) => {
	let transactions = await db.getTransactionsForUserId(userId);
	logger.info('transactions: ', transactions.length);

	return transactions;
};

const saveTransaction = async (db, userId, transaction) => {
	let transactionResult = await db.saveTransaction(userId, transaction);
	logger.info('transaction: ', transactionResult);

	return transactionResult;
};

// const getTransaction = async (db, transactionId) => {
//   const transaction = await db.findTransaction(transactionId);
//   return await buildTransactionLists(db, transaction);
// };

const deleteTransaction = async (db, userId, transactionId) => {
	const result = await db.deleteTransaction(userId, transactionId);
	return result;
};

// const updateTransactionName = async (db, transactionId, transactionName) => {
//   const result = await db.updateTransactionName(transactionId, transactionName);
//   logger.info(`Transaction name updated: ${transactionName} (${transactionId})`);
//   logger.info("result: ", result);
//   const transaction = await getTransaction(db, transactionId);
//   return transaction;
// };

export default {
	getTransactions,
	saveTransaction,
	deleteTransaction,
};
