---
sidebar_position: 0
description: How to move experiments, topologies, workloads and analysis scripts from OpenDC2 to OpenDC3.
---

# Migrating to OpenDC3

OpenDC3 changes how experiments are written, how they are run, and what the output looks like. This page explains
how to keep running your OpenDC2 experiments, and how to move them to the format described in the
[OpenDC3 documentation](/learn/category/documentation).

## What changed

| Area              | OpenDC2                                                   | OpenDC3                                                                 |
|-------------------|------------------------------------------------------------|--------------------------------------------------------------------------|
| Running           | `OpenDCExperimentRunner --experiment-path experiment.json` | `opendc run experiment.json -o output`, see [Running OpenDC3](/learn/getting-started/running-opendc) |
| Topologies        | Separate files, referenced with `pathToFile`               | Written in the experiment, or imported from another file with `importFrom` |
| Topology layout   | Clusters, each with a power source and battery             | Data centers, each with a power source and battery, that contain clusters |
| Units             | Only topology values can have a unit                       | All physical values can have a unit, see [Units](/learn/documentation/Units) |
| Trace files       | Paths                                                      | Trace references, such as `{ "type": "named", "name": "traces/my-trace" }` |
| Output            | Names and fixed properties in every output file            | Ids in the output files, names and fixed properties in `meta/` files     |
| Measured values   | Energy, carbon, uptime and CPU time per sample             | Energy, carbon, uptime and CPU time as totals since the start             |

## Running OpenDC2 experiments on OpenDC3

OpenDC3 can run experiment files in the OpenDC2 format with the `--legacy` flag:

```bash
opendc --legacy run experiment.json -o output
```

`--legacy` is an option of `opendc` itself, not of `run`, so it has to come before the command. OpenDC converts the
experiment and its topologies to the OpenDC3 format before running them. Some behaviour differs from OpenDC2:

- Relative paths in the experiment are resolved against the directory you run `opendc` from, as in OpenDC2.
- `outputFolder` is ignored. Use `-o` to choose where the results are written.
- `-strict` is now `--strict`, and also comes before the command.
- Each cluster is created `count` times. OpenDC2 ignored `count` on clusters.
- The clusters of a topology are placed in a single data center, which uses the power source and battery of the first
  cluster.
- `subsetSize` is no longer supported, and is ignored.
- A policy that used the memorizing scheduler, such as a `timeshift` policy without `"memorize": false`, now uses an
  `instanceCount` weigher with a multiplier of -1.0. It still places each task on a fitting host with the fewest tasks.
- The `Random` prefab no longer exists.

## Converting experiments to the OpenDC3 format

Plain numbers keep their meaning, except for the values marked below. Writing values with a unit, such as `"1 hours"`,
avoids mistakes.

### Experiment

| OpenDC2                                      | OpenDC3                                                                   |
|-----------------------------------------------|----------------------------------------------------------------------------|
| `"topologies": [{ "pathToFile": "t.json" }]`  | `"topologies": [{ "importFrom": "t.json" }]`, or the topology itself. The path of `importFrom` is relative to the experiment file. |
| `outputFolder`                                | Removed. Use `opendc run -o`.                                              |
| An empty `name` gets a generated name         | An empty `name` writes the results directly into the output folder.       |
| `null` in `failureModels`                     | `{ "type": "none" }`                                                       |

### Topology

| OpenDC2                                                     | OpenDC3                                                         |
|--------------------------------------------------------------|------------------------------------------------------------------|
| `"clusters": [...]` at the top                               | `"datacenters": [{ "clusters": [...] }]`                          |
| `powerSource` and `battery` of a cluster                     | `powerSource` and `battery` of a data center                      |
| `cpuDistributionPolicy`, `gpuDistributionPolicy`             | `cpuDistribution`, `gpuDistribution`                              |
| `arch` of a CPU or memory                                    | `architecture`                                                    |
| `memorySize`, `memorySpeed` of the memory                    | `size`, `speed`                                                   |
| `memorySize` of a GPU                                        | `memory`                                                          |
| `virtualizationOverHeadModel`                                | `virtualizationOverhead`                                          |
| `NONE`, `CONSTANT`, `SHARE_BASED`                            | `none`, `constant`, `shareBased`                                  |
| `modelType` of a power model                                 | `type`                                                            |
| `MAX_MIN_FAIRNESS`, `BEST_EFFORT`, `EQUAL_SHARE`, `FIRST_FIT`, `FIXED_SHARE` | `maxMinFairness`, `bestEffort`, `equalShare`, `firstFit`, `fixedShare` |
| `updateIntervalLength` of `BEST_EFFORT`                      | `updateInterval` of `bestEffort`                                  |
| `"carbonTracePath": "carbon.parquet"`                        | `"carbon": { "type": "named", "name": "carbon.parquet" }`         |
| `batteryPolicy` of a battery                                 | `policy`                                                          |
| `capacity`, `initialCharge` of a battery, in kWh             | **A plain number is now in Joule.** Write `"100 kWh"`.            |

### Workload

| OpenDC2                                                  | OpenDC3                                                               |
|-----------------------------------------------------------|------------------------------------------------------------------------|
| `"type": "ComputeWorkload"`, `"pathToFile": "traces/t"`   | `"type": "trace"`, `"source": { "type": "named", "name": "traces/t" }` |

The other fields, such as `sampleFraction` and `scalingPolicy`, are unchanged.

### Allocation policy

| OpenDC2                                       | OpenDC3                                                                            |
|------------------------------------------------|-------------------------------------------------------------------------------------|
| `policyName` of a prefab                       | `prefabName`                                                                        |
| `Compute`, `VCpu`, `VCpuCapacity`, `Ram`, `InstanceCount`, `SameHost`, `DifferentHost` | `compute`, `vcpu`, `vcpuCapacity`, `ram`, `instanceCount`, `sameHost`, `differentHost` |
| `Ram`, `CoreRam`, `InstanceCount`, `VCpuCapacity`, `VCpu` weighers | `ram`, `coreRam`, `instanceCount`, `vcpuCapacity`, `vcpu`                 |
| `"type": "timeshift"` with its settings        | `"type": "filter"`, with the settings in a `timeshift` object                       |
| `subsetSize`, `memorize`                       | Removed.                                                                            |
| The `Random` prefab                            | Removed.                                                                            |

### Failure model

| OpenDC2                                         | OpenDC3                                       |
|--------------------------------------------------|------------------------------------------------|
| `"type": "no"`                                   | `"type": "none"`                               |
| `"type": "trace-based"`, `"pathToFile": "f.parquet"` | `"type": "trace"`, `"source": { "type": "named", "name": "f.parquet" }` |
| `iatSampler`, `durationSampler`, `nohSampler`    | `interArrival`, `duration`, `hostFraction`     |

### Checkpoint model

| OpenDC2                                                            | OpenDC3                                  |
|---------------------------------------------------------------------|-------------------------------------------|
| `checkpointInterval`, `checkpointDuration`, `checkpointIntervalScaling` | `interval`, `duration`, `intervalScaling` |

### Export model

| OpenDC2                                                   | OpenDC3                                                                     |
|------------------------------------------------------------|------------------------------------------------------------------------------|
| `exportInterval`, in seconds                               | **A plain number is now in milliseconds.** Write `"1 hours"`.                |
| `"computeExportConfig": { "hostExportColumns": [...] }`    | `"columns": { "host": { "type": "only", "columns": [...] } }`                |
| `taskExportColumns`, `powerSourceExportColumns`, `batteryExportColumns`, `serviceExportColumns` | `task`, `powerSource`, `battery`, `service` |

`filesToExport` is unchanged, and can also select the new `cluster` and `datacenter` files.

### Example

An OpenDC2 experiment and topology:

```json
{
    "name": "example",
    "topologies": [{ "pathToFile": "topologies/small.json" }],
    "workloads": [{ "pathToFile": "traces/bitbrains-small", "type": "ComputeWorkload" }],
    "allocationPolicies": [{ "type": "prefab", "policyName": "Mem" }],
    "exportModels": [{ "exportInterval": 3600 }]
}
```

```json
{
    "clusters": [
        {
            "name": "C01",
            "hosts": [
                {
                    "name": "H01",
                    "count": 16,
                    "cpu": { "coreCount": 16, "coreSpeed": 2100 },
                    "memory": { "memorySize": 100000 },
                    "cpuPowerModel": { "modelType": "sqrt", "idlePower": 32.0, "maxPower": 180.0 }
                }
            ],
            "powerSource": { "carbonTracePath": "carbon_traces/NL_2021-2024.parquet" }
        }
    ]
}
```

The same experiment in OpenDC3, with the topology in the experiment file:

```json
{
    "name": "example",
    "topologies": [
        {
            "datacenters": [
                {
                    "powerSource": {
                        "carbon": { "type": "named", "name": "carbon_traces/NL_2021-2024.parquet" }
                    },
                    "clusters": [
                        {
                            "name": "C01",
                            "hosts": [
                                {
                                    "name": "H01",
                                    "count": 16,
                                    "cpu": { "coreCount": 16, "coreSpeed": "2.1 GHz" },
                                    "memory": { "size": "100000 MiB" },
                                    "cpuPowerModel": { "type": "sqrt", "idlePower": "32 W", "maxPower": "180 W" }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "workloads": [
        { "type": "trace", "source": { "type": "named", "name": "traces/bitbrains-small" } }
    ],
    "allocationPolicies": [{ "type": "prefab", "prefabName": "Mem" }],
    "exportModels": [{ "exportInterval": "1 hours" }]
}
```

## Converting traces

Workload traces, carbon traces and failure traces of OpenDC2 can be used in OpenDC3 without changes. To read a
workload trace with the faster `efficient-trace` workload type, the trace needs a `num_fragments` column, see
[Workload](/learn/documentation/Input/Workload).

## Updating analysis scripts

The results are written to `<output>/<name>/raw-output/<scenario>/seed=<seed>/`, as before, but `<output>` is now set
with `opendc run -o`. Next to the output files, each run has a `meta/` folder, and two new files: `cluster.parquet` and
`dataCenter.parquet`. See [Output](/learn/documentation/Output/) for all columns.

Some metrics are measured differently. In OpenDC2, `energy_usage`, `carbon_emission`, `uptime`, `downtime` and the CPU
and GPU time columns hold the value since the previous sample. In OpenDC3, they hold the total since the start of the
simulation. To get the OpenDC2 values from OpenDC3 output, take the difference between consecutive samples of the
same host, task or power source.

The columns of OpenDC2 that moved or were removed:

| OpenDC2 column                                                  | In OpenDC3                                                                   |
|------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `timestamp_absolute` (all files)                                 | `timestamp` plus `start_time` from `meta/simulation.parquet`                  |
| `host_name`, `cluster_name` (host)                               | `host_id`, with the names in `meta/host.parquet` and `meta/cluster.parquet`   |
| `core_count`, `mem_capacity`, `cpu_capacity`, `gpu_capacity_i` (host) | `meta/host.parquet`                                                      |
| `tasks_terminated` (host)                                        | Removed                                                                       |
| `task_name` (task)                                               | Removed                                                                       |
| `host_name` (task)                                               | `host_id`                                                                     |
| `cpu_count`, `gpu_count`, `mem_capacity`, `submission_time` (task) | `meta/task.parquet`                                                         |
| `cpu_limit`, `gpu_limit`, `uptime`, `downtime` (task)            | Removed                                                                       |
| `source_name`, `cluster_name` (power source)                     | `power_source_id`, with the name and data center in `meta/powerSource.parquet` |
| `battery_name`, `cluster_name`, `capacity` (battery)             | `battery_id`, with the name, data center and capacity in `meta/battery.parquet` |

For example, this rebuilds the OpenDC2 host file from OpenDC3 output, with Python:

```python
import pandas as pd

run = "output/example/raw-output/0/seed=0"

host = pd.read_parquet(f"{run}/host.parquet")
host_meta = pd.read_parquet(f"{run}/meta/host.parquet")
cluster_meta = pd.read_parquet(f"{run}/meta/cluster.parquet")
start_time = pd.read_parquet(f"{run}/meta/simulation.parquet")["start_time"].iloc[0]

host = host.merge(host_meta, on="host_id").merge(cluster_meta[["cluster_id", "cluster_name"]], on="cluster_id")
host["timestamp_absolute"] = host["timestamp"] + start_time

# Totals since the start of the simulation, to values since the previous sample
for column in ["energy_usage", "uptime", "downtime", "cpu_time_active", "cpu_time_idle"]:
    host[column] = host.groupby("host_id")[column].diff().fillna(host[column])
```
