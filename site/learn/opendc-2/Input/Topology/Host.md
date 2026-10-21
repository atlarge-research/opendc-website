---
sidebar_position: 1
description: The hosts on which tasks run, with their CPU, memory and GPU.
---

# Host

A host is a machine on which tasks run. It has a CPU and memory, and can have a GPU.

| Field                   | Type                                           | Default                       | Description                              |
|-------------------------|------------------------------------------------|-------------------------------|------------------------------------------|
| `name`                  | string                                         | `"Host"`                      | Name of the host.                        |
| `count`                 | integer                                        | `1`                           | The number of identical hosts to create. |
| `cpu`                   | [CPU](#cpu)                                    | required                      | The CPU of the host.                     |
| `memory`                | [Memory](#memory)                              | required                      | The memory of the host.                  |
| `gpu`                   | [GPU](#gpu)                                    | no GPU                        | The GPU of the host.                     |
| `cpuPowerModel`         | [Power model](./PowerModel.md)                 | linear, 200 W idle, 400 W max | Power draw of the CPU.                   |
| `gpuPowerModel`         | [Power model](./PowerModel.md)                 | linear, 200 W idle, 400 W max | Power draw of the GPU.                   |
| `cpuDistributionPolicy` | [Distribution policy](./DistributionPolicy.md) | `MAX_MIN_FAIRNESS`            | How the CPU is shared between tasks.     |
| `gpuDistributionPolicy` | [Distribution policy](./DistributionPolicy.md) | `MAX_MIN_FAIRNESS`            | How the GPU is shared between tasks.     |

## CPU

| Field       | Type                        | Default     | Description                        |
|-------------|-----------------------------|-------------|------------------------------------|
| `coreCount` | integer                     | required    | The number of cores per CPU.       |
| `coreSpeed` | [Frequency](../../Units.md) | required    | The speed of each core.            |
| `count`     | integer                     | `1`         | The number of CPUs in the host.    |
| `vendor`    | string                      | `"unknown"` | The vendor of the CPU.             |
| `modelName` | string                      | `"unknown"` | The model of the CPU.              |
| `arch`      | string                      | `"unknown"` | The micro-architecture of the CPU. |

## Memory

| Field         | Type                        | Default     | Description               |
|---------------|-----------------------------|-------------|---------------------------|
| `memorySize`  | [Data size](../../Units.md) | required    | The amount of memory.     |
| `memorySpeed` | [Frequency](../../Units.md) | unspecified | The speed of the memory.  |
| `vendor`      | string                      | `"unknown"` | The vendor of the memory. |
| `modelName`   | string                      | `"unknown"` | The model of the memory.  |
| `arch`        | string                      | `"unknown"` | The memory technology.    |

## GPU

| Field                         | Type                                                        | Default     | Description                                  |
|-------------------------------|-------------------------------------------------------------|-------------|----------------------------------------------|
| `coreCount`                   | integer                                                     | required    | The number of cores per GPU.                 |
| `coreSpeed`                   | [Frequency](../../Units.md)                                 | required    | The speed of each core.                      |
| `count`                       | integer                                                     | `1`         | The number of GPUs in the host.              |
| `memorySize`                  | [Data size](../../Units.md)                                 | unspecified | The memory of each GPU.                      |
| `memoryBandwidth`             | [Data rate](../../Units.md)                                 | unspecified | The memory bandwidth of each GPU.            |
| `vendor`                      | string                                                      | `"unknown"` | The vendor of the GPU.                       |
| `modelName`                   | string                                                      | `"unknown"` | The model of the GPU.                        |
| `architecture`                | string                                                      | `"unknown"` | The micro-architecture of the GPU.           |
| `virtualizationOverHeadModel` | [Virtualization overhead](./VirtualizationOverHeadModel.md) | `NONE`      | The performance lost when the GPU is shared. |

## Example

A host with a 4-core CPU and a GPU, whose GPU is shared in fixed shares:

```json
{
    "name": "DualGpuHost",
    "cpu": { "coreCount": 4, "coreSpeed": "2 GHz" },
    "memory": { "memorySize": "128 GiB" },
    "cpuPowerModel": { "modelType": "linear", "idlePower": "100 W", "maxPower": "200 W" },
    "cpuDistributionPolicy": { "type": "MAX_MIN_FAIRNESS" },
    "gpu": {
        "coreCount": 2,
        "coreSpeed": "2 GHz",
        "virtualizationOverHeadModel": { "type": "CONSTANT", "percentageOverhead": 0.25 }
    },
    "gpuPowerModel": { "modelType": "linear", "idlePower": "100 W", "maxPower": "200 W" },
    "gpuDistributionPolicy": { "type": "FIXED_SHARE", "shareRatio": 0.5 }
}
```
