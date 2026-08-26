import { getDatabase } from '../database/db';
import { seedInitialData } from '../database/seed';

export async function populateSampleData(): Promise<void> {
  const db = await getDatabase();
  await seedInitialData(db);
}
