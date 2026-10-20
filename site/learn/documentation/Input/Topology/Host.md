---
sidebar_position: 1
description: The hosts on which tasks run, with their CPU, memory and GPU.
---

# Host

A host is a machine on which tasks run. It has a CPU and memory, and can have a GPU.

| Field             | Type                                             | Default                     | Description                                             |
|-------------------|--------------------------------------------------|-----------------------------|---------------------------------------------------------|
| `name`            | string                                           | `"Host"`                    | Name of the host.                                       |
| `count`           | integer                                          | `1`                         | The number of identical hosts to create.                |
| `cpu`             | [CPU](#cpu)                                      | required                    | The CPU of the host.                                    |
| `memory`          | [Memory](#memory)                                | required                    | The memory of the host.                                 |
| `gpu`             | [GPU](#gpu)                                      | no GPU                      | The GPU of the host.                                    |
| `cpuPowerModel`   | [Power model](./PowerModel.md)                   | linear, 200 W idle, 400 W max | Power draw of the CPU.                                |
| `gpuPowerModel`   | [Power model](./PowerModel.md)                   | linear, 200 W idle, 400 W max | Power draw of the GPU.                                |
| `cpuDistribution` | [Distribution policy](./DistributionPolicy.md)   | `maxMinFairness`            | How the CPU is shared between tasks.                    |
| `gpuDistribution` | [Distribution policy](./DistributionPolicy.md)   | `maxMinFairness`            | How the GPU is shared between tasks.                    |

## CPU

| Field          | Type                                 | Default     | Description                          |
|----------------|--------------------------------------|-------------|--------------------------------------|
| `coreCount`    | integer                              | required    | The number of cores per CPU.         |
| `coreSpeed`    | [Frequency](../../Units.md)          | required    | The speed of each core.              |
| `count`        | integer                              | `1`         | The number of CPUs in the host.      |
| `vendor`       | string                               | `"unknown"` | The vendor of the CPU.               |
| `modelName`    | string                               | `"unknown"` | The model of the CPU.                |
| `architecture` | string                               | `"unknown"` | The micro-architecture of the CPU.   |

## Memory

| Field          | Type                         | Default     | Description                     |
|----------------|------------------------------|-------------|---------------------------------|
| `size`         | [Data size](../../Units.md)  | required    | The amount of memory.           |
| `speed`        | [Frequency](../../Units.md)  | unspecified | The speed of the memory.        |
| `vendor`       | string                       | `"unknown"` | The vendor of the memory.       |
| `modelName`    | string                       | `"unknown"` | The model of the memory.        |
| `architecture` | string                       | `"unknown"` | The memory technology.          |

## GPU

| Field                    | Type                                                        | Default     | Description                                  |
|--------------------------|-------------------------------------------------------------|-------------|----------------------------------------------|
| `coreCount`              | integer                                                     | required    | The number of cores per GPU.                 |
| `coreSpeed`              | [Frequency](../../Units.md)                                 | required    | The speed of each core.                      |
| `count`                  | integer                                                     | `1`         | The number of GPUs in the host.              |
| `memory`                 | [Data size](../../Units.md)                                 | unspecified | The memory of each GPU.                      |
| `memoryBandwidth`        | [Data rate](../../Units.md)                                 | unspecified | The memory bandwidth of each GPU.            |
| `vendor`                 | string                                                      | `"unknown"` | The vendor of the GPU.                       |
| `modelName`              | string                                                      | `"unknown"` | The model of the GPU.                        |
| `architecture`           | string                                                      | `"unknown"` | The micro-architecture of the GPU.           |
| `virtualizationOverhead` | [Virtualization overhead](./VirtualizationOverHeadModel.md) | `none`      | The performance lost when the GPU is shared. |

## Example

A host with two 24-core CPUs and two GPUs:

```json
{
    "name": "gpu-host",
    "count": 8,
    "cpu": { "coreCount": 24, "coreSpeed": "2.8 GHz", "count": 2, "vendor": "Intel" },
    "memory": { "size": "192 GiB" },
    "cpuPowerModel": { "type": "linear", "idlePower": "100 W", "maxPower": "350 W" },
    "gpu": {
        "coreCount": 5120,
        "coreSpeed": "1.5 GHz",
        "count": 2,
        "memory": "32 GiB",
        "memoryBandwidth": "900 GBps",
        "virtualizationOverhead": { "type": "constant", "percentageOverhead": 0.1 }
    },
    "gpuPowerModel": { "type": "linear", "idlePower": "50 W", "maxPower": "300 W" },
    "gpuDistribution": { "type": "fixedShare", "shareRatio": 0.5 }
}
```
