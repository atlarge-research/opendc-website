---
sidebar_position: 3
description: The columns of service.parquet in OpenDC2.
---

# service.parquet

`service.parquet` has one row per sample. It gives an overview of the whole simulation: how many hosts are available,
and how many tasks are waiting, running and finished.

| Column               | Type  | Unit  | Description                                                 |
|----------------------|-------|-------|-------------------------------------------------------------|
| `timestamp`          | int64 | ms    | The time of the sample, since the start of the simulation.  |
| `timestamp_absolute` | int64 | ms    | The time of the sample, since the Unix epoch.               |
| `hosts_up`           | int32 | count | The number of hosts that are up.                            |
| `hosts_down`         | int32 | count | The number of hosts that are down.                          |
| `tasks_total`        | int32 | count | The number of tasks submitted so far.                       |
| `tasks_pending`      | int32 | count | The number of tasks waiting to be scheduled.                |
| `tasks_active`       | int32 | count | The number of tasks running.                                |
| `tasks_completed`    | int32 | count | The number of tasks that completed.                         |
| `tasks_terminated`   | int32 | count | The number of tasks that were terminated.                   |
