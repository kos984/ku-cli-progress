[**ku-progress-bar**](../README.md)

***

[ku-progress-bar](../globals.md) / TerminalTty

# Class: TerminalTty

## Implements

- [`ITerminal`](../interfaces/ITerminal.md)

## Constructors

### new TerminalTty()

> **new TerminalTty**(`stream`): [`TerminalTty`](TerminalTty.md)

#### Parameters

##### stream

`WriteStream` = `process.stderr`

#### Returns

[`TerminalTty`](TerminalTty.md)

#### Defined in

[terminals/terminal-tty.ts:9](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L9)

## Methods

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Implementation of

[`ITerminal`](../interfaces/ITerminal.md).[`clear`](../interfaces/ITerminal.md#clear)

#### Defined in

[terminals/terminal-tty.ts:50](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L50)

***

### cursor()

> **cursor**(`enabled`): `void`

#### Parameters

##### enabled

`boolean`

#### Returns

`void`

#### Defined in

[terminals/terminal-tty.ts:16](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L16)

***

### refresh()

> **refresh**(): `void`

#### Returns

`void`

#### Implementation of

[`ITerminal`](../interfaces/ITerminal.md).[`refresh`](../interfaces/ITerminal.md#refresh)

#### Defined in

[terminals/terminal-tty.ts:57](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L57)

***

### resetCursor()

> **resetCursor**(`lines`): `void`

#### Parameters

##### lines

`number`

#### Returns

`void`

#### Defined in

[terminals/terminal-tty.ts:24](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L24)

***

### write()

> **write**(`s`): `void`

#### Parameters

##### s

`string`

#### Returns

`void`

#### Implementation of

[`ITerminal`](../interfaces/ITerminal.md).[`write`](../interfaces/ITerminal.md#write)

#### Defined in

[terminals/terminal-tty.ts:29](https://github.com/kos984/ku-cli-progress/blob/807fcdf3af9280a08bd7528a28d38921901b9125/src/lib/terminals/terminal-tty.ts#L29)
