import axios from 'axios';
import { stringify } from 'qs';
import { compileFile } from 'pug';
import { outputFileSync } from 'fs-extra';
import * as dotenv from 'dotenv';

import { ReceivedJson, RequestParameters, VisitedField } from './types';
import './utils';
import { InternalDateTime } from './utils';
import { loadSecret } from './secrets';

dotenv.config();

const baseUrl = process.env.JTK_BASEURL;

async function getVisited(params: RequestParameters): Promise<ReceivedJson> {
  const exit = () => process.exit(1);

  const req = await axios.post(`${baseUrl}/visited.php`, stringify(params));
  if (req.status / 100 !== 2) exit();
  const data = req.data as ReceivedJson;
  if (data.errCode < 0) exit();
  return data;
}

function generatePage(visits: VisitedField[]) {
  const date = new InternalDateTime();
  const time = date.toInternalFormat();
  const fileTime = date.toFileTimeFormat();
  const compiledFunction = compileFile('src/pug/index.pug');
  const compiled = compiledFunction({
    visits,
    time,
  });
  outputFileSync('dist/index.html', compiled);
  outputFileSync(`dist/${fileTime}.html`, compiled);
}

async function main() {
  const credential: RequestParameters = {
    v: '2.59',
    ...loadSecret(),
  };

  const visited = (await getVisited(credential)).visit;
  generatePage(visited);
}

main();
