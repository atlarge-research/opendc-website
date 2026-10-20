---
sidebar_position: 7
description: Export models, which decide which results OpenDC writes, and how often.
---

# Export model

An export model decides which [output files](../Output/Output.md) OpenDC writes, which columns they have, and how often
a sample is taken.

| Field           | Type                    | Default     | Description                                                                                         |
|-----------------|-------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| `exportInterval`| [Duration](../Units.md) | `5 minutes` | The time between two samples.                                                                       |
| `printFrequency`| integer or `null`       | `24`        | Prints a small overview to the terminal every x samples.                     |
| `filesToExport` | list of strings         | all files   | The files to write. Choose from `host`, `task`, `service`, `powerSource`, `battery`, `cluster` and `datacenter`. |
| `columns`       | [columns](#columns)     | all columns | The columns to write in each file.                                                                  |

:::caution
A plain number for `exportInterval` is read in milliseconds. Write `"1 hours"` for an hour.
:::

## Columns

`columns` has an entry per file: `host`, `task`, `service`, `powerSource`, `battery`, `cluster` and `dataCenter`. Each
entry is either all columns, or a selection:

```json
{ "type": "all" }
{ "type": "only", "columns": ["power_draw", "energy_usage"] }
```

The id and `timestamp` columns are always written. GPU columns of the host file are selected without their GPU number:
`gpu_usage` selects `gpu_usage_0`, `gpu_usage_1`, and so on. An unknown column name is ignored with a warning.

## Example

```json
"exportModels": [
    {
        "exportInterval": "1 hours",
        "printFrequency": 168,
        "filesToExport": ["host", "task", "service"],
        "columns": {
            "host": { "type": "only", "columns": ["power_draw", "energy_usage", "cpu_utilization"] },
            "task": { "type": "only", "columns": ["task_state", "schedule_time", "finish_time"] }
        }
    }
]
```

This takes a sample every hour, prints progress every week of simulated time (168 samples), and writes only the host, task and
service files. The host and task export only a few columns, while the service exports all.
