[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / BarItem

# Class: BarItem\<ICustomInterfaces\>

## Type Parameters

• **ICustomInterfaces** *extends* [`ICustomInterfacesExtends`](../interfaces/ICustomInterfacesExtends.md)

## Implements

- [`IBarItem`](../interfaces/IBarItem.md)

## Constructors

### new BarItem()

> **new BarItem**\<`ICustomInterfaces`\>(`progresses`, `params`?): [`BarItem`](BarItem.md)\<`ICustomInterfaces`\>

#### Parameters

##### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\> | [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

##### params?

[`IBarItemParams`](../interfaces/IBarItemParams.md)\<`ICustomInterfaces`\>

#### Returns

[`BarItem`](BarItem.md)\<`ICustomInterfaces`\>

#### Defined in

[bar-items/bar-item/bar-item.ts:28](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/bar-item.ts#L28)

## Methods

### getProgresses()

> **getProgresses**(): [`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

#### Returns

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

#### Implementation of

[`IBarItem`](../interfaces/IBarItem.md).[`getProgresses`](../interfaces/IBarItem.md#getprogresses)

#### Defined in

[bar-items/bar-item/bar-item.ts:52](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/bar-item.ts#L52)

***

### render()

> **render**(): `string`

#### Returns

`string`

#### Implementation of

[`IBarItem`](../interfaces/IBarItem.md).[`render`](../interfaces/IBarItem.md#render)

#### Defined in

[bar-items/bar-item/bar-item.ts:56](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/bar-item.ts#L56)
