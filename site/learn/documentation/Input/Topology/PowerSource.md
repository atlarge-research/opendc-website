---
sidebar_position: 5
description: The power source of a data center, and the carbon trace used to compute carbon emissions.
---

# Power Source

Each [data center](./Topology.md#data-center) has a power source that powers its hosts. 
An important aspect of the Power Source is the carbon model defined by `carbon`. 
Using the carbon model of a Power Source, OpenDC can simulate the carbon footprint.

| Field      | Type                                                                | Default          | Description                                       |
|------------|---------------------------------------------------------------------|------------------|---------------------------------------------------|
| `name`     | string                                                              | `"PowerSource"`  | Name of the power source.                         |
| `maxPower` | [Power](../../Units.md)                                             | unlimited        | The maximum power the source can supply.          |
| `carbon`   | [trace reference](../Experiment.md#referencing-trace-files)         | no carbon trace  | The carbon intensity of the energy over time.     |

## Carbon traces

A carbon trace is a Parquet file with the carbon intensity of the energy over time:

| Column             | Type                     | Description                                           |
|--------------------|--------------------------|-------------------------------------------------------|
| `timestamp`        | timestamp (milliseconds) | The time from which the carbon intensity applies.     |
| `carbon_intensity` | double                   | The carbon intensity, in gCO2/kWh.                    |

## Example

```json
"powerSource": {
    "name": "grid",
    "carbon": { "type": "named", "name": "carbon_traces/NL_2021-2024.parquet" }
}
```
