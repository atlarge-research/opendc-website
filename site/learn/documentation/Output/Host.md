---
sidebar_position: 1
description: The columns of host.parquet.
---

# host.parquet

`host.parquet` has one row per host per sample. It describes the state, utilization and power draw of each host.

| Column             | Type   | Unit     | Description                                                              |
|--------------------|--------|----------|--------------------------------------------------------------------------|
| `timestamp`        | int64  | ms       | The time of the sample.                                                  |
| `host_id`          | int32  |          | The id of host. To get the name, see [meta/host.parquet](./Meta.md).                            |
| `host_state`       | string |          | `UP`, `DOWN` or `ERROR`.                                                 |
| `tasks_running`    | int32  | count    | The number of tasks running on the host.                                 |
| `tasks_error`      | int32  | count    | The number of tasks on the host that failed.                             |
| `tasks_invalid`    | int32  | count    | The number of tasks on the host in an unexpected state.                  |
| `cpu_usage`        | float  | MHz      | The CPU capacity used by the tasks.                                      |
| `cpu_demand`       | float  | MHz      | The CPU capacity the tasks ask for.                                      |
| `cpu_utilization`  | float  | ratio    | `cpu_usage` divided by the CPU capacity of the host.                     |
| `cpu_time_active`  | int64  | ms       | The total time the CPU was active.                                       |
| `cpu_time_idle`    | int64  | ms       | The total time the CPU was idle.                                         |
| `cpu_time_steal`   | int64  | ms       | The total time tasks wanted to run, but no CPU capacity was available.   |
| `cpu_time_lost`    | int64  | ms       | The total CPU time lost to interference.                                 |
| `power_draw`       | float  | W        | The power draw of the host.                                              |
| `energy_usage`     | float  | J        | The energy the host used since the start of the simulation.              |
| `carbon_intensity` | float  | gCO2/kWh | The carbon intensity of the energy.                                      |
| `carbon_emission`  | float  | g        | The carbon emitted since the start of the simulation.                    |
| `embodied_carbon`  | float  | g        | The embodied carbon of the host, for the time since the previous sample. |
| `uptime`           | int64  | ms       | The total time the host was up.                                          |
| `downtime`         | int64  | ms       | The total time the host was down because of a failure.                   |
| `boot_time`        | int64  | ms       | When the host booted, or null if it has not booted.                      |

## GPU columns

When the topology has GPUs, the file has a set of columns for each GPU of a host. The columns of the first GPU end in
`_0`, those of the second in `_1`, and so on. A host with fewer GPUs than the host with the most GPUs has null values
for the missing ones.

| Column              | Type  | Unit  | Description                              |
|---------------------|-------|-------|------------------------------------------|
| `gpu_usage_i`       | float | MHz   | The GPU capacity used by the tasks.      |
| `gpu_demand_i`      | float | MHz   | The GPU capacity the tasks ask for.      |
| `gpu_utilization_i` | float | ratio | `gpu_usage_i` divided by the GPU capacity. |
| `gpu_time_active_i` | int64 | ms    | The total time the GPU was active.       |
| `gpu_time_idle_i`   | int64 | ms    | The total time the GPU was idle.         |
| `gpu_time_steal_i`  | int64 | ms    | The total time tasks wanted to run, but no GPU capacity was available. |
| `gpu_time_lost_i`   | int64 | ms    | The total GPU time lost to interference. |
| `gpu_power_draw_i`  | float | W     | The power draw of the GPU.               |
