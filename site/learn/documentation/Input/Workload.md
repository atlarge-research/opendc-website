---
sidebar_position: 3
description: Workloads, which define the tasks that are submitted to the data center.
---

# Workload

A workload defines the tasks that are submitted to the data center, when they are submitted, and how much CPU, GPU
and memory they use over time. 
Workloads can be defined directly in the `experiment`, or in a trace.

The `type` selects the kind of workload:

| Type              | Description                                                                                      |
|-------------------|--------------------------------------------------------------------------------------------------|
| `trace`           | Reads the tasks from a [workload trace](#workload-traces).                                        |
| `efficient-trace` | Like `trace`, but reads the trace in a single pass, which uses less memory for large traces and is faster. To be considered efficient, the trace must be ordered by submission_time and each task needs to indicate its number of fragments using the `num_fragments` column. |
| `inline`          | Lists the tasks in the experiment file.                                                           |

## Trace workloads

| Field            | Type                                                          | Default   | Description                                                                                         |
|------------------|---------------------------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------|
| `source`         | [trace reference](./Experiment.md#referencing-trace-files)    | required  | The directory of the workload trace.                                                                |
| `sampleFraction` | number                                                        | `1.0`     | Runs a random sample of the tasks that together have this fraction of the total work of the trace.  |
| `submissionTime` | string                                                        | unchanged | Moves the workload in time so that the first task is submitted at this time, such as `"2024-01-01T00:00:00"` (UTC). |
| `deferAll`       | boolean                                                       | `false`   | Makes every task deferrable, with a deadline of its submission time plus three times its duration. Alternatively, users can select which tasks can be deferred, and for how long, in the trace itself. |
| `scalingPolicy`  | [scaling policy](#scaling-policies)                           | `NoDelay` | What happens when a task gets less resources than it demands.                                                 |

```json
{
    "type": "trace",
    "source": { "type": "named", "name": "traces/bitbrains-small" },
    "submissionTime": "2024-01-01T00:00:00"
}
```

## Scaling policies

| Policy    | Behaviour                                                                                         |
|-----------|---------------------------------------------------------------------------------------------------|
| `NoDelay` | The task keeps its duration. Demand that is not met is lost. This is the default.                 |
| `Perfect` | The task runs longer, so that all of its work is eventually done.                                 |

## Inline workloads

An inline workload lists its tasks in the experiment using a JSON object. This is primarily used for small tests because it is easy to write and change.

| Field           | Type                                | Default   | Description                                          |
|-----------------|-------------------------------------|-----------|------------------------------------------------------|
| `tasks`         | list of [tasks](#tasks)             | required  | The tasks of the workload.                           |
| `scalingPolicy` | [scaling policy](#scaling-policies) | `NoDelay` | What happens when a task gets less than it demands.  |

### Tasks

| Field            | Type                         | Default     | Description                                                              |
|------------------|------------------------------|-------------|--------------------------------------------------------------------------|
| `id`             | integer                      | required    | Identifier of the task, unique within the workload.                      |
| `submissionTime` | [Duration](../Units.md)      | required    | When the task is submitted, from the start of the workload.              |
| `duration`       | [Duration](../Units.md)      | required    | How long the task runs.                                                  |
| `cpuCoreCount`   | integer                      | required    | The number of CPU cores the task needs.                                  |
| `cpuCapacity`    | [Frequency](../Units.md)     | required    | The CPU capacity the task needs.                                         |
| `memory`         | [Data size](../Units.md)     | required    | The memory the task needs.                                               |
| `fragments`      | list of fragments            | required    | The demand of the task over time. Each fragment has a `duration`, a `cpuUsage`, and optionally a `gpuUsage` and `gpuMemory`. |
| `gpuCoreCount`   | integer                      | `0`         | The number of GPU cores the task needs.                                  |
| `gpuCapacity`    | [Frequency](../Units.md)     | `0`         | The GPU capacity the task needs.                                         |
| `gpuMemory`      | [Data size](../Units.md)     | `0`         | The GPU memory the task needs.                                           |
| `deferrable`     | boolean                      | `false`     | Whether a [time-shifting](./AllocationPolicy.md#time-shifting) scheduler may delay the task. |
| `deadline`       | [Duration](../Units.md)      | no deadline | The latest time the task may finish, from the start of the workload.     |
| `parents`        | list of integers             | `[]`        | The tasks that must finish before this task can start.                   |
| `children`       | list of integers             | `[]`        | The tasks that depend on this task.                                      |

```json
{
    "type": "inline",
    "tasks": [
        {
            "id": 0,
            "submissionTime": "0 minutes",
            "duration": "10 minutes",
            "cpuCoreCount": 2,
            "cpuCapacity": "3.0 GHz",
            "memory": "2 GiB",
            "fragments": [
                { "duration": "5 minutes", "cpuUsage": "3.0 GHz" },
                { "duration": "5 minutes", "cpuUsage": "1.5 GHz" }
            ]
        }
    ]
}
```

## Workload traces

A workload trace is a directory with two Parquet files: `tasks.parquet` describes each task, and `fragments.parquet`
describes the demand of each task over time.

### tasks.parquet

| Column            | Type                     | Required | Description                                                         |
|-------------------|--------------------------|----------|---------------------------------------------------------------------|
| `id`              | int32                    | yes      | Main identifier of the task.                                             |
| `name`            | string                   | no       | Name of the task.                                                   |
| `submission_time` | timestamp (milliseconds) | yes      | When the task is submitted.                                         |
| `duration`        | int64                    | yes      | How long the task runs, in milliseconds.                            |
| `cpu_count`       | int32                    | yes      | The number of CPU cores the task needs.                             |
| `cpu_capacity`    | double                   | yes      | The CPU capacity the task needs, in MHz.                            |
| `mem_capacity`    | int64                    | yes      | The memory the task needs, in MiB.                                  |
| `gpu_count`       | int32                    | no       | The number of GPU cores the task needs.                             |
| `gpu_capacity`    | double                   | no       | The GPU capacity the task needs, in MHz.                            |
| `parents`         | list of int32            | no       | The tasks that must finish before this task can start.              |
| `children`        | list of int32            | no       | The tasks that depend on this task.                                 |
| `deferrable`      | boolean                  | no       | Whether a time-shifting scheduler may delay the task.               |
| `deadline`        | int64                    | no       | The latest time the task may finish, in milliseconds since the Unix epoch. This is used to determine for how long a task can be deferred by the time-shifting scheduler. |
| `num_fragments`   | int32                    | no       | The number of fragments of the task. Required for `efficient-trace`. |

### fragments.parquet

Each row is one fragment, during which the demand of a task is constant. The fragments of a task are in order.

| Column      | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| `id`        | int32  | yes      | Identifier of the task.                      |
| `duration`  | int64  | yes      | How long the fragment lasts, in milliseconds. |
| `cpu_usage` | double | yes      | The CPU demand during the fragment, in MHz.  |
| `gpu_usage` | double | no       | The GPU demand during the fragment, in MHz.  |
