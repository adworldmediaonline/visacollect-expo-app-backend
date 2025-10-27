import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '#controllers/todos.controller.js';

const todosRouter = express.Router();

todosRouter.get('/', getTodos);
todosRouter.get('/:id', getTodoById);
todosRouter.post('/', createTodo);
todosRouter.put('/:id', updateTodo);
todosRouter.delete('/:id', deleteTodo);

export default todosRouter;
