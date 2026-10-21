---
sidebar_position: 3
description: Distribution policies, which determine how a CPU or GPU is shared between the tasks on a host.
---

# Distribution policy

A distribution policy determines how the capacity of a CPU or GPU is shared between the tasks on a host. Every host
has one for its CPU (`cpuDistributionPolicy`) and one for its GPU (`gpuDistributionPolicy`). The default is
`MAX_MIN_FAIRNESS`.

The `type` selects the policy:

| Type               | Fields                                               | Behaviour                                                                                                     |
|--------------------|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `MAX_MIN_FAIRNESS` |                                                      | Satisfies the smallest demands first, so that no task is starved. This is the default.                        |
| `BEST_EFFORT`      | `updateIntervalLength` (milliseconds, default `1000`) | Round-robin over the tasks, rotating every `updateIntervalLength`, while using as much of the capacity as possible. Inspired by NVIDIA's vGPU scheduler. |
| `EQUAL_SHARE`      |                                                      | Gives every task the same share of the capacity, regardless of its demand. Inspired by NVIDIA's vGPU scheduler. |
| `FIRST_FIT`        |                                                      | Gives each task its full demand, in order, until the capacity is used up.                                     |
| `FIXED_SHARE`      | `shareRatio` (default `1.0`)                         | Gives each active task a fixed fraction of the capacity. Unused shares are not given to other tasks. Inspired by NVIDIA's vGPU scheduler. |

## Example

```json
"gpuDistributionPolicy": {
    "type": "BEST_EFFORT",
    "updateIntervalLength": 60000
}
```
