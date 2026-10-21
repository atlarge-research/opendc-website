---
sidebar_position: 1
description: How to get OpenDC2 and run an experiment with it.
---

# Running OpenDC2

OpenDC2 runs [experiment files](./Input/Experiment.md) with the `OpenDCExperimentRunner`. OpenDC2 needs Java 21 or
newer.

## Getting OpenDC2

The last release of OpenDC2 is [v2.4u](https://github.com/atlarge-research/opendc/releases/tag/v2.4u). Download
`OpenDCExperimentRunner.zip` or `OpenDCExperimentRunner.tar` and unpack it. It contains a `bin` folder with the
runner, and a `lib` folder with the libraries it needs.

Fixes made after this release are on the
[`OpenDC2-maintenance`](https://github.com/atlarge-research/opendc/tree/OpenDC2-maintenance) branch. To build the runner
from that branch:

```bash
git clone --branch OpenDC2-maintenance https://github.com/atlarge-research/opendc.git
cd opendc
./gradlew :opendc-experiments:opendc-experiments-base:installDist
```

The runner is then in `opendc-experiments/opendc-experiments-base/build/install/OpenDCExperimentRunner/`.

## Running an experiment

```bash
OpenDCExperimentRunner/bin/OpenDCExperimentRunner --experiment-path experiment.json
```

| Option              | Description                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------|
| `--experiment-path` | The experiment file to run. The default is `resources/experiment.json`.                             |
| `-strict`           | Stop with an error when the experiment or a topology has an unknown key. By default, unknown keys are ignored. |

All paths in an experiment, such as those of the topologies and traces, are relative to the directory the runner is
started from. The results are written to the folder set in the experiment, see [Output](./Output/Output.md).

## Running from IntelliJ

1. Open the `OpenDC2-maintenance` checkout in IntelliJ. It is imported as a Gradle project.
2. Open `opendc-experiments/opendc-experiments-base/src/main/kotlin/org/opendc/experiments/base/runner/ExperimentCli.kt`.
3. Click the run arrow next to `fun main`, and choose **Modify Run Configuration...**.
4. Set **Program arguments** to `--experiment-path experiment.json`, and **Working directory** to the folder with your
   experiment files.
5. Run or debug the configuration. The results are written to the working directory.

To run M3SA after a simulation, see [M3SA](./M3SA/M3SA.md).
