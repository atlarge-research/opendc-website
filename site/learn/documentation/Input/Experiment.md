---
sidebar_position: 1
description: The experiment file, which defines what OpenDC simulates.
---

# Experiment

To run a simulation, OpenDC needs to understand what it needs to simulate. 
This is done using an `experiment.json` which defines topologies, workload, models, and policies.
An Experiment file can define multiple Scenarios (simulations) to run by providing multiple values for a parameter.
OpenDC will run every combination of given parameters.

OpenDC can be run directly from the terminal using the `opendc run` command:

```bash
opendc run experiment.json -o output_folder
```

`opendc validate experiment.json` can be used to validate the experiment files without actually running it.
`opendc show experiment.json` can be used to print and describe the topology file.

## Fields

| Field                | Type                                                      | Default                                      | Description                                                                 |
|----------------------|-----------------------------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| `name`               | string                                                    | `""`                                         | Name of the experiment. The results are written to `output/<name>/`.         |
| `topologies`         | list of [Topology](./Topology/Topology.md)                | required                                     | Definition of the data centers to simulate.                                               |
| `workloads`          | list of [Workload](./Workload.md)                         | required                                     | The workload that should be executed on the data center.                                                           |
| `allocationPolicies` | list of [Allocation policy](./AllocationPolicy.md)        | the `Mem` prefab                             | The policy deciding on which host a task should be run.                                              |
| `failureModels`      | list of [Failure model](./FailureModel.md)                | `[{ "type": "none" }]`                       | A failure model decides when hosts fail and how.                                                            |
| `maxNumFailures`     | list of integers                                          | `[10]`                                       | The number of times a task can fail before it is terminated.                    |
| `checkpointModels`   | list of [Checkpoint model](./CheckpointModel.md) or `null` | `[null]`                                    | The model used by tasks to checkpoint their state. When not provided, checkpointing is not used.        |
| `exportModels`       | list of [Export model](./ExportModel.md)                  | one export model with its defaults           | How results should be exported. This includes which files to export, which columns to export, and at which frequency.                                   |
| `runs`               | integer                                                   | `1`                                          | How often each scenario is run, each time with a different seed.            |
| `initialSeed`        | integer                                                   | `0`                                          | The seed of the first run. Run *i* uses seed `initialSeed + i`.             |

## Scenarios

Almost all parameters in the `experiment` file can accept multiple values in the form of a list.
When running an experiment, a scenario is created for each combination of parameters, and each scenario is run `runs` times. 
For example, An experiment with 2 topologies, 1 workload and 3 allocation policies has 6 scenarios. 
**Note:** Identical entries in a list count only once.

Scenarios are numbered from 0. The numbering goes through the lists in order, with `topologies` changing slowest and
`maxNumFailures` fastest. The number of a scenario is the name of its folder in the [output](../Output/Output.md).
Each scenario exports an `trackr.json` that defines the scenario that was run.

## Splitting an experiment over several files

Not everything has to be defined directly into the experiment file. 
Any object in the experiment, such as a topology, a cluster, a host or a workload, can take its fields from another
file with `importFrom`. This lets experiments share topologies and workloads.
A common use-case is to define the topology in a different file:

```json
"topologies": [
    { "importFrom": "topologies/small_datacenter.json" }
]
```

## Referencing trace files

Workload traces, carbon traces and failure traces are referenced by name or by URI:

```json
"source": { "type": "named", "name": "traces/bitbrains-small" }
"source": { "type": "uri", "uri": "file:///data/traces/bitbrains-small" }
```

A name, or a URI without a scheme, is resolved against the directory `opendc` is run from. Use
`opendc --input-root <dir> run experiment.json` to resolve them against another directory.

## Example

This experiment runs one topology and one workload with two allocation policies, so it has two scenarios:

```json
{
    "name": "simple",
    "topologies": [
        { "importFrom": "topologies/small_datacenter.json" }
    ],
    "workloads": [
        {
            "type": "trace",
            "source": { "type": "named", "name": "traces/bitbrains-small" }
        }
    ],
    "allocationPolicies": [
        { "type": "prefab", "prefabName": "Mem" },
        { "type": "prefab", "prefabName": "MemInv" }
    ],
    "exportModels": [
        { "exportInterval": "1 hours" }
    ]
}
```
