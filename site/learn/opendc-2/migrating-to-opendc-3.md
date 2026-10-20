---
sidebar_position: 0
description: How to move experiments, topologies, workloads and analysis scripts from OpenDC 2 to OpenDC 3.
---

# Migrating to OpenDC 3

OpenDC 3 changes how experiments are written, how they are run, and what the output looks like. This page explains
how to keep running your OpenDC 2 experiments, and how to move them to the format described in the
[OpenDC 3 documentation](/learn/category/documentation).

:::caution Work in progress
This guide is still being written.
:::

## What changed

<!-- Overview of the changes: the runner, the experiment format, data centers in the topology, and the output. -->

## Running OpenDC 2 experiments on OpenDC 3

OpenDC 3 can run experiment files in the OpenDC 2 format with the `--legacy` flag:

```bash
opendc --legacy run experiment.json -o output
```

`--legacy` is an option of `opendc` itself, not of `run`, so it has to come before the subcommand.

Some behaviour differs from OpenDC 2:

- Relative paths in a legacy experiment are resolved against the directory you run `opendc` from, as in OpenDC 2.
  Run it from the directory those paths were written for.
- `outputFolder` is ignored. Use `-o` to choose where the results are written.

## Converting experiments to the OpenDC 3 format

<!-- Field renames per section (experiment, topology, workload, allocation policy, failure model, checkpoint model,
     export model), the changed default units, and moving clusters into data centers. -->

## Converting workload traces

<!-- Column changes in tasks.parquet and fragments.parquet. -->

## Updating analysis scripts

<!-- Where each OpenDC 2 output column went, and how to join the meta files to get names and absolute timestamps. -->
