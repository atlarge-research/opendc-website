---
sidebar_position: 4
description: Allocation policies, which decide on which host each task runs, and when.
---

# Allocation policy

An allocation policy decides on which host each task runs, and when. A policy is either a ready-made
[prefab](#prefabs), or a [filter](#filter-policies) policy built from filters and weighers.

## Filter policies

A filter policy places each task in two steps:

1. The **filters** remove the hosts that cannot run the task.
2. The **weighers** score the remaining hosts. Each weigher's scores are scaled to between 0 and its `multiplier`, and
   added up. The task goes to the host with the highest total. A negative multiplier prefers low values instead of
   high ones.

| Field       | Type                                  | Default                    | Description                                         |
|-------------|---------------------------------------|----------------------------|-----------------------------------------------------|
| `filters`   | list of [filters](#filters)           | `[{ "type": "compute" }]`  | The filters, all of which a host must pass.         |
| `weighers`  | list of [weighers](#weighers)         | `[]`                       | The weighers that rank the hosts.                   |
| `timeshift` | [time-shifting](#time-shifting)       | none                       | Delays tasks while the carbon intensity is high.    |

```json
{
    "type": "filter",
    "filters": [
        { "type": "compute" },
        { "type": "vcpu", "allocationRatio": 1.0 },
        { "type": "ram" }
    ],
    "weighers": [
        { "type": "ram", "multiplier": 1.0 }
    ]
}
```

### Filters

| Type            | Fields                         | Keeps the hosts that                                                                                   |
|-----------------|--------------------------------|--------------------------------------------------------------------------------------------------------|
| `compute`       |                                | are up.                                                                                                |
| `vcpu`          | `allocationRatio` (default `1.0`) | have enough free CPU cores. An `allocationRatio` above 1 allows overcommitting cores.                |
| `vcpuCapacity`  |                                | have cores at least as fast as the task needs.                                                         |
| `ram`           | `allocationRatio` (default `1.0`) | have enough free memory. **Do not change `allocationRatio`:** overcommitting memory is not supported yet. |
| `vgpu`          | `allocationRatio` (default `1.0`) | have enough free GPU cores.                                                                          |
| `instanceCount` | `limit`                        | run fewer than `limit` tasks.                                                                          |
| `sameHost`      |                                | Currently has no effect.                                                                               |
| `differentHost` |                                | Currently has no effect.                                                                               |

### Weighers

Every weigher has a `multiplier` (default `1.0`).

| Type            | Scores a host by                                                               |
|-----------------|--------------------------------------------------------------------------------|
| `ram`           | its free memory.                                                               |
| `coreRam`       | its free memory per core.                                                      |
| `instanceCount` | the number of tasks it runs.                                                   |
| `vcpuCapacity`  | its total CPU capacity.                                                        |
| `vcpu`          | how few CPU cores are provisioned on it. A higher score means fewer cores in use. |
| `vgpu`          | how few GPU cores are provisioned on it.                                       |

### Time-shifting

With `timeshift`, the policy delays deferrable tasks while the carbon intensity of the power source is high, as long
as they can still meet their deadline. Tasks shorter than two hours use `shortForecastThreshold`, longer tasks use
`longForecastThreshold`. The carbon intensity comes from the carbon trace of the
[power source](./Topology/PowerSource.md).

| Field                    | Type                       | Default | Description                                                                                       |
|--------------------------|----------------------------|---------|---------------------------------------------------------------------------------------------------|
| `forecast`               | boolean                    | `true`  | Compare the carbon intensity with a forecast. Otherwise, compare it with the mean of the last `windowSize` values. |
| `forecastSize`           | integer                    | `24`    | The number of forecasted values to compare with.                                                  |
| `shortForecastThreshold` | number                     | `0.2`   | The carbon intensity is low for short tasks when it is below this quantile of the forecast.      |
| `longForecastThreshold`  | number                     | `0.35`  | The same, for long tasks.                                                                         |
| `windowSize`             | integer                    | `168`   | The number of past values in the mean.                                                            |
| `taskStopper`            | [task stopper](#task-stopper) | none | Also pauses running tasks while the carbon intensity is high.                                     |

#### Task stopper

| Field               | Type    | Default | Description                                                         |
|---------------------|---------|---------|---------------------------------------------------------------------|
| `forecast`          | boolean | `true`  | Use a forecast instead of past values.                              |
| `forecastSize`      | integer | `24`    | The number of forecasted values.                                    |
| `forecastThreshold` | number  | `0.6`   | The threshold, between 0 and 1, above which tasks are paused.       |
| `windowSize`        | integer | `168`   | The number of past values used.                                     |

```json
{
    "type": "filter",
    "filters": [{ "type": "compute" }, { "type": "vcpu" }, { "type": "ram" }],
    "weighers": [{ "type": "ram" }],
    "timeshift": {
        "shortForecastThreshold": 0.2,
        "longForecastThreshold": 0.35,
        "taskStopper": { "forecastThreshold": 0.6 }
    }
}
```

## Prefabs

A prefab is a ready-made filter policy, selected by name:

```json
{ "type": "prefab", "prefabName": "Mem" }
```

All prefabs use the `compute`, `vcpu` and `ram` filters. The GPU prefabs also use the `vgpu` filter.

| Prefab                      | Weighers                          | Notes                          |
|-----------------------------|-----------------------------------|--------------------------------|
| `Mem`                       | `ram` (1.0)                       | The default policy.            |
| `MemInv`                    | `ram` (-1.0)                      |                                |
| `CoreMem`                   | `coreRam` (1.0)                   |                                |
| `CoreMemInv`                | `coreRam` (-1.0)                  |                                |
| `ActiveServers`             | `instanceCount` (-1.0)            |                                |
| `ActiveServersInv`          | `instanceCount` (1.0)             |                                |
| `ProvisionedCores`          | `vcpu` (1.0)                      |                                |
| `ProvisionedCoresInv`       | `vcpu` (-1.0)                     |                                |
| `TaskNumMemorizing`         | `instanceCount` (-1.0)            |                                |
| `Timeshift`                 | `ram` (1.0)                       | With time-shifting, using its defaults. |
| `ProvisionedCpuGpuCores`    | `vcpu` (1.0), `vgpu` (1.0)        | GPU prefab.                    |
| `ProvisionedCpuGpuCoresInv` | `vcpu` (-1.0), `vgpu` (-1.0)      | GPU prefab.                    |
| `GpuTaskMemorizing`         | `instanceCount` (-1.0)            | GPU prefab.                    |
