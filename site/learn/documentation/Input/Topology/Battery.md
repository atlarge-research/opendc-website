---
sidebar_position: 6
description: Batteries, which store energy for a data center to use when the carbon intensity is high.
---

# Battery

A [data center](./Topology.md#data-center) can have a battery. A battery stores energy from the power source and can
supply it to the hosts later. A [Battery Policy](#battery-policies) decides when it charges and discharges.

| Field              | Type                      | Default     | Description                                                   |
|--------------------|---------------------------|-------------|---------------------------------------------------------------|
| `name`             | string                    | `"Battery"` | Name of the battery.                                          |
| `capacity`         | [Energy](../../Units.md)  | required    | The amount of energy the battery can store.                   |
| `chargingSpeed`    | [Power](../../Units.md)   | required    | The speed at which the battery charges.                       |
| `initialCharge`    | [Energy](../../Units.md)  | `0`         | The charge at the start of the simulation.                    |
| `policy`           | [policy](#battery-policies) | required    | When the battery charges and discharges.                      |
| `embodiedCarbon`   | number                    | `0`         | The carbon emitted to manufacture the battery, in kg CO2.     |
| `expectedLifetime` | number                    | `0`         | The expected lifetime of the battery, in years.               |

:::caution
A plain number for `capacity` or `initialCharge` is read in Joule. Write `"100 kWh"` for kilowatt-hours.
:::

## Battery Policies

The Battery policy decides when to charge and discharge the battery. 
At the moment, OpenDC only supports the use of batteries to reduce the carbon emissions of a datacenter. 
This is done by charging when carbon intensity is low, and discharging when high.

| Type              | Fields                           | The carbon intensity is low when it is                                                     |
|-------------------|----------------------------------|--------------------------------------------------------------------------------------------|
| `single`          | `carbonThreshold`                | below `carbonThreshold`.                                                                   |
| `double`          | `lowerThreshold`, `upperThreshold` | below `lowerThreshold`, and high when it is above `upperThreshold`. In between, the battery is idle. |
| `runningMean`     | `startingThreshold`, `windowSize` | below the mean of the last `windowSize` carbon intensities.                               |
| `runningMeanPlus` | `startingThreshold`, `windowSize` | like `runningMean`, but the battery only starts charging once the carbon intensity stops decreasing. |

## Example

```json
"battery": {
    "capacity": "100 kWh",
    "chargingSpeed": "5000 W",
    "initialCharge": "20 kWh",
    "policy": { "type": "runningMeanPlus", "startingThreshold": 150.0, "windowSize": 168 },
    "embodiedCarbon": 1200.0,
    "expectedLifetime": 10.0
}
```
