#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2bd812f428e1e5c09ce4756861bbdd838400284d55643784105b4cbd1c4b8acf/contract';
import startContract from '../../snapshots/2bd812f428e1e5c09ce4756861bbdd838400284d55643784105b4cbd1c4b8acf/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/db9118f051d7832b02b1877ba6cbd1776433f63fa151f23ae46a48c817e65a2f/contract';
import endContract from '../../snapshots/db9118f051d7832b02b1877ba6cbd1776433f63fa151f23ae46a48c817e65a2f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'RefreshSession',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-date@1' },
          }),
          col('expiresIn', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RefreshSession',
        index: 'RefreshSession_userId_idx_a489d58a',
        columns: ['userId'],
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
      this.addForeignKey({
        schema: 'public',
        table: 'RefreshSession',
        foreignKey: {
          name: 'RefreshSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
