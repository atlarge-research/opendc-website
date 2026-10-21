---
description: How to install OpenDC on your own machine.
---

# Installation

OpenDC runs on Windows, macOS and Linux, and needs Java 21 or newer. You can download Java from
[Oracle](https://www.oracle.com/java/technologies/downloads/) or install it with your package manager.

## Building OpenDC

OpenDC3 is built from the `master` branch of the [OpenDC repository](https://github.com/atlarge-research/opendc):

```bash
git clone https://github.com/atlarge-research/opendc.git
cd opendc
./gradlew :opendc-cli:installDist
```

This puts OpenDC in `opendc-cli/build/install/OpenDCExperimentRunner/`. Add its `bin` folder to your `PATH`, so that you
can run `opendc` from anywhere:

```bash
export PATH=$PATH:$(realpath opendc-cli/build/install/OpenDCExperimentRunner/bin)
```

On Windows, use `opendc.bat` in the same `bin` folder.

Check that it works:

```bash
opendc --help
```

After pulling new changes from the repository, run `installDist` again to update `opendc`.

### Other ways to build OpenDC

Besides `installDist`, Gradle can package OpenDC as an archive. All three tasks contain the same files: the `opendc`
command in `bin`, and the libraries it needs in `lib`.

| Task                               | Result                                                                                     | Use it to                                                         |
|------------------------------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `./gradlew :opendc-cli:installDist`  | A folder that is ready to run: `opendc-cli/build/install/OpenDCExperimentRunner/`          | Run OpenDC on your own machine. **This is the recommended option.** |
| `./gradlew :opendc-cli:distTar`      | An archive: `opendc-cli/build/distributions/OpenDCExperimentRunner.tar`                    | Copy OpenDC to another machine, such as a cluster, and unpack it there with `tar -xf`. |
| `./gradlew :opendc-cli:assembleDist` | Two archives in `opendc-cli/build/distributions/`: `OpenDCExperimentRunner.tar` and `OpenDCExperimentRunner.zip` | Share OpenDC with others, for example with Windows users, who can unpack the `.zip`. |

:::note OpenDC2
To run OpenDC2 instead, see [Running OpenDC2](../opendc-2/Running.md).
:::
