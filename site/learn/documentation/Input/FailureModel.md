---
sidebar_position: 5
description: Failure models, which decide when hosts fail, for how long, and how many.
---

# Failure model

OpenDC can be used to simulation failures. Host failure is an important aspect of data center operations. A failure model decides when hosts fail, how long a failure lasts, and how many hosts it affects. At the moment, OpenDC only models start-stop failures. 
When a host failes, all it tasks are interupted and the host can not be used until the failure ends. A task that has failed `maxNumFailures` times (see
[Experiment](./Experiment.md)) is terminated.

There are four types of failure models selected by the `type` parameter:

| Type     | Description                                                                         |
|----------|-------------------------------------------------------------------------------------|
| `none`   | No failures. This is the default.                                                   |
| `prefab` | A built-in model based on measured failures.                                        |
| `custom` | Samples each failure from three distributions.                                      |
| `trace`  | Replays the failures in a failure trace.                                            |

## Custom models

A custom model samples every failure from three distributions:

| Field          | Description                                                                    |
|----------------|--------------------------------------------------------------------------------|
| `interArrival` | The time between two failures, in hours.                                       |
| `duration`     | How long a failure lasts, in hours.                                            |
| `hostFraction` | The fraction of hosts that fail, clamped to between 0 and 1.                   |

Each field is one of the following distributions:

| Type          | Fields             |
|---------------|--------------------|
| `constant`    | `value`            |
| `exponential` | `mean`             |
| `gamma`       | `shape`, `scale`   |
| `log-normal`  | `scale`, `shape`   |
| `normal`      | `mean`, `std`      |
| `pareto`      | `scale`, `shape`   |
| `uniform`     | `lower`, `upper`   |
| `weibull`     | `alpha`, `beta`    |

Custom models are random, so their results depend on the seed of the run.

```json
{
    "type": "custom",
    "interArrival": { "type": "exponential", "mean": 24.0 },
    "duration": { "type": "log-normal", "scale": 1.0, "shape": 0.5 },
    "hostFraction": { "type": "uniform", "lower": 0.1, "upper": 0.5 }
}
```

## Trace models

| Field        | Type                                                       | Default  | Description                                                                         |
|--------------|------------------------------------------------------------|----------|-------------------------------------------------------------------------------------|
| `source`     | [trace reference](./Experiment.md#referencing-trace-files) | required | The failure trace.                                                                  |
| `startPoint` | number                                                     | `0.0`    | Where in the trace to start, as a fraction between 0 and 1. The failures before it are replayed at the end. |
| `repeat`     | boolean                                                    | `true`   | Start again from the beginning when the trace ends.                                 |

A failure trace is a Parquet file with one row per failure:

| Column              | Type   | Description                                     |
|---------------------|--------|-------------------------------------------------|
| `failure_interval`  | int64  | The time since the previous failure, in milliseconds. |
| `failure_duration`  | int64  | How long the failure lasts, in milliseconds.    |
| `failure_intensity` | double | The fraction of hosts that fail.                |

```json
{
    "type": "trace",
    "source": { "type": "named", "name": "failure_traces/my_failures.parquet" }
}
```

## Prefab models

```json
{ "type": "prefab", "prefabName": "G5k06Exp" }
```

The prefabs are fitted to the traces of [The Failure Trace Archive](https://www.sciencedirect.com/science/article/pii/S0743731513000634).
The name combines a trace with a distribution:

- Traces: `G5k06`, `Lanl05`, `Ldns04`, `Microsoft99`, `Nd07cpu`, `Overnet03`, `Pl05`, `Skype06`, `Websites02`
- Distributions: `Exp` (exponential), `Wbl` (Weibull), `LogN` (log-normal), `Gam` (gamma)

For example, `Lanl05Wbl` uses a Weibull distribution fitted to the LANL 2005 trace. Every prefab affects a uniformly
random fraction of the hosts.