import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'name_amh', type: 'string', isOptional: true },
        { name: 'type', type: 'string' },
        { name: 'balance', type: 'number' },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'synced', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'title_amh', type: 'string', isOptional: true },
        { name: 'amount', type: 'number' },
        { name: 'source', type: 'string' },
        { name: 'category', type: 'string', isOptional: true },
        { name: 'date', type: 'number' },
        { name: 'synced', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'goals',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'emoji', type: 'string', isOptional: true },
        { name: 'target', type: 'number' },
        { name: 'saved', type: 'number' },
        { name: 'deadline', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
      ],
    })
  ],
});
