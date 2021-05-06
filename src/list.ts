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

  dir.forEach((dirname) => {
    const list = readdirSync(`./dist/${dirname}`).filter(
      (_) => _ !== 'index.html',
    );
    const compiled = compiledFunction({
      list,
      isSubDir: true,
      dir: `/${dirname}/`,
    });
    outputFileSync(`dist/${dirname}/index.html`, compiled);
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
