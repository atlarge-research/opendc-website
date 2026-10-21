---
sidebar_position: 1
description: The columns of host.parquet in OpenDC2.
---

# host.parquet

`host.parquet` has one row per host per sample. It describes the state, utilization and power draw of each host.

| Column               | Type   | Unit  | Description                                                                         |
|----------------------|--------|-------|-------------------------------------------------------------------------------------|
| `timestamp`          | int64  | ms    | The time of the sample, since the start of the simulation.                          |
| `timestamp_absolute` | int64  | ms    | The time of the sample, since the Unix epoch.                                       |
| `host_name`          | string |       | The name of the host.                                                               |
| `cluster_name`       | string |       | The name of the cluster of the host.                                                |
| `core_count`         | int32  | count | The number of CPU cores of the host.                                                |
| `mem_capacity`       | int64  | MiB   | The memory of the host.                                                             |
| `tasks_terminated`   | int32  | count | The number of terminated tasks on the host.                                         |
| `tasks_running`      | int32  | count | The number of tasks running on the host.                                            |
| `tasks_error`        | int32  | count | The number of tasks on the host that failed.                                        |
| `tasks_invalid`      | int32  | count | The number of tasks on the host in an unexpected state.                             |
| `cpu_capacity`       | float  | MHz   | The total CPU capacity of the host.                                                 |
| `cpu_usage`          | float  | MHz   | The CPU capacity used by the tasks.                                                 |
| `cpu_demand`         | float  | MHz   | The CPU capacity the tasks ask for.                                                 |
| `cpu_utilization`    | float  | ratio | `cpu_usage` divided by `cpu_capacity`.                                              |
| `cpu_time_active`    | int64  | ms    | The time the CPU was active, since the previous sample.                             |
| `cpu_time_idle`      | int64  | ms    | The time the CPU was idle, since the previous sample.                               |
| `cpu_time_steal`     | int64  | ms    | The time tasks wanted to run but no CPU capacity was available, since the previous sample. |
| `cpu_time_lost`      | int64  | ms    | The CPU time lost to interference, since the previous sample.                       |
| `power_draw`         | float  | W     | The power draw of the host.                                                         |
| `energy_usage`       | float  | J     | The energy the host used since the previous sample.                                 |
| `embodied_carbon`    | float  | g     | The embodied carbon of the host, for the time since the previous sample.            |
| `uptime`             | int64  | ms    | The time the host was up, since the previous sample.                                |
| `downtime`           | int64  | ms    | The time the host was down, since the previous sample.                              |
| `boot_time`          | int64  | ms    | When the host booted.                                                               |

## GPU columns

When the topology has GPUs, the file has a set of columns for each GPU of a host. The columns of the first GPU end in
`_0`, those of the second in `_1`, and so on.

| Column              | Type  | Unit  | Description                                                       |
|---------------------|-------|-------|-------------------------------------------------------------------|
| `gpu_capacity_i`    | float | MHz   | The capacity of the GPU.                                          |
| `gpu_usage_i`       | float | MHz   | The GPU capacity used by the tasks.                               |
| `gpu_demand_i`      | float | MHz   | The GPU capacity the tasks ask for.                               |
| `gpu_utilization_i` | float | ratio | `gpu_usage_i` divided by `gpu_capacity_i`.                        |
| `gpu_time_active_i` | int64 | ms    | The time the GPU was active, since the previous sample.           |
| `gpu_time_idle_i`   | int64 | ms    | The time the GPU was idle, since the previous sample.             |
| `gpu_time_steal_i`  | int64 | ms    | The time tasks wanted to run but no GPU capacity was available, since the previous sample. |
| `gpu_time_lost_i`   | int64 | ms    | The GPU time lost to interference, since the previous sample.     |
| `gpu_power_draw_i`  | float | W     | The power draw of the GPU.                                        |
