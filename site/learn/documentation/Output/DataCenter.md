---
sidebar_position: 7
description: The columns of dataCenter.parquet.
---

# dataCenter.parquet

`dataCenter.parquet` has one row per [data center](../Input/Topology/Topology.md#data-center) per sample. It describes
the power draw and carbon emissions of each data center.

| Column             | Type  | Unit     | Description                                                         |
|--------------------|-------|----------|---------------------------------------------------------------------|
| `timestamp`        | int64 | ms       | The time of the sample.                                             |
| `data_center_id`   | int32 |          | The data center, see [meta/dataCenter.parquet](./Meta.md).          |
| `power_draw`       | float | W        | The power draw of the data center.                                  |
| `energy_usage`     | float | J        | The energy the data center used since the start of the simulation.  |
| `carbon_intensity` | float | gCO2/kWh | The carbon intensity of the energy.                                 |
| `carbon_emission`  | float | g        | The carbon emitted since the start of the simulation.               |
