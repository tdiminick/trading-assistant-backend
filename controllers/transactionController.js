import transactionService from "../services/transactionService.js";
import logger from "../services/logger.js";

const getTransactions = async (req, res) => {
  logger.info("get transaction: ", req.body, req.decoded);
  const userId = req.decoded.userId;
  const db = req.app.locals.db;

  const transactions = await transactionService.getTransactions(db, userId);

  return res.status(200).send(transactions);
};

const saveTransaction = async (req, res) => {
  logger.info("save transaction: ", req.body, req.decoded);
  const userId = req.decoded.userId;
  const db = req.app.locals.db;
  const transaction = req.body;

  const transactionResult = await transactionService.saveTransaction(
    db,
    userId,
    transaction
  );

  return res.status(200).send(transactionResult);
};

export default {
  getTransactions,
};
