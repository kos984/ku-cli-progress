[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / Eta

# Class: Eta

## Implements

- [`IEta`](../interfaces/IEta.md)

## Constructors

### new Eta()

> **new Eta**(`params`?): [`Eta`](Eta.md)

#### Parameters

##### params?

[`IEtaParams`](../interfaces/IEtaParams.md)

#### Returns

[`Eta`](Eta.md)

#### Defined in

[eta/eta.ts:41](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L41)

## Methods

### getDurationMs()

> **getDurationMs**(): `number`

#### Returns

`number`

#### Implementation of

[`IEta`](../interfaces/IEta.md).[`getDurationMs`](../interfaces/IEta.md#getdurationms)

#### Defined in

[eta/eta.ts:86](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L86)

***

### getEtaS()

> **getEtaS**(): `number`

#### Returns

`number`

#### Implementation of

[`IEta`](../interfaces/IEta.md).[`getEtaS`](../interfaces/IEta.md#getetas)

#### Defined in

[eta/eta.ts:75](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L75)

***

### getSpeed()

> **getSpeed**(): `number`

#### Returns

`number`

#### Implementation of

[`IEta`](../interfaces/IEta.md).[`getSpeed`](../interfaces/IEta.md#getspeed)

#### Defined in

[eta/eta.ts:81](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L81)

***

### set()

> **set**(`count`): [`IEta`](../interfaces/IEta.md)

#### Parameters

##### count

`number`

#### Returns

[`IEta`](../interfaces/IEta.md)

#### Implementation of

[`IEta`](../interfaces/IEta.md).[`set`](../interfaces/IEta.md#set)

#### Defined in

[eta/eta.ts:50](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L50)

***

### update()

> **update**(`value`, `total`): [`IEta`](../interfaces/IEta.md)

#### Parameters

##### value

`number`

##### total

`number`

#### Returns

[`IEta`](../interfaces/IEta.md)

#### Implementation of

[`IEta`](../interfaces/IEta.md).[`update`](../interfaces/IEta.md#update)

#### Defined in

[eta/eta.ts:61](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/eta/eta.ts#L61)
