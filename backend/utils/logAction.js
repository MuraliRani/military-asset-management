import Log from '../models/Log.js';

export async function logAction(action, userId, details) {
  try {
    await Log.create({ action, user: userId, details });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
} 