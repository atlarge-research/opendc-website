---
description: The files OpenDC writes during a simulation, and how to read them.
---

# Output

During a simulation, OpenDC regularly takes a sample of the state of the data center and writes it to Parquet files.
The [export model](../Input/ExportModel.md) decides which files are written, which columns they have, and how often a
sample is taken.

## Where the results are written

Each run of a scenario gets its own folder, `<output>/<experiment name>/raw-output/<scenario>/seed=<seed>/`, where
`<output>` is the folder given with `opendc run -o`:

```
output/
└── simple/                   the name of the experiment
    └── raw-output/
        ├── 0/                scenario 0
        │   ├── seed=0/       the run with seed 0
        │   │   ├── host.parquet
        │   │   ├── task.parquet
        │   │   ├── service.parquet
        │   │   ├── powerSource.parquet
        │   │   ├── battery.parquet
        │   │   ├── cluster.parquet
        │   │   ├── dataCenter.parquet
        │   │   └── meta/
        │   └── seed=1/
        └── 1/                scenario 1
```

## Output files

| File                                       | One row per                              |
|--------------------------------------------|------------------------------------------|
| [host.parquet](./Host.md)                  | host, per sample                         |
| [task.parquet](./Task.md)                  | task, per sample and per change of state |
| [service.parquet](./Service.md)            | sample                                   |
| [powerSource.parquet](./PowerSource.md)    | power source, per sample                 |
| [battery.parquet](./Battery.md)            | battery, per sample                      |
| [cluster.parquet](./Cluster.md)            | cluster, per sample                      |
| [dataCenter.parquet](./DataCenter.md)      | data center, per sample                  |
| [meta/](./Meta.md)                         | the names and fixed properties of hosts, tasks, clusters and so on |

## Ids and meta files

To keep the files small, the sample files only hold values that change during the simulation. Hosts, tasks, clusters,
data centers, power sources and batteries are identified by an integer id, such as `host_id`. The
[meta files](./Meta.md) map each id to a name and fixed properties, such as the number of cores of a host.

## Time

`timestamp` and the other times in the output are in milliseconds since the start of the simulation. The simulation
starts when the first task is submitted. `meta/simulation.parquet` holds the absolute start time; add it to a time to
get the time in milliseconds since the Unix epoch.

## Example

Reading the host file of a run with Python, and adding the host names and absolute times:

```python
import pandas as pd

run = "output/simple/raw-output/0/seed=0"

host = pd.read_parquet(f"{run}/host.parquet")
host_meta = pd.read_parquet(f"{run}/meta/host.parquet")
start_time = pd.read_parquet(f"{run}/meta/simulation.parquet")["start_time"].iloc[0]

host = host.merge(host_meta[["host_id", "host_name"]], on="host_id")
host["time"] = pd.to_datetime(host["timestamp"] + start_time, unit="ms")
```
