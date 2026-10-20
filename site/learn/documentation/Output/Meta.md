---
sidebar_position: 8
description: The meta files, which map the ids in the output to names and fixed properties.
---

# Meta files

Each run writes a `meta/` folder next to its output files. The meta files map the ids used in the output files to
names and fixed properties, and tell which entity is part of which. Join an output file with the meta file of the same
name on its id column, for example `host.parquet` with `meta/host.parquet` on `host_id`. Ids are assigned in the order
of the topology, and are only meaningful within their own run.

The meta files always have all of their columns. `meta/task.parquet` is written together with `task.parquet`, and has
one row per task that was submitted.

| File                       | Columns                                                                                                         |
|----------------------------|-----------------------------------------------------------------------------------------------------------------|
| `meta/simulation.parquet`  | `start_time`: the time the simulation starts, in milliseconds since the Unix epoch                             |
| `meta/dataCenter.parquet`  | `data_center_id`, `data_center_name`                                                                           |
| `meta/cluster.parquet`     | `cluster_id`, `cluster_name`, `data_center_id`                                                                 |
| `meta/host.parquet`        | `host_id`, `host_name`, `cluster_id`, `core_count`, `cpu_capacity` (MHz), `mem_capacity` (MiB), and `gpu_capacity_i` (MHz) per GPU |
| `meta/powerSource.parquet` | `power_source_id`, `power_source_name`, `data_center_id`                                                       |
| `meta/battery.parquet`     | `battery_id`, `battery_name`, `data_center_id`, `capacity` (J)                                                 |
| `meta/task.parquet`        | `task_id`, `cpu_count`, `mem_capacity` (MiB), `gpu_count`, `submission_time` (ms since the start of the simulation) |
