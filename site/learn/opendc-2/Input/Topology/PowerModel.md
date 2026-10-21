---
sidebar_position: 2
description: Power models, which determine the power draw of a CPU or GPU from its utilization.
---

# Power model

A power model determines the power draw of a CPU or GPU from its utilization. Every host has one for its CPU
(`cpuPowerModel`) and one for its GPU (`gpuPowerModel`). When none is given, a linear model with an idle power of 200 W
and a maximum power of 400 W is used.

| Field               | Type                    | Default  | Description                                                                       |
|---------------------|-------------------------|----------|-----------------------------------------------------------------------------------|
| `modelType`         | string                  | required | The model, see the table below.                                                   |
| `idlePower`         | [Power](../../Units.md) | required | The power draw at 0% utilization.                                                 |
| `maxPower`          | [Power](../../Units.md) | required | The power draw at 100% utilization. It must be at least `idlePower`.              |
| `power`             | [Power](../../Units.md) | `400 W`  | The power draw of the `constant` model.                                           |
| `calibrationFactor` | number                  | `1.0`    | The calibration factor of the `mse` model.                                        |
| `asymUtil`          | number                  | `0.0`    | The utilization above which the `asymptotic` model grows close to linearly.       |
| `dvfs`              | boolean                 | `true`   | Whether the `asymptotic` model models dynamic voltage and frequency scaling.      |

| Model type   | Power draw                                                                     |
|--------------|--------------------------------------------------------------------------------|
| `constant`   | Always `power`, independent of the utilization.                                |
| `linear`     | Grows linearly from `idlePower` at 0% utilization to `maxPower` at 100%.       |
| `square`     | Grows with the square of the utilization.                                      |
| `cubic`      | Grows with the cube of the utilization.                                        |
| `sqrt`       | Grows with the square root of the utilization.                                 |
| `mse`        | Fitted to measurements, after Fan et al., ISCA 2007.                           |
| `asymptotic` | Grows close to linearly above the utilization `asymUtil`, adapted from GreenCloud. |

## Example

```json
"cpuPowerModel": {
    "modelType": "sqrt",
    "idlePower": "32 W",
    "maxPower": "180 W"
}
```
