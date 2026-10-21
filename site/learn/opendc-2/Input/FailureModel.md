---
sidebar_position: 5
description: Failure models, which decide when hosts fail, for how long, and how many.
---

# Failure model

A failure model decides when hosts fail, how long a failure lasts, and how many hosts it affects. A failed host stops
all of its tasks and cannot be used until the failure ends. A task that has failed `maxNumFailures` times (see
[Experiment](./Experiment.md)) is terminated.

The `type` selects the model. Without a failure model, or with `null`, no failures are injected.

| Type          | Description                                                      |
|---------------|------------------------------------------------------------------|
| `no`          | No failures. Useful to compare runs with and without failures.   |
| `prefab`      | A built-in model based on measured failures.                     |
| `custom`      | Samples each failure from three distributions.                   |
| `trace-based` | Replays the failures in a failure trace.                         |

## Prefab models

```json
{ "type": "prefab", "prefabName": "G5k06Exp" }
```

The prefabs are fitted to the traces of [The Failure Trace Archive](https://www.sciencedirect.com/science/article/pii/S0743731513000634).
The name combines a trace with a distribution:

- Traces: `G5k06`, `Lanl05`, `Ldns04`, `Microsoft99`, `Nd07cpu`, `Overnet03`, `Pl05`, `Skype06`, `Websites02`
- Distributions: `Exp` (exponential), `Wbl` (Weibull), `LogN` (log-normal), `Gam` (gamma)

For example, `Lanl05Wbl` uses a Weibull distribution fitted to the LANL 2005 trace.

The table below lists the parameters of each prefab. The availability intervals give the time between two failures,
and the unavailability intervals the duration of a failure, both in hours.

![The parameters of the prefab failure models](/img/failureModels.png)

## Custom models

A custom model samples every failure from three distributions:

| Field             | Description                                                    |
|-------------------|----------------------------------------------------------------|
| `iatSampler`      | The time between two failures, in hours.                       |
| `durationSampler` | How long a failure lasts, in hours.                            |
| `nohSampler`      | The fraction of hosts that fail, between 0 and 1.              |

Each field is one of the following distributions:

| Type          | Fields           |
|---------------|------------------|
| `constant`    | `value`          |
| `exponential` | `mean`           |
| `gamma`       | `shape`, `scale` |
| `log-normal`  | `scale`, `shape` |
| `normal`      | `mean`, `std`    |
| `pareto`      | `scale`, `shape` |
| `uniform`     | `lower`, `upper` |
| `weibull`     | `alpha`, `beta`  |

Custom models are random, so their results depend on the seed of the run.

```json
{
    "type": "custom",
    "iatSampler": { "type": "exponential", "mean": 24.0 },
    "durationSampler": { "type": "weibull", "alpha": 0.5, "beta": 1.2 },
    "nohSampler": { "type": "constant", "value": 0.5 }
}
```

## Trace-based models

| Field        | Type    | Default  | Description                                                                                                 |
|--------------|---------|----------|-------------------------------------------------------------------------------------------------------------|
| `pathToFile` | string  | required | The path to the failure trace.                                                                              |
| `startPoint` | number  | `0.0`    | Where in the trace to start, as a fraction between 0 and 1. The failures before it are replayed at the end. |
| `repeat`     | boolean | `true`   | Start again from the beginning when the trace ends.                                                         |

A failure trace is a Parquet file with one row per failure:

| Column              | Type   | Description                                           |
|---------------------|--------|-------------------------------------------------------|
| `failure_interval`  | int64  | The time since the previous failure, in milliseconds. |
| `failure_duration`  | int64  | How long the failure lasts, in milliseconds.          |
| `failure_intensity` | double | The fraction of hosts that fail.                      |

```json
{
    "type": "trace-based",
    "pathToFile": "failure_traces/my_failures.parquet",
    "repeat": false
}
```
