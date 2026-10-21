---
description: M3SA, which combines the results of several OpenDC2 scenarios into a Multi-Model and a Meta-Model.
---

# M3SA

M3SA (Multi-Meta-Model Simulation Analysis) analyses the results of an OpenDC2 experiment. It treats each scenario as
a model, and plots one metric of all of them together: the Multi-Model. From the Multi-Model it can compute a
Meta-Model, such as the mean of all models.

## Running M3SA

The M3SA runner runs an experiment and then analyses its results with M3SA. Its main class is
`opendc-experiments/opendc-experiments-m3sa/src/main/kotlin/org/opendc/experiments/m3sa/runner/M3SACli.kt` on the
`OpenDC2-maintenance` branch.

| Option                     | Default                                            | Description                                    |
|----------------------------|----------------------------------------------------|------------------------------------------------|
| `--experiment-path`        | `resources/experiment.json`                        | The [experiment](../Input/Experiment.md) file. |
| `-m`, `--m3sa-setup-path`  | none                                               | The M3SA [setup file](#setup-file). Without it, M3SA is skipped. |
| `-e`, `--m3sa-exec-path`   | `opendc-experiments/opendc-experiments-m3sa/src/main/python/` | The folder of the M3SA Python program. |
| `-i`, `--iterations`       | `1`                                                | How often the experiment and analysis are run. |

The runner analyses the results in `outputFolder/outputs/`, so set the `name` of the experiment to `outputs`.

M3SA can also be run on its own. The `m3sa` script in the Python folder sets up a Python environment and runs the
analysis:

```bash
m3sa setup.json output/outputs/raw-output -o output/outputs
```

The plot is written to `simulation-analysis/<metric>/` in the output folder, as a PDF. With a Meta-Model, its values are
written to `raw-output/metamodel/seed=0/<metric>.parquet`.

## Setup file

| Field                    | Type             | Default         | Description                                                                                  |
|--------------------------|------------------|-----------------|----------------------------------------------------------------------------------------------|
| `metric`                 | string           | required        | The output column to analyse, such as `power_draw` or `carbon_emission`.                     |
| `meta_function`          | string           | required        | How the Meta-Model combines the models: `mean` or `median`. Required, also without a Meta-Model. |
| `multimodel`             | boolean          | `true`          | Build a Multi-Model.                                                                         |
| `metamodel`              | boolean          | `false`         | Also compute a Meta-Model.                                                                   |
| `window_size`            | integer          | `1`             | The number of samples that are combined into one value.                                      |
| `window_function`        | string           | `mean`          | How the samples in a window are combined: `mean` or `median`.                                |
| `seed`                   | integer          | `0`             | The run to analyse, from its `seed=` folder.                                                 |
| `current_unit`           | string           | `""`            | The unit of the metric, without a prefix, such as `W`.                                       |
| `unit_scaling_magnitude` | integer          | `1`             | The power of ten by which the values are scaled, such as `3` for a factor 1000.              |
| `samples_per_minute`     | number           | `0`             | The export rate of the simulation. Not used at the moment.                                   |
| `plot_type`              | string           | `time_series`   | `time_series`, `cumulative` or `cumulative_time_series`.                                     |
| `plot_title`             | string           | `""`            | The title of the plot.                                                                       |
| `x_label`, `y_label`     | string           | `""`            | The labels of the axes.                                                                      |
| `x_min`, `x_max`         | number           | automatic       | The range of the x-axis. Both must be given.                                                 |
| `y_min`, `y_max`         | number           | automatic       | The range of the y-axis. Both must be given.                                                 |
| `x_ticks_count`, `y_ticks_count` | integer  | automatic       | The number of ticks on each axis.                                                            |
| `figsize`                | list of numbers  | `[20, 10]`      | The width and height of the plot.                                                            |
| `plot_colors`            | list of strings  | default colors  | The colors of the lines, such as `"#0277BB"`.                                                |
| `figure_export_name`     | string           | generated       | The file name of the plot, without `.pdf`.                                                   |

## Example

```json
{
    "metric": "power_draw",
    "multimodel": true,
    "metamodel": true,
    "meta_function": "mean",
    "window_size": 10,
    "window_function": "mean",
    "current_unit": "W",
    "unit_scaling_magnitude": 3,
    "plot_type": "time_series",
    "plot_title": "Power draw",
    "x_label": "Time",
    "y_label": "Power draw [kW]",
    "y_min": 0,
    "y_max": 33,
    "figure_export_name": "power-draw"
}
```

This plots the power draw of every scenario, averaged over windows of 10 samples, together with a Meta-Model that is
the mean of all scenarios.
