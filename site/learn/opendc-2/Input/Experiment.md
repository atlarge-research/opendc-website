---
sidebar_position: 1
description: The experiment file, which defines what OpenDC2 simulates.
---

# Experiment

An experiment defines what OpenDC simulates. It is a JSON file that lists one or more topologies, workloads and
policies. OpenDC runs a simulation, called a scenario, for every combination of them. See
[Running OpenDC2](../Running.md) for how to run an experiment.

## Fields

| Field                | Type                                                       | Default                    | Description                                                                         |
|----------------------|------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------|
| `name`               | string                                                     | generated                  | Name of the experiment. When empty, a name such as `unnamed-simulation-1a2b` is generated. |
| `outputFolder`       | string                                                     | `"output"`                 | The folder the results are written to, in `outputFolder/name/`.                    |
| `topologies`         | list of topology files                                     | required                   | The [topologies](./Topology/Topology.md) to simulate, each as `{ "pathToFile": "topologies/topology.json" }`. |
| `workloads`          | list of [Workload](./Workload.md)                          | required                   | The tasks to run.                                                                   |
| `allocationPolicies` | list of [Allocation policy](./AllocationPolicy.md)         | the `Mem` prefab           | How tasks are placed on hosts.                                                      |
| `failureModels`      | list of [Failure model](./FailureModel.md) or `null`       | `[null]`                   | When hosts fail. `null` means no failures.                                          |
| `maxNumFailures`     | list of integers                                           | `[10]`                     | The number of failures after which a task is terminated.                            |
| `checkpointModels`   | list of [Checkpoint model](./CheckpointModel.md) or `null` | `[null]`                   | How tasks checkpoint their progress. `null` turns checkpointing off.                |
| `exportModels`       | list of [Export model](./ExportModel.md)                   | one export model with its defaults | Which results are written, and how often.                                   |
| `runs`               | integer                                                    | `1`                        | How often each scenario is run, each time with a different seed.                    |
| `initialSeed`        | integer                                                    | `0`                        | The seed of the first run. Run *i* uses seed `initialSeed + i`.                     |

## Scenarios

Each list in the experiment is one axis. OpenDC runs one scenario for every combination of the axes, and runs each
scenario `runs` times. An experiment with 2 topologies, 1 workload and 3 allocation policies has 6 scenarios.

Scenarios are numbered from 0. The numbering goes through the lists in order, with `topologies` changing slowest and
`maxNumFailures` fastest. The number of a scenario is the name of its folder in the [output](../Output/Output.md), and
`trackr.json` lists the settings of every scenario.

## Example

This experiment runs three topologies, two workloads and two allocation policies, so it has 12 scenarios:

```json
{
    "name": "example",
    "topologies": [
        { "pathToFile": "topologies/topology1.json" },
        { "pathToFile": "topologies/topology2.json" },
        { "pathToFile": "topologies/topology3.json" }
    ],
    "workloads": [
        { "pathToFile": "traces/bitbrains-small", "type": "ComputeWorkload" },
        { "pathToFile": "traces/bitbrains-large", "type": "ComputeWorkload" }
    ],
    "allocationPolicies": [
        { "type": "prefab", "policyName": "Mem" },
        { "type": "prefab", "policyName": "MemInv" }
    ],
    "exportModels": [
        { "exportInterval": 3600 }
    ]
}
```
