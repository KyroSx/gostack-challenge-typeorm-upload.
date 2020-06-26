import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();

  const transactionsSerialized = transactions.map(transaction => {
    const {
      id,
      title,
      value,
      type,
      category,
      updated_at,
      created_at,
    } = transaction;

    return {
      id,
      title,
      value,
      type,
      category,
      updated_at,
      created_at,
    };
  });

  return response.json({
    transactions: transactionsSerialized,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteRepository = new DeleteTransactionService();

  await deleteRepository.execute(id);

  return response.status(204).send();
});

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
