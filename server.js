import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import logger from './services/logger.js';
import { MongoClient } from 'mongodb';
import { database } from './config.js';
import Database from './database/Database.js';
import auth from './middleware/authMiddleware.js';
import userCtrl from './controllers/userController.js';
import transactionCtrl from './controllers/transactionController.js';
import stockCtrl from './controllers/stockController.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));

//may need to add parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// user api
app.post('/api/user', userCtrl.createUser);
app.post('/api/login', userCtrl.login);

// transactionS api
app.get('/api/transactions', auth, transactionCtrl.getTransactions);
// transaction api CRUD
// app.post("/api/transaction", auth, transactionCtrl.createTransaction);
// this method upserts, so handles both create and update methods
app.put('/api/transaction', auth, transactionCtrl.saveTransaction);
app.delete('/api/transaction', auth, transactionCtrl.deleteTransaction);
// catch all route -- might be blocked by auth above
app.get('/api/stock/price/:symbol', auth, stockCtrl.getStockPrice);
app.get('*', (req, res) =>
	res.status(200).send({
		message: 'start of app',
	})
);

MongoClient.connect(database.uri)
	.catch((err) => console.error(err.stack))
	.then((db) => {
		if (db) {
			app.locals.db = new Database(db);
			app.listen(PORT, () => {
				logger.info(`trading-assistant-software-backend connected to database ${database.db_name}, listening on port: ${PORT}`);
			});
		} else {
			return;
		}
	});
