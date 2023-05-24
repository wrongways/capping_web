# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


## Loading the databases from CSV log files

### Create the database
```
sqlite3 run5.db
```

### Create the tables & indexes
```
sqlite> CREATE TABLE driver(
        start_time integer not null,
        end_time integer not null,
        cap_request_time integer not null,
        cap_did_complete boolean not null,
        cap_complete_time integer not null,
        load_pct integer not null,
        load_period integer not null,
        n_threads integer not null,
        capping_order text not null,
        capping_operation text not null,
        cap_from integer not null,
        cap_to integer not null);

sqlite> CREATE TABLE bmc (
        timestamp integer not null,
        power integer not null,
        cap_limit integer not null,
        cap_is_active boolean not null);

sqlite> CREATE TABLE rapl (timestamp integer not null, domain text not null, power_mW not null);

```

Unfortunately it doesn't appear possible to use the timestamp field of bmc and rapl tables as
primary key - the following import fails with a mismatched type error.

### Load CSV files
Assuming your csv files are in the `run5` directory. The `skip 1` option skips the csv header row.

```
sqlite>  .import --csv --skip 1 run5/driver_log_<timestamp>.csv driver
sqlite>  .import --csv --skip 1 run5/bmc_stats_<timestamp>.csv bmc
sqlite>  .import --csv --skip 1 run5/rapl_stats_<timestamp>.csv rapl
sqlite>  -- confirm the imports
sqlite> select count(*) from driver;
798
sqlite> select count(*) from bmc;
14881
sqlite> select count(*) from rapl;
89704
```

The number of rows will vary of course.

### Add indexes

Add indexes to bmc and rapl tables to speed lookups. It's preferable, but not essential,
to add indexes after import.

```
sqlite> CREATE UNIQUE INDEX bmc_timestamp_idx on bmc(timestamp);
sqlite> CREATE UNIQUE INDEX rapl_timestamp_idx on rapl(timestamp, domain);
```

## Point the web server at the new database

Edit the `.env` file at the top level of the project to the path of your database

