# Restore drill

A backup that was never restored does not count as a backup. This drill proves the daily
dump can actually be read back, and it is the only thing that does.

**When**: once before launch, then every quarter. Also after any change to `backup.yml`, to
`0001_init.sql`, or to the Postgres major version.

**Who**: Mateo, or whoever holds the age private key. It takes about twenty minutes.

**What you need**

| Thing | Where it lives |
|---|---|
| age **private** key | The password manager — never GitHub, never this repository |
| R2 credentials | The same values as the `R2_*` repository secrets |
| Neon access | The project `sanalys` |
| `age`, `pg_restore` 17, `aws` CLI | Locally installed |

## 1. Pick the dump to restore

Always drill on a **real** object from the bucket, never on a dump you just made by hand.

```bash
export ENDPOINT="https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com"
aws s3 ls s3://sanalys-backups/daily/ --recursive --endpoint-url "$ENDPOINT" | tail -5
aws s3 cp s3://sanalys-backups/daily/<YYYY/MM/DD>.dump.age ./dump.age --endpoint-url "$ENDPOINT"
```

## 2. Decrypt it

```bash
age -d -i /path/to/age-private-key.txt -o dump.pgc dump.age
```

If this fails, stop: the backups are unreadable and that is an incident, not a drill.

## 3. Restore into a throwaway Neon branch

Never restore over `main`. Create a branch in the Neon console (or with the API), take its
**direct** connection string, and restore into it.

```bash
export RESTORE_URL="postgresql://<role>:<password>@<host>/sanalys?sslmode=require"
pg_restore --no-owner --no-privileges --clean --if-exists -d "$RESTORE_URL" dump.pgc
```

`--no-owner --no-privileges` because the roles of the restored cluster are not the ones on
the branch; the grants are recreated by the migration, and this drill checks the data.

## 4. Compare row counts against production

Run the same query on the restored branch and on `main`, and compare the two lists.

```sql
select relname as tabla, n_live_tup as filas
from pg_stat_user_tables
order by relname;
```

`n_live_tup` is an estimate; where a table matters — `pacientes`, `turnos`,
`caja_movimientos`, `consentimientos`, `auditoria` — confirm with an exact count:

```sql
select
  (select count(*) from pacientes) as pacientes,
  (select count(*) from turnos) as turnos,
  (select count(*) from caja_movimientos) as caja,
  (select count(*) from consentimientos) as consentimientos,
  (select count(*) from auditoria) as auditoria;
```

Differences are expected only for rows written after the dump was taken. Anything else is a
finding, not a rounding error.

## 5. Check that the invariants survived

A restored schema without its constraints would silently accept two bookings on one chair.

```sql
select
  (select count(*) from pg_constraint where contype = 'x') as exclude_constraints,
  (select count(*) from pg_trigger where not tgisinternal) as triggers,
  (select count(*) from pg_views where schemaname = 'public') as vistas;
```

Expected at the time of writing: 1 exclude constraint, 24 triggers, 1 view.

## 6. Delete the branch

Neon's free plan has a branch quota, and a forgotten branch keeps a compute alive.

## 7. Write it down

Append to `docs/10-MEMORY.md`: the date, which dump was restored, the row counts, how long
it took, and anything that failed. A drill that is not written down did not happen.

| Date | Dump | Rows checked | Result |
|---|---|---|---|
| | | | |
