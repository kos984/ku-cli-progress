export const presets = {
  shades: { completeChar: '\u2588', resumeChar: '\u2591' },
  classic: { completeChar: '=', resumeChar: '-' },
  rect: { completeChar: '\u25A0', resumeChar: ' ' },
  braille: {
    // '⣀⣄⣤⣦⣶⣷⣿'
    completeChars: ['\u28C4', '\u28E4', '\u28E6', '\u28F6', '\u28F7', '\u28FF'],
    completeChar: '\u28FF',
    // ⣀
    resumeChar: '\u28C0',
  },
};
