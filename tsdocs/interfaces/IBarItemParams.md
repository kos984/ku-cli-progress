[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / IBarItemParams

# Interface: IBarItemParams\<ICustomInterfaces\>

## Type Parameters

• **ICustomInterfaces** *extends* [`ICustomInterfacesExtends`](ICustomInterfacesExtends.md)

## Properties

### dataProviders?

> `optional` **dataProviders**: `Record`\<`string`, \{ `getData`: [`IDataProvider`](../type-aliases/IDataProvider.md)\<`unknown`, `ICustomInterfaces`\[`"payload"`\]\>; \}\>

#### Defined in

[bar-items/bar-item/interfaces/bar-item-params.interface.ts:11](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/interfaces/bar-item-params.interface.ts#L11)

***

### options?

> `optional` **options**: `Partial`\<[`IBarOptions`](IBarOptions.md)\>

#### Defined in

[bar-items/bar-item/interfaces/bar-item-params.interface.ts:10](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/interfaces/bar-item-params.interface.ts#L10)

***

### template?

> `optional` **template**: [`ITemplateFunction`](../type-aliases/ITemplateFunction.md)\<`ICustomInterfaces`\[`"dataProviders"`\]\>

#### Defined in

[bar-items/bar-item/interfaces/bar-item-params.interface.ts:9](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/bar-items/bar-item/interfaces/bar-item-params.interface.ts#L9)
