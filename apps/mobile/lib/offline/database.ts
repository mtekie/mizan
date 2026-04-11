import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
// The model implementation files would be imported here in a full deployment
// import Account from './models/Account';

const adapter = new SQLiteAdapter({
  schema,
  // (Optional database name or location can be configued here)
  jsi: true, // Recommended for performance
  onSetUpError: error => {
    console.error("WatermelonDB failed to initialize.", error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    // Account,
    // Transaction,
    // Goal
  ],
});
