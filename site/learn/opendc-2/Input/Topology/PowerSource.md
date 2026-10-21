---
sidebar_position: 5
description: The power source of a cluster, and the carbon trace used to compute carbon emissions.
---

# Power source

Each [cluster](./Topology.md#cluster) has a power source that powers its hosts. A power source can be linked to a
carbon trace, which OpenDC uses to compute the carbon emissions of the cluster.

| Field             | Type    | Default         | Description                                                  |
|-------------------|---------|-----------------|--------------------------------------------------------------|
| `name`            | string  | `"PowerSource"` | Name of the power source.                                    |
| `maxPower`        | integer | unlimited       | The maximum power the source can supply, in Watt.            |
| `carbonTracePath` | string  | no carbon trace | The path to a carbon trace with the carbon intensity of the energy over time. |

## Carbon traces

A carbon trace is a Parquet file with the carbon intensity of the energy over time:

| Column             | Type                     | Description                                       |
|--------------------|--------------------------|---------------------------------------------------|
| `timestamp`        | timestamp (milliseconds) | The time from which the carbon intensity applies. |
| `carbon_intensity` | double                   | The carbon intensity, in gCO2/kWh.                |

## Example

```json
"powerSource": {
    "carbonTracePath": "carbon_traces/AT_2021-2024.parquet"
}
```
