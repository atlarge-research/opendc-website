---
sidebar_position: 3
description: Distribution policies, which determine how a CPU or GPU is shared between the tasks on a host.
---

# Distribution policy

A distribution policy determines how the resources of a CPU or GPU are shared between the tasks on a host. OpenDC defines 5 distribution policies, with the default policy being `maxMinFairness`.

The `type` selects the policy:

| Type             | Fields                                                     | Behaviour                                                                                                                         |
|------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `maxMinFairness` |                                                            | Satisfies the smallest demands first, so that no task is starved. This is the default.                                            |
| `bestEffort`     | `updateInterval` ([Duration](../../Units.md), default `1 s`) | Round-robin over the tasks, rotating every `updateInterval`, while using as much of the capacity as possible. Inspired by NVIDIA's vGPU scheduler. |
| `equalShare`     |                                                            | Gives every task the same share of the capacity, regardless of its demand. Inspired by NVIDIA's vGPU scheduler.                   |
| `firstFit`       |                                                            | Gives each task its full demand, in order, until the capacity is used up.                                                         |
| `fixedShare`     | `shareRatio` (default `1.0`)                               | Gives each active task a fixed fraction of the capacity. Unused shares are not given to other tasks. Inspired by NVIDIA's vGPU scheduler. |

## Example

```json
"gpuDistribution": {
    "type": "bestEffort",
    "updateInterval": "1 minutes"
}
```
