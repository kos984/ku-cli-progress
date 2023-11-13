# Installation

```
$ npm install  ku-progress-bar
```

## Simple bar
```typescript
const progress = new Progress({ total: 1000 });

const bar = new Bar(progress);

progress.increment(300);

bar.renderBars();
```

```console
✗ ts-node ./src/examples/simple-start.ts
[============----------------------------] 30% ETA: 71s speed: 10/s duration: 30s 300/1000
```

## Presets

```typescript
import { Bar, BarItem, presets, Progress } from '../';
import * as chalk from 'chalk';

const bar = new Bar();
const progress = new Progress({ total: 100 });

bar.add(new BarItem(progress, {
  options: presets.braille,
}));

bar.start();

```

```console
✗ ts-node ./src/examples/presets.example.ts
 classic [============----------------------------] 31% ETA: 7s speed: 10/s duration: 3s 31/100
 shades  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 31% ETA: 7s speed: 10/s duration: 3s 31/100
 rect    [■■■■■■■■■■■■                            ] 31% ETA: 7s speed: 10/s duration: 3s 31/100
 braille [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 31% ETA: 7s speed: 10/s duration: 3s 31/100
```

![img.png](docs/images/presets.png)

![braille-progress](docs/images/braille.svg)

# Multi bars

```typescript
const bar = new Bar();
for (let i = 0; i < 7; i++) {
  bar.addProgress(
    new Progress({ total: 1000 }).increment(Math.floor(Math.random() * 1000)),
  );
}
bar.render();
```
# Composite Progress bar
```typescript
export const bar = new Bar().start();
const progresses = [
  new Progress({ total: 1000, start: 300 }),
  new Progress({ total: 1000 }),
];
bar.add(
  new BarItem(
    progresses,
    {
      options: presets.shades,
      formatters: {
        bars: new BarsFormatter([chalk.green, chalk.yellowBright]),
      },
    },
  ),
);
```

![composite-progress](docs/images/composite-progress.example.gif)

#Multi Bar

![multi-files-processing](docs/images/multi-files-processing.example.gif)

## Parameters of the `BarItem` class:

1.  **`progresses`** (`IProgress | IProgress[]`):
   An object or an array of objects of type `IProgress` representing the progress.

2.  **`params`** (`IParams | undefined`):
   Additional parameters to customize the appearance and behavior of the progress bar.
    -   **`template`** (`string | undefined`): Template for displaying the progress bar.
    -   **`options`** (`Partial<IBarOptions> | undefined`): Configuration settings for displaying the progress bar.
    -   **`formatters`** (`IFormatters | undefined`): Formatting functions for each progress.
    -   **`dataProviders`** (`IDataProviders | undefined`): Functions to provide additional data.

### Template Format:

```js
// see src/examples/spinner.ts
bar.add(
  new BarItem(progress, {
    template:
      '[{bar}] {spinner} {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total} (task: {task})',
    dataProviders: {
      spinner: () => spinner.next().value,
    },
  }),
);
// or
bar.add(
  new BarItem<never, { spinner: () => string }>(progress, {
    template: ({ bar, percentage, eta, speed, duration, value, total, spinner}) => {
      const task = progress.getPayload().task;
      return `[${bar}] ${spinner} ${percentage} ETA: ${eta} speed: ${speed} duration: ${duration} ${value}/${total} (task: ${task})`;
    },
    dataProviders: {
      spinner: () => spinner.next().value,
    },
  }),
);

```

In the `BarItem` class, the `template` represents a string template that defines how the progress bar will be displayed. In this template, you can use various placeholders that will substitute actual progress values into the resulting string.

Let's review some key placeholders you can use in the template:

-   `{bar}`: Placeholder for inserting the progress bar.
-   `{percentage}`:  Placeholder for inserting the progress percentage.
-   `{eta}`: Placeholder for inserting the estimated time of arrival (ETA).
-   `{etaHumanReadable}`: Placeholder for inserting the estimated time (ETA). (`2h47m30s`)
-   `{speed}`:   Placeholder for inserting the progress speed.
-   `{value}`: Placeholder for inserting the current value.
-   `{total}`: Placeholder for inserting the total value.

These placeholders are replaced with the actual progress values during the generation of the progress bar string.

For example, if you use the template `"{bar} {percentage}%"`, during the generation of the progress bar, you'll see a string that displays the progress bar and the progress percentage.

You can also use more complex templates that incorporate a combination of placeholders and additional text to achieve a specific look and informativeness for the progress bar.

For instance, a template `"[{bar}] Progress: {percentage}%, ETA: {eta}"` will display the progress bar, progress percentage, and the estimated time of arrival.

Additionally, if you pass a custom payload to `Progress`, it is also possible to use it in the template by using the same approach: `{payload_object_key_name}`.

Moreover, you can pass a `dataProviders` object as a parameter to `BarItem`. For example:

```typescript
const dataProviders = {
  customData: (progress, progresses) => renderCustomData(progress, progresses),
  // other data providers
};
```

You can then use it in the template like this:

```typescript
Custom Data: {[customData]}
```
This allows for dynamic and customizable progress bar templates based on the provided data and payload.

### example
```typescript
const bar = new Bar();
const progress = new Progress({ total: 100 }, { task: 'users creating...' });
function * Spinner(chars: string[], delay = 500): Generator<string> {
   let [ index, char, lastUpdate ] = [ 0, ' ', 0 ];
   while (true) {
      if (Date.now() - lastUpdate > delay) {
         index = index + 1 >= chars.length ? 0 : index + 1;
         char = chars.length ? chars[index] : '';
         lastUpdate = Date.now();
      }
      yield char;
   }
}
const spinner = Spinner([ '\\', '|', '/', '-']);
bar.add(new BarItem(progress, {
   template: '[{bar}] {spinner} {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total} (task: {task})',
   dataProviders: {
      spinner: () => spinner.next().value,
   },
}))
progress.increment(1, { task: 'permission granting...' });

const interval = setInterval(() => {
   if (progress.getProgress() >= 1) {
      clearInterval(interval);
   }
   progress.increment();
}, 50)
bar.start();
```

```console
[=====================-------------------] / 53% ETA: 2s speed: 19/s duration: 3s 53/100 (task: permission granting...)
```

### IBarOptions Interface:

The `IBarOptions` interface defines the configuration options for customizing the appearance of a progress bar.

#### Properties:

1.  **`completeChar`** (`string`):
    -   The character used to represent the completed portion of the progress bar.

2.  **`resumeChar`** (`string`):
    -   The character used to represent the remaining portion of the progress bar that needs to be filled.

3.  **`width`** (`number`):
    -   The total width of the progress bar, indicating the number of characters to use for the entire progress representation.

4.  **`glue`** (`string`):
    -   A string used to separate multiple progress bars if displayed together.

### Example Usage:

```typescript
const options: IBarOptions = {
  completeChar: '=',
  resumeChar: '-',
  width: 40,
  glue: ' ',
};
```

# Using tags

It is possible use tags in templates and formatters

```typescript
const progress = new Progress({ total: 100 });
progresses.push(progress);
bar.add(
  new BarItem(
    [progress, new Progress({ total: 100, start: 50, tag: 'red' })],
    {
      template:
        '[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red:value} {value}/{total}',
      tagDelimiter: ':',
      formatters: {
        'red:bar': str => chalk.red(str),
        bar: str => chalk.green(str),
      },
    },
  ),
);
```

# Spinners example
[src/examples/spinner.ts](src/examples/spinner.ts)

![spinner-example](docs/images/spinner-example.gif)

# Some random examples
 see src/examples/random.bar.example.ts

![multi-files-processing](docs/images/random.bar.example.gif)
