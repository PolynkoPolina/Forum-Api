#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0f6720328a191427474fa1fa69f2c9b11f3767ddbc170ed931bf5fe448ce2739/contract';
import endContract from '../../snapshots/0f6720328a191427474fa1fa69f2c9b11f3767ddbc170ed931bf5fe448ce2739/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2bd812f428e1e5c09ce4756861bbdd838400284d55643784105b4cbd1c4b8acf/contract';
import startContract from '../../snapshots/2bd812f428e1e5c09ce4756861bbdd838400284d55643784105b4cbd1c4b8acf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
