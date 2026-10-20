---
sidebar_position: 4
description: Virtualization overhead models, which determine the performance lost when a GPU is shared.
---

# Virtualization overhead

A virtualization overhead model determines how much performance a GPU loses when it is shared by virtual machines. The
overhead lowers the capacity the GPU can supply. It is set with the `virtualizationOverhead` field of a
[GPU](./Host.md#gpu). The default is `none`.

The `type` selects the model:

| Type         | Fields               | Behaviour                                                                                                                                                       |
|--------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `none`       |                      | No overhead, as with GPU pass-through. This is the default.                                                                                                     |
| `constant`   | `percentageOverhead` | A fixed overhead, as a fraction of the capacity. When `percentageOverhead` is omitted, 0.05 (5%) is used.                                                       |
| `shareBased` |                      | An overhead that depends on the number of virtual machines sharing the GPU, based on Garg et al., [Empirical Analysis of Hardware-Assisted GPU Virtualization](https://doi.org/10.1109/HiPC.2019.00054). |

## Example

```json
"virtualizationOverhead": {
    "type": "constant",
    "percentageOverhead": 0.25
}
```
