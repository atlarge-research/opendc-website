---
sidebar_position: 6
description: The columns of cluster.parquet.
---

# cluster.parquet

`cluster.parquet` has one row per [cluster](../Input/Topology/Topology.md#cluster) per sample. It describes the power
draw and carbon emissions of the hosts in each cluster.

| Column             | Type  | Unit     | Description                                                     |
|--------------------|-------|----------|-----------------------------------------------------------------|
| `timestamp`        | int64 | ms       | The time of the sample.                                         |
| `cluster_id`       | int32 |          | The cluster, see [meta/cluster.parquet](./Meta.md).             |
| `power_draw`       | float | W        | The power draw of the cluster.                                  |
| `energy_usage`     | float | J        | The energy the cluster used since the start of the simulation.  |
| `carbon_intensity` | float | gCO2/kWh | The carbon intensity of the energy.                             |
| `carbon_emission`  | float | g        | The carbon emitted since the start of the simulation.           |
