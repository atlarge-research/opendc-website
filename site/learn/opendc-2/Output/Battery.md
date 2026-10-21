---
sidebar_position: 5
description: The columns of battery.parquet in OpenDC2.
---

# battery.parquet

`battery.parquet` has one row per [battery](../Input/Topology/Battery.md) per sample. It describes the charge and state
of each battery.

| Column                     | Type   | Unit | Description                                                     |
|----------------------------|--------|------|-----------------------------------------------------------------|
| `timestamp`                | int64  | ms   | The time of the sample, since the start of the simulation.      |
| `timestamp_absolute`       | int64  | ms   | The time of the sample, since the Unix epoch.                   |
| `battery_name`             | string |      | The name of the battery.                                        |
| `cluster_name`             | string |      | The name of the cluster of the battery.                         |
| `power_draw`               | float  | W    | The power the battery supplies.                                 |
| `energy_usage`             | float  | J    | The energy the battery supplied since the previous sample.      |
| `embodied_carbon_emission` | float  | g    | The embodied carbon of the battery, since the previous sample.  |
| `charge`                   | float  | J    | The energy stored in the battery.                               |
| `capacity`                 | float  | J    | The amount of energy the battery can store.                     |
| `battery_state`            | string |      | `CHARGING`, `IDLE` or `DISCHARGING`.                            |
