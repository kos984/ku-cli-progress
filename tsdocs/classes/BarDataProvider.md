[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / BarDataProvider

# Class: BarDataProvider

## Constructors

### new BarDataProvider()

> **new BarDataProvider**(`options`): [`BarDataProvider`](BarDataProvider.md)

#### Parameters

##### options

`Partial`\<[`IBarOptions`](../interfaces/IBarOptions.md)\>

#### Returns

[`BarDataProvider`](BarDataProvider.md)

#### Defined in

[data-providers/bar/bar.data-provider.ts:20](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-provider.ts#L20)

## Methods

### getData()

> **getData**(`progress`, `progresses`): [`BarDataResult`](BarDataResult.md)

#### Parameters

##### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

##### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

#### Returns

[`BarDataResult`](BarDataResult.md)

#### Defined in

[data-providers/bar/bar.data-provider.ts:34](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-provider.ts#L34)

***

### getProviders()

> **getProviders**(): `object`

#### Returns

`object`

##### bar()

> **bar**: (`progress`, `progresses`) => [`BarDataResult`](BarDataResult.md)

###### Parameters

###### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

###### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

###### Returns

[`BarDataResult`](BarDataResult.md)

##### bars()

> **bars**: (`progress`, `progresses`) => [`BarDataResult`](BarDataResult.md)

###### Parameters

###### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

###### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

###### Returns

[`BarDataResult`](BarDataResult.md)

#### Defined in

[data-providers/bar/bar.data-provider.ts:24](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/bar/bar.data-provider.ts#L24)
