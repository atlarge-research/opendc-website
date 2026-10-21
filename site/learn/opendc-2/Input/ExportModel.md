---
sidebar_position: 7
description: Export models, which decide which results OpenDC2 writes, and how often.
---

# Export model

An export model decides which [output files](../Output/Output.md) OpenDC writes, which columns they have, and how often
a sample is taken.

| Field                 | Type                                         | Default     | Description                                                                         |
|-----------------------|----------------------------------------------|-------------|-------------------------------------------------------------------------------------|
| `exportInterval`      | integer                                      | `300`       | The time between two samples, in seconds.                                           |
| `printFrequency`      | integer or `null`                            | `24`        | Print a progress line every this many samples. `null` turns progress lines off.     |
| `filesToExport`       | list of strings                              | all files   | The files to write. Choose from `host`, `task`, `powerSource`, `battery` and `service`. |
| `computeExportConfig` | [compute export config](#columns)            | all columns | The columns to write in each file.                                                  |

## Columns

`computeExportConfig` has a list of column names per file. A file without a list gets all of its columns.

| Field                      | Always written                                              |
|----------------------------|-------------------------------------------------------------|
| `hostExportColumns`        | `timestamp`, `timestamp_absolute`, `host_name`, `cluster_name` |
| `taskExportColumns`        | `timestamp`, `timestamp_absolute`, `task_id`, `task_name`   |
| `powerSourceExportColumns` | `timestamp`, `timestamp_absolute`, `source_name`, `cluster_name` |
| `batteryExportColumns`     | `timestamp`, `timestamp_absolute`, `battery_name`, `cluster_name` |
| `serviceExportColumns`     | `timestamp`, `timestamp_absolute`                           |

Column names are not case-sensitive. An unknown column name is ignored with an error message, and a list without any
valid column name writes all columns.

## Example

```json
"exportModels": [
    {
        "exportInterval": 3600,
        "printFrequency": 168,
        "filesToExport": ["host", "task", "service"],
        "computeExportConfig": {
            "hostExportColumns": ["power_draw", "energy_usage", "cpu_usage", "cpu_utilization"],
            "taskExportColumns": ["submission_time", "schedule_time", "finish_time", "task_state"],
            "serviceExportColumns": ["tasks_total", "tasks_pending", "tasks_active", "tasks_completed", "tasks_terminated", "hosts_up"]
        }
    }
]
```

This takes a sample every hour, prints progress every week of simulated time, and writes only the host, task and
service files, each with a few columns.
