---
sidebar_position: 2
description: The columns of task.parquet in OpenDC2.
---

# task.parquet

`task.parquet` has one row per task per sample. It describes the state and resource use of each task.

| Column               | Type   | Unit  | Description                                                                         |
|----------------------|--------|-------|-------------------------------------------------------------------------------------|
| `timestamp`          | int64  | ms    | The time of the sample, since the start of the simulation.                          |
| `timestamp_absolute` | int64  | ms    | The time of the sample, since the Unix epoch.                                       |
| `task_id`            | int32  |       | The id of the task.                                                                 |
| `task_name`          | string |       | The name of the task, from the workload trace.                                      |
| `host_name`          | string |       | The host the task runs on, or null if it has no host.                               |
| `mem_capacity`       | int64  | MiB   | The memory the task needs.                                                          |
| `cpu_count`          | int32  | count | The number of CPU cores the task needs.                                             |
| `cpu_limit`          | float  | MHz   | The CPU capacity of the host available to the task.                                 |
| `cpu_usage`          | float  | MHz   | The CPU capacity the task uses.                                                     |
| `cpu_demand`         | float  | MHz   | The CPU capacity the task asks for.                                                 |
| `cpu_time_active`    | int64  | ms    | The time the CPU was active for the task, since the previous sample.                |
| `cpu_time_idle`      | int64  | ms    | The time the CPU was idle for the task, since the previous sample.                  |
| `cpu_time_steal`     | int64  | ms    | The time the task wanted to run but no CPU capacity was available, since the previous sample. |
| `cpu_time_lost`      | int64  | ms    | The CPU time lost to interference, since the previous sample.                       |
| `gpu_count`          | int32  | count | The number of GPU cores the task needs.                                             |
| `gpu_limit`          | float  | MHz   | The GPU capacity of the host available to the task.                                 |
| `gpu_usage`          | float  | MHz   | The GPU capacity the task uses.                                                     |
| `gpu_demand`         | float  | MHz   | The GPU capacity the task asks for.                                                 |
| `gpu_time_active`    | int64  | ms    | The time the GPU was active for the task, since the previous sample.                |
| `gpu_time_idle`      | int64  | ms    | The time the GPU was idle for the task, since the previous sample.                  |
| `gpu_time_steal`     | int64  | ms    | The time the task wanted to run but no GPU capacity was available, since the previous sample. |
| `gpu_time_lost`      | int64  | ms    | The GPU time lost to interference, since the previous sample.                       |
| `uptime`             | int64  | ms    | The time the task was running, since the previous sample.                           |
| `downtime`           | int64  | ms    | The time the task was not running, since the previous sample.                       |
| `num_failures`       | int64  | count | How often the task was interrupted by a host failure.                               |
| `num_pauses`         | int64  | count | How often the task was paused by a task stopper.                                    |
| `submission_time`    | int64  | ms    | When the task was submitted.                                                        |
| `schedule_time`      | int64  | ms    | When the task was last placed on a host.                                            |
| `finish_time`        | int64  | ms    | When the task completed or was terminated.                                          |
| `task_state`         | string |       | The state of the task.                                                              |
| `scheduling_delay`   | int64  | ms    | The total time the task waited to be scheduled.                                     |
| `failure_delay`      | int64  | ms    | The time the task lost because of failures.                                         |
| `checkpoint_delay`   | int64  | ms    | The time the task spent creating checkpoints.                                       |
