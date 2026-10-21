---
sidebar_position: 6
description: Batteries, which store energy for a cluster to use when the carbon intensity is high.
---

# Battery

A [cluster](./Topology.md#cluster) can have a battery. A battery stores energy from the power source and supplies it to
the hosts later. Its policy decides when it charges and discharges, based on the carbon intensity of the
[power source](./PowerSource.md).

| Field              | Type                  | Default     | Description                                                |
|--------------------|-----------------------|-------------|------------------------------------------------------------|
| `name`             | string                | `"Battery"` | Name of the battery.                                       |
| `capacity`         | number                | required    | The amount of energy the battery can store, in kWh.        |
| `chargingSpeed`    | number                | required    | The speed at which the battery charges, in Watt.           |
| `initialCharge`    | number                | `0`         | The charge at the start of the simulation, in kWh.         |
| `batteryPolicy`    | [policy](#policies)   | required    | When the battery charges and discharges.                   |
| `embodiedCarbon`   | number                | `0`         | The carbon emitted to manufacture the battery, in gram.    |
| `expectedLifetime` | number                | `0`         | The expected lifetime of the battery, in years.            |

## Policies

The `type` selects the policy. In each policy, the battery charges until it is full when the carbon intensity is low,
and discharges until it is empty when the carbon intensity is high.

| Type              | Fields                             | The carbon intensity is low when it is                                                     |
|-------------------|------------------------------------|--------------------------------------------------------------------------------------------|
| `single`          | `carbonThreshold`                  | below `carbonThreshold`.                                                                   |
| `double`          | `lowerThreshold`, `upperThreshold` | below `lowerThreshold`, and high when it is above `upperThreshold`. In between, the battery is idle. |
| `runningMean`     | `startingThreshold`, `windowSize`  | below the mean of the last `windowSize` carbon intensities.                               |
| `runningMeanPlus` | `startingThreshold`, `windowSize`  | like `runningMean`, but the battery only starts charging once the carbon intensity stops decreasing. |

## Example

```json
"battery": {
    "capacity": 100.0,
    "chargingSpeed": 5000.0,
    "batteryPolicy": { "type": "runningMeanPlus", "startingThreshold": 123.2, "windowSize": 168 }
}
```
