---
sidebar_position: 4
description: The units of measure OpenDC2 uses for input values.
---

# Units

In OpenDC2, only the values in a [topology](./Input/Topology/Topology.md) can be written with a unit. All other values
are plain numbers with a fixed unit.

## Values with a unit

These values can be written as a string with a unit, such as `"2.1 GHz"`, or as a plain number in the default unit.

| Quantity  | Default unit | Examples                            | Used for                                             |
|-----------|--------------|-------------------------------------|------------------------------------------------------|
| Frequency | MHz          | `"2100 MHz"`, `"2.1 GHz"`           | `coreSpeed` of CPUs and GPUs, `memorySpeed`          |
| Data size | MiB          | `"512 MiB"`, `"64 GiB"`, `"100 GB"` | `memorySize` of the memory and of GPUs               |
| Data rate | Kibps        | `"10 Gbps"`, `"900 GBps"`           | `memoryBandwidth` of GPUs                            |
| Power     | Watt         | `"400 W"`, `"1 kW"`                 | `power`, `idlePower` and `maxPower` of power models  |

The number can have decimals or an exponent, such as `"128e3 MiB"`. Decimal prefixes (`k`, `M`, `G`) are powers of 1000
and binary prefixes (`Ki`, `Mi`, `Gi`) are powers of 1024. In data sizes and rates, `b` is a bit and `B` is a byte.

## Values with a fixed unit

| Value                                                   | Unit         |
|---------------------------------------------------------|--------------|
| `exportInterval` of an export model                     | seconds      |
| `checkpointInterval` and `checkpointDuration`           | milliseconds |
| `updateIntervalLength` of the `BEST_EFFORT` policy      | milliseconds |
| `maxPower` of a power source, `chargingSpeed` of a battery | Watt      |
| `capacity` and `initialCharge` of a battery             | kWh          |
| `embodiedCarbon` of a battery                           | gram         |
| `expectedLifetime` of a battery                         | years        |
| failure distributions (`iatSampler`, `durationSampler`) | hours        |

The units of the output files are listed on the [Output](./Output/Output.md) pages.
