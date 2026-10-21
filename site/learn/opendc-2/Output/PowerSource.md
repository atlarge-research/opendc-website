---
sidebar_position: 4
description: The columns of powerSource.parquet in OpenDC2.
---

# powerSource.parquet

`powerSource.parquet` has one row per [power source](../Input/Topology/PowerSource.md) per sample. It describes the
power supplied by each power source, and the carbon emitted to produce it.

| Column               | Type   | Unit     | Description                                                 |
|----------------------|--------|----------|-------------------------------------------------------------|
| `timestamp`          | int64  | ms       | The time of the sample, since the start of the simulation.  |
| `timestamp_absolute` | int64  | ms       | The time of the sample, since the Unix epoch.               |
| `source_name`        | string |          | The name of the power source.                               |
| `cluster_name`       | string |          | The name of the cluster of the power source.                |
| `power_draw`         | float  | W        | The power supplied by the power source.                     |
| `energy_usage`       | float  | J        | The energy supplied since the previous sample.              |
| `carbon_intensity`   | float  | gCO2/kWh | The carbon intensity of the energy, from the carbon trace.  |
| `carbon_emission`    | float  | g        | The carbon emitted since the previous sample.               |
