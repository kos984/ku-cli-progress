import * as fs from 'fs';

describe('readme', () => {
  const text = fs.readFileSync('./README.md', 'utf-8');
  const lines = text.split('\n');
  const snippets: { code: string; file: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```typescript')) {
      let snippet = '';
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('```')) {
          const file = lines[j + 1].match(/(src[^)]+)/)?.[1];
          snippets.push({
            code: snippet,
            file: file ? decodeURIComponent(file) : file,
          });
          i = j;
          break;
        }
        snippet += lines[j] + '\n';
      }
    }
  }
  it('all path defined', () => {
    for (const snippet of snippets) {
      expect(snippet.file).toBeDefined();
    }
  });
  for (const snippet of snippets) {
    it(snippet.file, () => {
      expect(snippet.code.trim()).toEqual(
        fs.readFileSync(snippet.file, 'utf-8').trim(),
      );
    });
  }
});
