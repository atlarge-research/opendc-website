---
description: How to run your first experiment with OpenDC3, and the options of the opendc command.
---

# Running OpenDC3

OpenDC simulates the [experiments](../documentation/Input/Experiment.md) described in an experiment file, with the
`opendc` command. See [Installation](./0-installation.md) for how to get it.

## Your first experiment

Save the following as `experiment.json`. It describes a data center with four hosts, and a workload of two tasks:

```json
{
    "name": "getting-started",
    "topologies": [
        {
            "datacenters": [
                {
                    "name": "DC1",
                    "clusters": [
                        {
                            "name": "C01",
                            "hosts": [
                                {
                                    "name": "H01",
                                    "count": 4,
                                    "cpu": { "coreCount": 16, "coreSpeed": "2.1 GHz" },
                                    "memory": { "size": "64 GiB" },
                                    "cpuPowerModel": { "type": "linear", "idlePower": "32 W", "maxPower": "180 W" }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "workloads": [
        {
            "type": "inline",
            "tasks": [
                {
                    "id": 0,
                    "submissionTime": "0 minutes",
                    "duration": "10 minutes",
                    "cpuCoreCount": 2,
                    "cpuCapacity": "4.2 GHz",
                    "memory": "2 GiB",
                    "fragments": [
                        { "duration": "10 minutes", "cpuUsage": "4.2 GHz" }
                    ]
                },
                {
                    "id": 1,
                    "submissionTime": "5 minutes",
                    "duration": "20 minutes",
                    "cpuCoreCount": 4,
                    "cpuCapacity": "8.4 GHz",
                    "memory": "8 GiB",
                    "fragments": [
                        { "duration": "10 minutes", "cpuUsage": "8.4 GHz" },
                        { "duration": "10 minutes", "cpuUsage": "4.2 GHz" }
                    ]
                }
            ]
        }
    ],
    "allocationPolicies": [
        { "type": "prefab", "prefabName": "Mem" }
    ],
    "exportModels": [
        { "exportInterval": "1 minutes" }
    ]
}
```

Then run it:

```bash
opendc run experiment.json -o output
```

OpenDC shows a dashboard while it simulates, and a summary of each run when it is done. The results are written to
`output/getting-started/raw-output/0/seed=0/`, as Parquet files. See [Output](../documentation/Output/Output.md) for what
they contain.

Larger experiments read their workload from a trace instead. The
[opendc-demos](https://github.com/atlarge-research/opendc-demos) repository has example experiments and traces.

## Commands

| Command                               | Description                                                       |
|---------------------------------------|-------------------------------------------------------------------|
| `opendc run experiment.json`          | Simulates every scenario of the experiment and writes the results. |
| `opendc validate experiment.json`     | Checks the experiment file and reports any problems, without running it. |
| `opendc show experiment.json`         | Prints the topologies of the experiment.                          |

Every command shows its options with `--help`.

## Options

These options belong to `opendc` itself, so they come before the command, such as `opendc --strict run experiment.json`:

| Option                | Description                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `--strict`            | Stop with an error when the experiment has an unknown key. By default, unknown keys are ignored.  |
| `--input-root <dir>`  | The directory that relative [trace references](../documentation/Input/Experiment.md#referencing-trace-files) are resolved against. By default, this is the directory `opendc` is run from. |
| `--legacy`            | Read an experiment in the OpenDC2 format. See [Migrating to OpenDC3](../opendc-2/migrating-to-opendc-3.md). |

These options belong to `run`, so they come after it:

| Option                   | Default  | Description                                                                          |
|--------------------------|----------|--------------------------------------------------------------------------------------|
| `-o`, `--output <dir>`   | `output` | The directory the results are written to.                                            |
| `-p`, `--parallelism <n>`| `1`      | The number of runs that are simulated at the same time.                              |
| `--writer-threads <n>`   | `1`      | The number of threads that write the task and host files of a run. More threads speed up a single large run; keep 1 when running many runs at the same time. |
| `--no-progress`          |          | Do not show the dashboard. Use this in scripts, or when the output goes to a file.  |
| `--no-summary`           |          | Do not show the summary at the end. This saves memory for very large experiments.   |
