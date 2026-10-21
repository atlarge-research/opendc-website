---
sidebar_position: 3
description: Workloads, which define the tasks that are submitted to the data center.
---

# Workload

A workload defines the tasks that are submitted to the data center, when they are submitted, and how much CPU, GPU
and memory they need over time. In OpenDC2, a workload is always read from a [workload trace](#workload-traces).

| Field            | Type                                | Default   | Description                                                                                         |
|------------------|-------------------------------------|-----------|-----------------------------------------------------------------------------------------------------|
| `pathToFile`     | string                              | required  | The directory of the workload trace.                                                                |
| `type`           | string                              | required  | The kind of workload. The only kind is `ComputeWorkload`.                                           |
| `sampleFraction` | number                              | `1.0`     | Runs a random sample of the tasks that together have this fraction of the total work of the trace.  |
| `submissionTime` | string                              | unchanged | Moves the workload in time so that the first task is submitted at this time, such as `"2024-01-01T00:00:00"` (UTC). |
| `deferAll`       | boolean                             | `false`   | Makes every task deferrable, with a deadline of its submission time plus three times its duration.  |
| `scalingPolicy`  | [scaling policy](#scaling-policies) | `NoDelay` | What happens when a task gets less than it demands.                                                 |

```json
{
    "pathToFile": "traces/bitbrains-small",
    "type": "ComputeWorkload"
}
```

## Scaling policies

| Policy    | Behaviour                                                                         |
|-----------|-----------------------------------------------------------------------------------|
| `NoDelay` | The task keeps its duration. Demand that is not met is lost. This is the default. |
| `Perfect` | The task runs longer, so that all of its work is eventually done.                 |

## Workload traces

A workload trace is a directory with two Parquet files: `tasks.parquet` describes each task, and `fragments.parquet`
describes the demand of each task over time.

### tasks.parquet

| Column            | Type                     | Required | Description                                                                |
|-------------------|--------------------------|----------|----------------------------------------------------------------------------|
| `id`              | int32                    | yes      | Identifier of the task.                                                    |
| `name`            | string                   | no       | Name of the task.                                                          |
| `submission_time` | timestamp (milliseconds) | yes      | When the task is submitted.                                                |
| `duration`        | int64                    | yes      | How long the task runs, in milliseconds.                                   |
| `cpu_count`       | int32                    | yes      | The number of CPU cores the task needs.                                    |
| `cpu_capacity`    | double                   | yes      | The CPU capacity the task needs, in MHz.                                   |
| `mem_capacity`    | int64                    | yes      | The memory the task needs, in MiB.                                         |
| `gpu_count`       | int32                    | no       | The number of GPU cores the task needs.                                    |
| `gpu_capacity`    | double                   | no       | The GPU capacity the task needs, in MHz.                                   |
| `parents`         | list of int32            | no       | The tasks that must finish before this task can start.                     |
| `children`        | list of int32            | no       | The tasks that depend on this task.                                        |
| `deferrable`      | boolean                  | no       | Whether a time-shifting scheduler may delay the task.                      |
| `deadline`        | int64                    | no       | The latest time the task may finish, in milliseconds since the Unix epoch. |

### fragments.parquet

Each row is one fragment, during which the demand of a task is constant. The fragments of a task are in order.

| Column      | Type   | Required | Description                                   |
|-------------|--------|----------|-----------------------------------------------|
| `id`        | int32  | yes      | Identifier of the task.                       |
| `duration`  | int64  | yes      | How long the fragment lasts, in milliseconds. |
| `cpu_usage` | double | yes      | The CPU demand during the fragment, in MHz.   |
| `gpu_usage` | double | no       | The GPU demand during the fragment, in MHz.   |
