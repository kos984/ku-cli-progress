[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / IEtaParams

# Interface: IEtaParams

## Properties

### debounce?

> `optional` **debounce**: `number`

debounce - a parameter utilized to filter out minor speed fluctuations.
It defines the threshold at which a speed change becomes significant
enough to be considered in the calculations. For instance, with a
relatively large debounce value, small speed oscillations resulting
from noise or measurement inaccuracies won't affect the ETA calculations.

#### Defined in

[eta/eta.ts:25](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L25)

***

### deps?

> `optional` **deps**: `number`

deps - indicates the number of recent instantaneous speeds used to
compute the average speed. As a new instantaneous speed is calculated
and added to the speedMoment array, greater weight is assigned to older
speeds. This helps to smooth out potential rapid speed changes and
makes the calculations more robust.

#### Defined in

[eta/eta.ts:17](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L17)

***

### time?

> `optional` **time**: `Time`

#### Defined in

[eta/eta.ts:26](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L26)
