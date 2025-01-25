[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / Progress

# Class: Progress\<IPayload\>

## Type Parameters

• **IPayload** = `unknown`

## Implements

- [`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

## Constructors

### new Progress()

> **new Progress**\<`IPayload`\>(`params`, `payload`): [`Progress`](Progress.md)\<`IPayload`\>

#### Parameters

##### params

[`IProgressParams`](../interfaces/IProgressParams.md)

##### payload

`IPayload` = `...`

#### Returns

[`Progress`](Progress.md)\<`IPayload`\>

#### Defined in

[progress.ts:21](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L21)

## Properties

### emitter

> `readonly` **emitter**: `EventEmitter`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`emitter`](../interfaces/IProgress.md#emitter)

#### Defined in

[progress.ts:14](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L14)

## Methods

### getEta()

> **getEta**(): [`IEta`](../interfaces/IEta.md)

#### Returns

[`IEta`](../interfaces/IEta.md)

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getEta`](../interfaces/IProgress.md#geteta)

#### Defined in

[progress.ts:96](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L96)

***

### getPayload()

> **getPayload**(): `IPayload`

#### Returns

`IPayload`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getPayload`](../interfaces/IProgress.md#getpayload)

#### Defined in

[progress.ts:83](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L83)

***

### getProgress()

> **getProgress**(): `number`

#### Returns

`number`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getProgress`](../interfaces/IProgress.md#getprogress)

#### Defined in

[progress.ts:87](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L87)

***

### getTag()

> **getTag**(): `string`

#### Returns

`string`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getTag`](../interfaces/IProgress.md#gettag)

#### Defined in

[progress.ts:92](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L92)

***

### getTotal()

> **getTotal**(): `number`

#### Returns

`number`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getTotal`](../interfaces/IProgress.md#gettotal)

#### Defined in

[progress.ts:75](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L75)

***

### getValue()

> **getValue**(): `number`

#### Returns

`number`

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`getValue`](../interfaces/IProgress.md#getvalue)

#### Defined in

[progress.ts:79](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L79)

***

### increment()

> **increment**(`delta`, `payload`?): [`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Parameters

##### delta

`number` = `1`

##### payload?

`IPayload`

#### Returns

[`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`increment`](../interfaces/IProgress.md#increment)

#### Defined in

[progress.ts:32](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L32)

***

### on()

> **on**(`type`, `listener`): [`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Parameters

##### type

`"update"`

##### listener

(`e`) => `void`

#### Returns

[`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`on`](../interfaces/IProgress.md#on)

#### Defined in

[progress.ts:48](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L48)

***

### set()

> **set**(`count`, `payload`?): [`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Parameters

##### count

`number`

##### payload?

`IPayload`

#### Returns

[`IProgress`](../interfaces/IProgress.md)\<`IPayload`\>

#### Implementation of

[`IProgress`](../interfaces/IProgress.md).[`set`](../interfaces/IProgress.md#set)

#### Defined in

[progress.ts:36](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L36)

***

### setTotal()

> **setTotal**(`total`): [`Progress`](Progress.md)\<`IPayload`\>

#### Parameters

##### total

`number`

#### Returns

[`Progress`](Progress.md)\<`IPayload`\>

#### Defined in

[progress.ts:43](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/progress.ts#L43)
