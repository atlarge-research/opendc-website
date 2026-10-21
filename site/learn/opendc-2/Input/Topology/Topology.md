---
sidebar_position: 2
description: The topology file, which defines the clusters and hosts that are simulated.
---

# Topology

A topology defines the hardware that is simulated. It is a JSON file that an [experiment](../Experiment.md) refers to
with `pathToFile`. A topology consists of one or more clusters. Each cluster has hosts, a power source and an optional
battery.

```
topology
└── clusters
    ├── powerSource
    ├── battery
    └── hosts
        ├── cpu, memory, gpu
        ├── cpuPowerModel, gpuPowerModel
        └── cpuDistributionPolicy, gpuDistributionPolicy
```

## Topology

| Field      | Type                         | Default  | Description                   |
|------------|------------------------------|----------|-------------------------------|
| `clusters` | list of [clusters](#cluster) | required | The clusters in the topology. |

## Cluster

| Field         | Type                             | Default                          | Description                                  |
|---------------|----------------------------------|----------------------------------|----------------------------------------------|
| `name`        | string                           | `"Cluster"`                      | Name of the cluster.                         |
| `count`       | integer                          | `1`                              | The number of identical clusters to create.  |
| `hosts`       | list of [hosts](./Host.md)       | required                         | The hosts in the cluster.                    |
| `powerSource` | [Power source](./PowerSource.md) | unlimited power, no carbon trace | The power source of the cluster.             |
| `battery`     | [Battery](./Battery.md)          | no battery                       | A battery that stores energy for the cluster. |

## Example

A topology with two identical clusters of 16 hosts, which use the carbon trace of the Netherlands:

```json
{
    "clusters": [
        {
            "name": "C01",
            "count": 2,
            "hosts": [
                {
                    "name": "H01",
                    "count": 16,
                    "cpu": { "coreCount": 32, "coreSpeed": "2.1 GHz" },
                    "memory": { "memorySize": "256 GiB" },
                    "cpuPowerModel": { "modelType": "linear", "idlePower": "100 W", "maxPower": "350 W" }
                }
            ],
            "powerSource": {
                "carbonTracePath": "carbon_traces/NL_2021-2024.parquet"
            }
        }
    ]
}
```
