import prisma from '#config/prisma.js';

export const getTodos = async (req, res) => {
  const todos = await prisma.todos.findMany();
  res.status(200).json({ success: true, data: todos });
};

export const getTodoById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  const todo = await prisma.todos.findUnique({ where: { id } });
  res.status(200).json({ success: true, data: todo });
};

export const createTodo = async (req, res) => {
  const { title, description } = req.body;
  const todo = await prisma.todos.create({ data: { title, description } });
  res.status(201).json({ success: true, data: todo });
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }
  const { title, description } = req.body;
  const todo = await prisma.todos.update({
    where: { id },
    data: { title, description },
  });
  res.status(200).json({ success: true, data: todo });
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }
  await prisma.todos.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Todo deleted' });
};
