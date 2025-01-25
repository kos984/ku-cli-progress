[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / BarItemLegacy

# Class: BarItemLegacy\<ICustomFormatters, ICustomDataProvider\>

## Type Parameters

• **ICustomFormatters** = `any`

• **ICustomDataProvider** = `any`

## Implements

- [`IBarItem`](../interfaces/IBarItem.md)

## Constructors

### new BarItemLegacy()

> **new BarItemLegacy**\<`ICustomFormatters`, `ICustomDataProvider`\>(`progresses`, `params`?): [`BarItemLegacy`](BarItemLegacy.md)\<`ICustomFormatters`, `ICustomDataProvider`\>

#### Parameters

##### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\> | [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

##### params?

[`IParamsLegacy`](../interfaces/IParamsLegacy.md)\<`ICustomFormatters`, `ICustomDataProvider`\>

#### Returns

[`BarItemLegacy`](BarItemLegacy.md)\<`ICustomFormatters`, `ICustomDataProvider`\>

#### Defined in

[bar-items/bar-item-legacy/bar-item-legacy.ts:35](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item-legacy/bar-item-legacy.ts#L35)

## Methods

### getProgresses()

> **getProgresses**(): [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

#### Returns

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

#### Implementation of

[`IBarItem`](../interfaces/IBarItem.md).[`getProgresses`](../interfaces/IBarItem.md#getprogresses)

#### Defined in

[bar-items/bar-item-legacy/bar-item-legacy.ts:49](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item-legacy/bar-item-legacy.ts#L49)

***

### render()

> **render**(): `string`

#### Returns

`string`

#### Implementation of

[`IBarItem`](../interfaces/IBarItem.md).[`render`](../interfaces/IBarItem.md#render)

#### Defined in

[bar-items/bar-item-legacy/bar-item-legacy.ts:53](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item-legacy/bar-item-legacy.ts#L53)
