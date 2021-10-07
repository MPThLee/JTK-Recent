import axios from 'axios';
import { stringify } from 'qs';
import { compileFile } from 'pug';
import { outputFileSync } from 'fs-extra';
import * as dotenv from 'dotenv';

import { ReceivedJson, RequestParameters, VisitedField } from './types';
import { exit, getBaseDistDir, InternalDateTime } from './utils';
import { loadSecret } from './secrets';

dotenv.config();

const baseUrl = process.env.JTK_BASEURL;
const basedir = getBaseDistDir();

async function getVisited(params: RequestParameters): Promise<ReceivedJson> {
  const req = await axios.post(`${baseUrl}/visited.php`, stringify(params));
  if (req.status / 100 !== 2) exit();
  const data: ReceivedJson = req.data as unknown as ReceivedJson;
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
  outputFileSync(`${basedir}/index.html`, compiled);
  outputFileSync(`${basedir}/${fileTime}.html`, compiled);
}

async function main() {
  try {
    const credential: RequestParameters = {
      v: '2.59',
      ...loadSecret(),
    };

    const visited = (await getVisited(credential)).visit;
    generatePage(visited);
  } catch (e) {
    console.error(e);
    exit();
  }
}

main();
