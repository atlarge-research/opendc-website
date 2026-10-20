---
sidebar_position: 5
description: The columns of battery.parquet.
---

# battery.parquet

`battery.parquet` has one row per [battery](../Input/Topology/Battery.md) per sample. It describes the charge and state
of each battery.

| Column                     | Type   | Unit | Description                                                     |
|----------------------------|--------|------|-----------------------------------------------------------------|
| `timestamp`                | int64  | ms   | The time of the sample.                                         |
| `battery_id`               | int32  |      | The battery, see [meta/battery.parquet](./Meta.md).             |
| `battery_state`            | string |      | `CHARGING`, `IDLE` or `DISCHARGING`.                            |
| `charge`                   | float  | J    | The energy stored in the battery.                               |
| `power_draw`               | float  | W    | The power the battery supplies.                                 |
| `energy_usage`             | float  | J    | The energy the battery supplied since the start of the simulation. |
| `embodied_carbon_emission` | float  | g    | The embodied carbon of the battery.                             |
