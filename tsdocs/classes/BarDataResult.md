[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / BarDataResult

# Class: BarDataResult

## Constructors

### new BarDataResult()

> **new BarDataResult**(`parts`, `glue`): [`BarDataResult`](BarDataResult.md)

#### Parameters

##### parts

`object`[]

##### glue

`string` = `''`

#### Returns

[`BarDataResult`](BarDataResult.md)

#### Defined in

[data-providers/bar/bar.data-result.ts:4](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-result.ts#L4)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Generator`\<\{ `progress`: [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>; `str`: `string`; \}, `void`, `unknown`\>

#### Returns

`Generator`\<\{ `progress`: [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>; `str`: `string`; \}, `void`, `unknown`\>

#### Defined in

[data-providers/bar/bar.data-result.ts:17](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-result.ts#L17)

***

### getParts()

> **getParts**(): `object`[]

#### Returns

`object`[]

#### Defined in

[data-providers/bar/bar.data-result.ts:13](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-result.ts#L13)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[data-providers/bar/bar.data-result.ts:9](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-result.ts#L9)
