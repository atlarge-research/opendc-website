---
description: The files OpenDC2 writes during a simulation, and how to read them.
---

# Output

During a simulation, OpenDC regularly takes a sample of the state of the data center and writes it to Parquet files.
The [export model](../Input/ExportModel.md) decides which files are written, which columns they have, and how often a
sample is taken.

## Where the results are written

The results of an experiment are written to `outputFolder/name/`, where `outputFolder` and `name` are set in the
[experiment](../Input/Experiment.md). Each run of a scenario gets its own folder:

```
output/
└── example/                  the name of the experiment
    ├── trackr.json           the settings of every scenario
    ├── simulation-analysis/
    └── raw-output/
        ├── 0/                scenario 0
        │   ├── seed=0/       the run with seed 0
        │   │   ├── host.parquet
        │   │   ├── task.parquet
        │   │   ├── service.parquet
        │   │   ├── powerSource.parquet
        │   │   └── battery.parquet
        │   └── seed=1/
        └── 1/                scenario 1
```

`simulation-analysis/` is filled by [M3SA](../M3SA/M3SA.md), when it is used.

## Output files

| File                                    | One row per              |
|-----------------------------------------|--------------------------|
| [host.parquet](./Host.md)               | host, per sample         |
| [task.parquet](./Task.md)               | task, per sample         |
| [service.parquet](./Service.md)         | sample                   |
| [powerSource.parquet](./PowerSource.md) | power source, per sample |
| [battery.parquet](./Battery.md)         | battery, per sample      |

## Time

Every file has two times: `timestamp` is in milliseconds since the start of the simulation, and `timestamp_absolute` is
in milliseconds since the Unix epoch.

Energy use, carbon emissions, uptime, downtime and CPU and GPU times are measured over the time since the previous
sample. To get the total, add up the values of all samples.

## Example

Reading the host file of a run with Python:

```python
import pandas as pd

host = pd.read_parquet("output/example/raw-output/0/seed=0/host.parquet")
host["time"] = pd.to_datetime(host["timestamp_absolute"], unit="ms")
total_energy = host.groupby("host_name")["energy_usage"].sum()
```
