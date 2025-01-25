[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / IProgress

# Interface: IProgress\<IPayload\>

## Type Parameters

• **IPayload** = `unknown`

## Properties

### emitter

> **emitter**: `EventEmitter`

#### Defined in

[interfaces/progress.interface.ts:17](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L17)

## Methods

### getEta()

> **getEta**(): [`IEta`](IEta.md)

#### Returns

[`IEta`](IEta.md)

#### Defined in

[interfaces/progress.interface.ts:20](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L20)

***

### getPayload()

> **getPayload**(): `IPayload`

#### Returns

`IPayload`

#### Defined in

[interfaces/progress.interface.ts:24](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L24)

***

### getProgress()

> **getProgress**(): `number`

#### Returns

`number`

#### Defined in

[interfaces/progress.interface.ts:18](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L18)

***

### getTag()

> **getTag**(): `string`

#### Returns

`string`

#### Defined in

[interfaces/progress.interface.ts:21](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L21)

***

### getTotal()

> **getTotal**(): `number`

#### Returns

`number`

#### Defined in

[interfaces/progress.interface.ts:23](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L23)

***

### getValue()

> **getValue**(): `number`

#### Returns

`number`

#### Defined in

[interfaces/progress.interface.ts:22](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L22)

***

### increment()

> **increment**(`delta`, `payload`?): [`IProgress`](IProgress.md)\<`IPayload`\>

#### Parameters

##### delta

`number`

##### payload?

`IPayload`

#### Returns

[`IProgress`](IProgress.md)\<`IPayload`\>

#### Defined in

[interfaces/progress.interface.ts:19](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L19)

***

### on()

> **on**(`type`, `listener`): [`IProgress`](IProgress.md)\<`IPayload`\>

#### Parameters

##### type

`"update"`

##### listener

(`e`) => `void`

#### Returns

[`IProgress`](IProgress.md)\<`IPayload`\>

#### Defined in

[interfaces/progress.interface.ts:26](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L26)

***

### set()

> **set**(`count`, `payload`?): [`IProgress`](IProgress.md)\<`IPayload`\>

#### Parameters

##### count

`number`

##### payload?

`IPayload`

#### Returns

[`IProgress`](IProgress.md)\<`IPayload`\>

#### Defined in

[interfaces/progress.interface.ts:25](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/interfaces/progress.interface.ts#L25)
