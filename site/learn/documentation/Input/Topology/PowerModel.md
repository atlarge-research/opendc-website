---
sidebar_position: 2
description: Power models, which determine the power draw of a CPU or GPU from its utilization.
---

# Power model

A power model determines the power draw of a component based on its utilization. At the moment, power models are used by CPUs and GPUs.
OpenDC defines 7 different models that map utilization to power draw. The default power model is a linear model with an idle power of 200W
and a maximum power of 400W.

The `type` selects the model:

| Type         | Fields                                                    | Power draw                                                                       |
|--------------|-----------------------------------------------------------|----------------------------------------------------------------------------------|
| `constant`   | `power`                                                   | A constant power of `power`, regardless of the utilization.                                  |
| `linear`     | `idlePower`, `maxPower`                                   | Grows linearly from `idlePower` at 0% utilization to `maxPower` at 100%.         |
| `square`     | `idlePower`, `maxPower`                                   | Grows with the square of the utilization.                                        |
| `cubic`      | `idlePower`, `maxPower`                                   | Grows with the cube of the utilization.                                          |
| `sqrt`       | `idlePower`, `maxPower`                                   | Grows with the square root of the utilization.                                   |
| `mse`        | `idlePower`, `maxPower`, `calibrationFactor`              | Fitted to measurements, after Fan et al., ISCA 2007.                             |
| `asymptotic` | `idlePower`, `maxPower`, `asymUtil`, `dvfs` (default `true`) | Grows close to linearly above the utilization `asymUtil`, adapted from GreenCloud. |

All power fields are [Power](../../Units.md) values. `idlePower` can not be higher than `maxPower`.

## Example

```json
"cpuPowerModel": {
    "type": "sqrt",
    "idlePower": "32 W",
    "maxPower": "180 W"
}
```
