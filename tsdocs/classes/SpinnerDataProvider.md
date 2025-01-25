[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / SpinnerDataProvider

# Class: SpinnerDataProvider

## Constructors

### new SpinnerDataProvider()

> **new SpinnerDataProvider**(`params`?): [`SpinnerDataProvider`](SpinnerDataProvider.md)

#### Parameters

##### params?

[`ISpinnerDataProviderParams`](../interfaces/ISpinnerDataProviderParams.md)

#### Returns

[`SpinnerDataProvider`](SpinnerDataProvider.md)

#### Defined in

[data-providers/spinner/spinner.data-provider.ts:27](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/spinner/spinner.data-provider.ts#L27)

## Properties

### presets

> `static` **presets**: `object`

#### BRAILLE

> **BRAILLE**: `object`

##### BRAILLE.chars

> **chars**: `string`[]

#### SLASH

> **SLASH**: `object`

##### SLASH.chars

> **chars**: `string`[]

#### Defined in

[data-providers/spinner/spinner.data-provider.ts:11](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/spinner/spinner.data-provider.ts#L11)

## Methods

### getData()

> **getData**(`progress`): `string`

#### Parameters

##### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

#### Returns

`string`

#### Defined in

[data-providers/spinner/spinner.data-provider.ts:41](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/spinner/spinner.data-provider.ts#L41)

***

### getProviders()

> **getProviders**(): `object`

#### Returns

`object`

##### spinner()

> **spinner**: (`progress`, `progresses`) => `string`

###### Parameters

###### progress

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>

###### progresses

[`IProgress`](../interfaces/IProgress.md)\<`unknown`\>[]

###### Returns

`string`

#### Defined in

[data-providers/spinner/spinner.data-provider.ts:33](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/data-providers/spinner/spinner.data-provider.ts#L33)
