---
sidebar_position: 2
description: The columns of task.parquet.
---

# task.parquet

`task.parquet` describes the state and resource use of each task over time.

A task gets a row at every change of its state, and at every sample while it runs. 
A task that is not running, for example because it is waiting to be scheduled, does not export samples. Several changes can happen at
the same time, such as a task failing and being placed on another host. Each change gets its own row with the same
`timestamp`, in the order in which they happened. Keep the order of the file when reading it: sorting by `task_id` and
`timestamp` does not keep this order.

| Column             | Type   | Unit  | Description                                                                         |
|--------------------|--------|-------|-------------------------------------------------------------------------------------|
| `timestamp`        | int64  | ms    | The time of the row.                                                                |
| `task_id`          | int32  |       | The task, see [meta/task.parquet](./Meta.md).                                       |
| `host_id`          | int32  |       | The host the task last ran on, or null if it has not been placed yet.               |
| `task_state`       | string |       | `PROVISIONING`, `RUNNING`, `PAUSED`, `FAILED`, `COMPLETED` or `TERMINATED`.         |
| `cpu_usage`        | float  | MHz   | The CPU capacity the task uses. 0 when it does not run.                             |
| `cpu_demand`       | float  | MHz   | The CPU capacity the task asks for. 0 when it does not run.                         |
| `cpu_time_active`  | int64  | ms    | The total time the CPU was active for the task.                                     |
| `cpu_time_idle`    | int64  | ms    | The total time the CPU was idle for the task.                                       |
| `cpu_time_steal`   | int64  | ms    | The total time the task wanted to run, but no CPU capacity was available.           |
| `cpu_time_lost`    | int64  | ms    | The total CPU time lost to interference.                                            |
| `gpu_usage`        | float  | MHz   | The GPU capacity the task uses.                                                     |
| `gpu_demand`       | float  | MHz   | The GPU capacity the task asks for.                                                 |
| `gpu_time_active`  | int64  | ms    | The total time the GPU was active for the task.                                     |
| `gpu_time_idle`    | int64  | ms    | The total time the GPU was idle for the task.                                       |
| `gpu_time_steal`   | int64  | ms    | The total time the task wanted to run, but no GPU capacity was available.           |
| `gpu_time_lost`    | int64  | ms    | The total GPU time lost to interference.                                            |
| `num_failures`     | int64  | count | How often the task was interrupted by a host failure.                               |
| `num_pauses`       | int64  | count | How often the task was paused by a task stopper.                                    |
| `schedule_time`    | int64  | ms    | The last time the task was placed on a host, or null if it has never been placed.   |
| `finish_time`      | int64  | ms    | The last time the task completed, failed or was terminated, or null.                |
| `scheduling_delay` | int64  | ms    | The total time the task waited to be scheduled.                                     |
| `failure_delay`    | int64  | ms    | The time the task lost because of failures.                                         |
| `checkpoint_delay` | int64  | ms    | The time the task spent creating checkpoints.                                       |

The GPU columns are only written when the topology has GPUs.
