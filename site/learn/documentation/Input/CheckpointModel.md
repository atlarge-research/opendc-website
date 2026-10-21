---
sidebar_position: 6
description: Checkpoint models, which let tasks save their progress so that a failure loses less work.
---

# Checkpoint model

Checkpointing is a technique used to reduce the impact of failures. When using checkpointing, tasks take periodic snapshots.
At a failure, the task does not have to restart fully, but restarts at the last snapshot. A checkpointing model defines when a task should make a snapshot. Checkpointing is off by default.

| Field             | Type                     | Default     | Description                                                                          |
|-------------------|--------------------------|-------------|--------------------------------------------------------------------------------------|
| `interval`        | [Duration](../Units.md)  | `1 hours`   | The time between two checkpoints.                                                    |
| `duration`        | [Duration](../Units.md)  | `5 minutes` | How long it takes to create a checkpoint.                                            |
| `intervalScaling` | number                   | `1.0`       | The factor by which `interval` is multiplied after each checkpoint. `1.0` keeps it the same. |

## Example

```json
"checkpointModels": [
    { "interval": "1 hours", "duration": "5 minutes", "intervalScaling": 1.5 }
]
```

In this example each task takes a snapshot at growing intervals at: 1 hour, 1.5 hours, 2.25 hours, and so on.
