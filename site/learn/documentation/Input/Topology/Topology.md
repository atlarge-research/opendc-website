---
sidebar_position: 2
description: The topology, which defines the data centers, clusters and hosts that are simulated.
---

# Topology

A topology defines the hardware that is simulated. A topololgy contains of one or more data centers. 
Each data center contains a power source, an optional battery, and one or more clusters of hosts.

```
topology
└── datacenters
    ├── powerSource
    ├── battery
    └── clusters
        └── hosts
            ├── cpu, memory, gpu
            ├── cpuPowerModel, gpuPowerModel
            └── cpuDistribution, gpuDistribution
```

A topology can be written directly in the experiment, or in a separate file that the experiment imports with
`importFrom` (see [Experiment](../Experiment.md#splitting-an-experiment-over-several-files)).

## Topology

| Field         | Type                               | Default  | Description                      |
|---------------|------------------------------------|----------|----------------------------------|
| `datacenters` | list of [data centers](#data-center) | required | The data centers in the topology. |

## Data center

| Field         | Type                                | Default                          | Description                                          |
|---------------|-------------------------------------|----------------------------------|------------------------------------------------------|
| `name`        | string                              | `"DC"`                           | Name of the data center.                             |
| `clusters`    | list of [clusters](#cluster)        | required                         | The clusters in the data center.                     |
| `powerSource` | [Power source](./PowerSource.md)    | unlimited power, no carbon trace | The power source used by the data center and its connected carbon model.                 |
| `battery`     | [Battery](./Battery.md)             | no battery                       | A battery that can store energy for the data center.    |

## Cluster

| Field   | Type                       | Default     | Description                                    |
|---------|----------------------------|-------------|------------------------------------------------|
| `name`  | string                     | `"Cluster"` | Name of the cluster.                           |
| `count` | integer                    | `1`         | The number of identical clusters to create.    |
| `hosts` | list of [hosts](./Host.md) | required    | The hosts in the cluster.                      |

:::note Older topology files
Topologies that list `clusters` at the top level, with a power source and battery per cluster, can still be read.
OpenDC puts the clusters in a single data center and logs a warning. Only the power source and battery of the first
cluster are kept.
:::

:::note Regarding naming
Users can provide names for Data Centers, Clusters, and Hosts. 

This can be done to better understand the generated output. 
If a name is used multiple times, OpenDC will add an increasing suffix in the form `name-i`.
:::

## Example

A data center with two clusters. The first has 16 identical hosts, the second has 4 hosts with a GPU:

```json
{
    "datacenters": [
        {
            "name": "DC1",
            "powerSource": {
                "carbon": { "type": "named", "name": "carbon_traces/NL_2021-2024.parquet" }
            },
            "clusters": [
                {
                    "name": "cpu-cluster",
                    "hosts": [
                        {
                            "name": "cpu-host",
                            "count": 16,
                            "cpu": { "coreCount": 32, "coreSpeed": "2.1 GHz" },
                            "memory": { "size": "256 GiB" },
                            "cpuPowerModel": { "type": "linear", "idlePower": "100 W", "maxPower": "350 W" }
                        }
                    ]
                },
                {
                    "name": "gpu-cluster",
                    "hosts": [
                        {
                            "name": "gpu-host",
                            "count": 4,
                            "cpu": { "coreCount": 16, "coreSpeed": "2.4 GHz" },
                            "memory": { "size": "128 GiB" },
                            "gpu": { "coreCount": 5120, "coreSpeed": "1.5 GHz", "memory": "32 GiB" }
                        }
                    ]
                }
            ]
        }
    ]
}
```
