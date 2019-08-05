"use strict"

function localeString(x, sep, grp) {
  const sx = (''+x).split('.');
  let s = '';
  let i, j;
  sep || (sep = '.'); // default seperator
  grp || grp === 0 || (grp = 3); // default grouping
  i = sx[0].length;
  while (i > grp) {
      j = i - grp;
      s = sep + sx[0].slice(j, i) + s;
      i = j;
  }
  s = sx[0].slice(0, i) + s;
  sx[0] = s;
  return sx.join('.');
}

module.exports = { localeString }
