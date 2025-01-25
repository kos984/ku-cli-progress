[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / EtaDataProvider

# Class: EtaDataProvider

## Constructors

### new EtaDataProvider()

> **new EtaDataProvider**(`params`): [`EtaDataProvider`](EtaDataProvider.md)

#### Parameters

##### params

[`IEtaDataProviderParams`](../interfaces/IEtaDataProviderParams.md) = `{}`

#### Returns

[`EtaDataProvider`](EtaDataProvider.md)

#### Defined in

[data-providers/eta/eta.data-provider.ts:27](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/eta/eta.data-provider.ts#L27)

## Properties

### presets

> `static` **presets**: `object`

#### long()

> **long**: (`value`) => `string` = `etaFormatFunctionLong`

##### Parameters

###### value

`number`

##### Returns

`string`

#### short()

> **short**: (`value`) => `string` = `etaFormatFunctionShort`

##### Parameters

###### value

`number`

##### Returns

`string`

#### simple()

> **simple**: (`value`) => `string` = `etaFormatFunctionSimple`

##### Parameters

###### value

`number`

##### Returns

`string`

#### time()

> **time**: (`value`) => `string` = `etaFormatFunctionTime`

##### Parameters

###### value

`number`

##### Returns

`string`

#### Defined in

[data-providers/eta/eta.data-provider.ts:17](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/eta/eta.data-provider.ts#L17)

## Methods

### getData()

> **getData**(`progress`): `string`

#### Parameters

##### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

#### Returns

`string`

#### Defined in

[data-providers/eta/eta.data-provider.ts:43](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/eta/eta.data-provider.ts#L43)

***

### getProviders()

> **getProviders**(): `object`

#### Returns

`object`

##### etaHumanReadable()

> **etaHumanReadable**: (`progress`, `progresses`) => `string`

###### Parameters

###### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

###### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

###### Returns

`string`

#### Defined in

[data-providers/eta/eta.data-provider.ts:35](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/eta/eta.data-provider.ts#L35)
