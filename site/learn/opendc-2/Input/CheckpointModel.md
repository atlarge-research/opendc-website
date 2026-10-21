---
sidebar_position: 6
description: Checkpoint models, which let tasks save their progress so that a failure loses less work.
---

# Checkpoint model

With checkpointing, tasks regularly save their progress. When a host fails, its tasks restart from their last
checkpoint instead of from the beginning. Checkpointing is off by default.

| Field                       | Type    | Default             | Description                                                                                         |
|-----------------------------|---------|---------------------|-----------------------------------------------------------------------------------------------------|
| `checkpointInterval`        | integer | `3600000` (1 hour)  | The time between two checkpoints, in milliseconds.                                                  |
| `checkpointDuration`        | integer | `300000` (5 minutes) | How long it takes to create a checkpoint, in milliseconds.                                         |
| `checkpointIntervalScaling` | number  | `1.0`               | The factor by which `checkpointInterval` is multiplied after each checkpoint. `1.0` keeps it the same. |

## Example

```json
"checkpointModels": [
    null,
    { "checkpointInterval": 3600000, "checkpointDuration": 300000, "checkpointIntervalScaling": 1.5 }
]
```

This runs every scenario without and with checkpointing. With checkpointing, the time between checkpoints grows after
each checkpoint: 1 hour, 1.5 hours, 2.25 hours, and so on.
