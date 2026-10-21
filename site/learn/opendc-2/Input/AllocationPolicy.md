---
sidebar_position: 4
description: Allocation policies, which decide on which host each task runs, and when.
---

# Allocation policy

An allocation policy decides on which host each task runs, and when. The `type` selects the kind of policy:

| Type        | Description                                                                          |
|-------------|--------------------------------------------------------------------------------------|
| `prefab`    | A ready-made policy, selected by name. See [prefabs](#prefabs).                      |
| `filter`    | A policy built from [filters](#filters) and [weighers](#weighers).                   |
| `timeshift` | A filter policy that also delays tasks while the carbon intensity is high. See [time-shifting](#time-shifting). |

## Filter policies

A filter policy places each task in two steps:

1. The **filters** remove the hosts that cannot run the task.
2. The **weighers** rank the remaining hosts. Each weigher's score is weighted by its `multiplier`. A negative
   multiplier prefers low values instead of high ones.

The task goes to the best host, or to a random host among the `subsetSize` best hosts.

| Field        | Type                          | Default                   | Description                                                 |
|--------------|-------------------------------|---------------------------|-------------------------------------------------------------|
| `filters`    | list of [filters](#filters)   | `[{ "type": "Compute" }]` | The filters, all of which a host must pass.                 |
| `weighers`   | list of [weighers](#weighers) | `[]`                      | The weighers that rank the hosts.                           |
| `subsetSize` | integer                       | `1`                       | The number of best hosts from which one is picked at random. |

```json
{
    "type": "filter",
    "filters": [
        { "type": "Compute" },
        { "type": "VCpu", "allocationRatio": 1.0 },
        { "type": "Ram" }
    ],
    "weighers": [
        { "type": "Ram", "multiplier": 1.0 }
    ]
}
```

### Filters

| Type            | Fields                            | Keeps the hosts that                                                                    |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `Compute`       |                                   | are up.                                                                                 |
| `VCpu`          | `allocationRatio` (default `1.0`) | have enough free CPU cores. An `allocationRatio` above 1 allows overcommitting cores.   |
| `VCpuCapacity`  |                                   | have cores at least as fast as the task needs.                                          |
| `Ram`           | `allocationRatio` (default `1.0`) | have enough free memory. **Do not change `allocationRatio`:** overcommitting memory is not supported. |
| `InstanceCount` | `limit`                           | run fewer than `limit` tasks.                                                           |
| `SameHost`      |                                   | Currently has no effect.                                                                |
| `DifferentHost` |                                   | Currently has no effect.                                                                |

### Weighers

Every weigher has a `multiplier` (default `1.0`).

| Type            | Scores a host by                                                                   |
|-----------------|------------------------------------------------------------------------------------|
| `Ram`           | its free memory.                                                                   |
| `CoreRam`       | its free memory per core.                                                          |
| `InstanceCount` | the number of tasks it runs.                                                       |
| `VCpuCapacity`  | its CPU capacity.                                                                  |
| `VCpu`          | how few CPU cores are provisioned on it. A higher score means fewer cores in use.  |

## Time-shifting

A `timeshift` policy filters and weighs hosts like a filter policy, but also delays deferrable tasks while the carbon
intensity is high, as long as they can still meet their deadline. Tasks shorter than two hours use
`shortForecastThreshold`, longer tasks use `longForecastThreshold`. The carbon intensity comes from the carbon trace of
the [power source](./Topology/PowerSource.md).

| Field                    | Type                          | Default                   | Description                                                                                         |
|--------------------------|-------------------------------|---------------------------|-----------------------------------------------------------------------------------------------------|
| `filters`                | list of [filters](#filters)   | `[{ "type": "Compute" }]` | The filters, all of which a host must pass.                                                         |
| `weighers`               | list of [weighers](#weighers) | `[]`                      | The weighers that rank the hosts.                                                                   |
| `subsetSize`             | integer                       | `1`                       | The number of best hosts from which one is picked at random.                                        |
| `forecast`               | boolean                       | `true`                    | Compare the carbon intensity with a forecast. Otherwise, compare it with the mean of the last `windowSize` values. |
| `forecastSize`           | integer                       | `24`                      | The number of forecasted values to compare with.                                                    |
| `shortForecastThreshold` | number                        | `0.2`                     | The carbon intensity is low for short tasks when it is below this quantile of the forecast.        |
| `longForecastThreshold`  | number                        | `0.35`                    | The same, for long tasks.                                                                           |
| `windowSize`             | integer                       | `168`                     | The number of past values in the mean.                                                              |
| `memorize`               | boolean                       | `true`                    | Use the faster memorizing scheduler, which places each task on a fitting host with the fewest tasks and ignores the weighers. |
| `taskStopper`            | [task stopper](#task-stopper) | none                      | Also pauses running tasks while the carbon intensity is high.                                       |

### Task stopper

| Field               | Type    | Default | Description                                                   |
|---------------------|---------|---------|---------------------------------------------------------------|
| `forecast`          | boolean | `true`  | Use a forecast instead of past values.                        |
| `forecastSize`      | integer | `24`    | The number of forecasted values.                              |
| `forecastThreshold` | number  | `0.6`   | The threshold, between 0 and 1, above which tasks are paused. |
| `windowSize`        | integer | `168`   | The number of past values used.                               |

```json
{
    "type": "timeshift",
    "filters": [{ "type": "Compute" }, { "type": "VCpu" }, { "type": "Ram" }],
    "weighers": [{ "type": "Ram" }],
    "shortForecastThreshold": 0.2,
    "longForecastThreshold": 0.35,
    "taskStopper": { "forecastThreshold": 0.6 }
}
```

## Prefabs

A prefab is a ready-made policy, selected by name. The name is not case-sensitive.

```json
{ "type": "prefab", "policyName": "Mem" }
```

Unless noted otherwise, the prefabs use the `Compute`, `VCpu` and `Ram` filters. The GPU prefabs also check that a host
has enough free GPU cores.

| Prefab                      | Weighers                     | Notes                                                    |
|-----------------------------|------------------------------|----------------------------------------------------------|
| `Mem`                       | `Ram` (1.0)                  | The default policy. Uses only the `VCpu` and `Ram` filters. |
| `MemInv`                    | `Ram` (-1.0)                 |                                                          |
| `CoreMem`                   | `CoreRam` (1.0)              |                                                          |
| `CoreMemInv`                | `CoreRam` (-1.0)             |                                                          |
| `ActiveServers`             | `InstanceCount` (-1.0)       |                                                          |
| `ActiveServersInv`          | `InstanceCount` (1.0)        |                                                          |
| `ProvisionedCores`          | `VCpu` (1.0)                 |                                                          |
| `ProvisionedCoresInv`       | `VCpu` (-1.0)                |                                                          |
| `Random`                    | none                         | Picks a random host that passes the filters.             |
| `TaskNumMemorizing`         | none                         | Places each task on a fitting host with the fewest tasks. |
| `Timeshift`                 | `Ram` (1.0)                  | With time-shifting, using its defaults.                  |
| `ProvisionedCpuGpuCores`    | `VCpu` (1.0), GPU cores (1.0)   | GPU prefab.                                           |
| `ProvisionedCpuGpuCoresInv` | `VCpu` (-1.0), GPU cores (-1.0) | GPU prefab.                                           |
| `GpuTaskMemorizing`         | none                         | GPU prefab. Places each task on a fitting host with the fewest tasks. |
