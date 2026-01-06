import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return uuidv4();
}
