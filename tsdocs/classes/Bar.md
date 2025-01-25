[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / Bar

# Class: Bar

## Constructors

### new Bar()

> **new Bar**(`terminal`, `options`?): [`Bar`](Bar.md)

#### Parameters

##### terminal

[`ITerminal`](../interfaces/ITerminal.md) = `...`

##### options?

[`IOptions`](../interfaces/IOptions.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:18](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L18)

## Methods

### add()

> **add**(`bar`): [`Bar`](Bar.md)

#### Parameters

##### bar

[`IBarItem`](../interfaces/IBarItem.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:32](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L32)

***

### addProgress()

> **addProgress**(`progress`): [`Bar`](Bar.md)

#### Parameters

##### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:40](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L40)

***

### clean()

> **clean**(): [`Bar`](Bar.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:70](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L70)

***

### getItems()

> **getItems**(): [`IBarItem`](../interfaces/IBarItem.md)[]

#### Returns

[`IBarItem`](../interfaces/IBarItem.md)[]

#### Defined in

[bar.ts:44](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L44)

***

### isStarted()

> **isStarted**(): `boolean`

#### Returns

`boolean`

#### Defined in

[bar.ts:28](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L28)

***

### refresh()

> **refresh**(): [`Bar`](Bar.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:75](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L75)

***

### remove()

> **remove**(`bar`): [`Bar`](Bar.md)

#### Parameters

##### bar

[`IBarItem`](../interfaces/IBarItem.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:48](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L48)

***

### removeByProgress()

> **removeByProgress**(`progress`): [`Bar`](Bar.md)

#### Parameters

##### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:54](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L54)

***

### render()

> **render**(): [`Bar`](Bar.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:62](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L62)

***

### start()

> **start**(`autoRefresh`): [`Bar`](Bar.md)

#### Parameters

##### autoRefresh

`number` = `0`

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:106](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L106)

***

### stop()

> **stop**(): [`Bar`](Bar.md)

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:116](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L116)

***

### wrapLog()

> **wrapLog**(`logFunction`): [`Bar`](Bar.md)

#### Parameters

##### logFunction

() => `void`

#### Returns

[`Bar`](Bar.md)

#### Defined in

[bar.ts:99](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L99)

***

### wrapLogger()

> **wrapLogger**\<`T`\>(`logger`): `T`

#### Type Parameters

• **T** *extends* `Record`\<`string`, `any`\>

#### Parameters

##### logger

`T`

#### Returns

`T`

#### Defined in

[bar.ts:81](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar.ts#L81)
