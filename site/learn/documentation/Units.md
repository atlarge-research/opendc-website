---
sidebar_position: 3
description: The units of measure OpenDC uses, and how to write values with a unit in an experiment file.
---

# Units

Many values in an experiment file are physical quantities, such as a clock speed, an amount of memory or a duration.
OpenDC reads these with the units defined in `opendc-common` (package `org.opendc.common.units`). A value can be
written as a string with a unit:

```json
"coreSpeed": "2.1 GHz",
"memory": { "size": "64 GiB" },
"exportInterval": "1 hours"
```

A plain number, such as `2100` or `"2100"`, is read in the default unit of its quantity, and OpenDC logs a warning.
Writing the unit is clearer and avoids mistakes, especially for durations and energy, where the default units are
milliseconds and Joule.

## Available units

| Quantity   | Default unit            | Examples                                                         | Used for                                                                                  |
|------------|-------------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Duration   | millisecond             | `"500 ms"`, `"30 s"`, `"5 minutes"`, `"1 hours"`, `"2 days"`, `"PT13H"` | Task and fragment durations, export interval, checkpoint interval and duration       |
| Frequency  | MHz                     | `"800 kHz"`, `"2100 MHz"`, `"2.1 GHz"`                           | CPU and GPU core speed, memory speed, CPU and GPU capacity and usage of tasks             |
| Data size  | MiB                     | `"512 MiB"`, `"64 GiB"`, `"100 GB"`, `"1 TiB"`                   | Host memory, GPU memory, memory of tasks                                                  |
| Data rate  | Kibps                   | `"10 Gbps"`, `"512 MiBps"`, `"900 GBps"`                         | GPU memory bandwidth                                                                      |
| Power      | Watt                    | `"400 W"`, `"350 Watts"`, `"50 kW"`, `"1 MW"`                    | Power models, maximum power of a power source, charging speed of a battery               |
| Energy     | Joule                   | `"3600 J"`, `"5 MJ"`, `"1 kWh"`, `"100 kWh"`                     | Battery capacity and initial charge                                                       |
| Percentage | ratio                   | `"25%"`, `0.25`                                                  | Used inside OpenDC, not in experiment files                                               |
| Timestamp  | ms since the Unix epoch | `"2024-01-01T00:00:00Z"`                                         | Used inside OpenDC, not in experiment files                                               |

Durations can also be written in the ISO-8601 format, such as `"PT13H"` for 13 hours.

## Writing values

- The number can have decimals or an exponent, such as `"1.5 GHz"` or `"128e3 MiB"`. The space between the number and
  the unit is optional.
- Units can be written as a symbol or as a word, such as `"W"`, `"watt"` or `"Watts"`.
- Capital letters matter in some cases:
  - `m` means milli and `M` means mega. `"2400 mhz"` is an error, write `"2400 MHz"`. In the same way, `"1 MW"` is a
    megawatt.
  - In durations, `m` means minutes and `ms` means milliseconds.
  - In data sizes and data rates, `b` is a bit and `B` is a byte. `"100 Gb"` is 100 gigabits.
- Decimal prefixes (`k`, `M`, `G`, `T`) are powers of 1000 and binary prefixes (`Ki`, `Mi`, `Gi`, `Ti`) are powers of
  1024. `"1 GB"` is 1000 MB and `"1 GiB"` is 1024 MiB.

## Values without a unit

Counts, ratios and multipliers, such as `coreCount`, `allocationRatio` and `multiplier`, are plain numbers. A few other
plain numbers have a fixed unit, which is given on their page. Examples are the embodied carbon of a battery (kg CO2)
and the failure distributions (hours).

The output files also use fixed units, which are listed on the [Output](./Output/Output.md) pages.
