import { Request, Response } from 'express';
import userService from '../service/user.service';
const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body
    const user = await userService.registerUserService(name, email, password, role)
    res.status(201).json(user)
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in createUser:`, err);
    res.status(500).json({ message: "Server error" });
  }
}
const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }
  try {
    const user = await userService.getUserByIdService(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { password: _, ...safeUser } = user;

    res.json(safeUser);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in getUserById:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllNameUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsersNameService();
    res.json(users);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in getAllNameUser:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = req.query as Record<string, string>;
    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '10', 10);
    const offset = (page - 1) * limit;

    const result = await userService.getAllUsersService(params, limit, offset);

    res.json({
      users: result.users,
      total: result.total,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in getAllUsers:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createUser, getUserById, getAllNameUser, getAllUsers };