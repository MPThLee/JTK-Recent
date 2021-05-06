import { readdirSync } from 'fs';
import { compileFile } from 'pug';
import { outputFileSync } from 'fs-extra';

export function genList(): void {
  const dir = readdirSync('./dist', { withFileTypes: true })
    .filter((_) => _.isDirectory())
    .map((_) => _.name)
    .filter((_) => !_.startsWith('.'));
  const list = dir.map((_) => _ + '/');

  const compiledFunction = compileFile('src/pug/list.pug');
  const compiled = compiledFunction({
    list,
  });
  outputFileSync('dist/list.html', compiled);

  dir.forEach((dirname1) => {
    const dir = readdirSync(`./dist/${dirname1}`).filter(
      (_) => _ !== 'index.html',
    );
    const list = dir.map((_) => _ + '/');
    const compiled = compiledFunction({
      list,
      isSubDir: 1,
      dir: `/${dirname1}/`,
    });
    outputFileSync(`dist/${dirname1}/index.html`, compiled);
    dir.forEach((dirname2) => {
      const list = readdirSync(`./dist/${dirname1}/${dirname2}`).filter(
        (_) => _ !== 'index.html',
      );
      const compiled = compiledFunction({
        list,
        isSubDir: 2,
        dir: `/${dirname1}/${dirname2}/`,
      });
      outputFileSync(`dist/${dirname1}/${dirname2}/index.html`, compiled);
    });
  });
}

function main(): void {
  try {
    genList();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
