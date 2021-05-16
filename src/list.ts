import { readdirSync } from 'fs';
import { compileFile } from 'pug';
import { outputFileSync } from 'fs-extra';
import { exit, getBaseDistDir } from './utils';

export function genList(): void {
  const basedir = getBaseDistDir();

  const dir = readdirSync(basedir, { withFileTypes: true })
    .filter((_) => _.isDirectory())
    .map((_) => _.name)
    .filter((_) => !_.startsWith('.'));
  const list = dir.map((_) => _ + '/');

  const compiledFunction = compileFile('src/pug/list.pug');
  const compiled = compiledFunction({
    list,
  });
  outputFileSync(`${basedir}/list.html`, compiled);

  dir.forEach((dirname1) => {
    const dir = readdirSync(`${basedir}/${dirname1}`).filter(
      (_) => _ !== 'index.html',
    );
    const list = dir.map((_) => _ + '/');
    const compiled = compiledFunction({
      list,
      isSubDir: 1,
      dir: `/${dirname1}/`,
    });
    outputFileSync(`${basedir}/${dirname1}/index.html`, compiled);
    dir.forEach((dirname2) => {
      const list = readdirSync(`${basedir}/${dirname1}/${dirname2}`).filter(
        (_) => _ !== 'index.html',
      );
      const compiled = compiledFunction({
        list,
        isSubDir: 2,
        dir: `/${dirname1}/${dirname2}/`,
      });
      outputFileSync(`${basedir}/${dirname1}/${dirname2}/index.html`, compiled);
    });
  });
}

function main(): void {
  try {
    genList();
  } catch (e) {
    console.error(e);
    exit();
  }
}

main();
