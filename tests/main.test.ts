import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodepath from 'path';
import convert, { InputArgs } from '../';

async function t(obj: object, args: InputArgs, file: string) {
  // The compiled file is in "src/dist_tests" folder.
  const expectedFile = nodepath.join(__dirname, '../tests/data', `${file}.go`);
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.equal(convert(obj, args), expected);
}

it('Basic', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    { packageName: 'test', typeName: 'Test' },
    'basic',
  );
});

it('parseFunc', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    { packageName: 'test', typeName: 'Test', parseFunc: true },
    'parseFunc',
  );
});

it('header', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    {
      packageName: 'test',
      typeName: 'Test',
      parseFunc: true,
      header: '/** This is a header. */\n',
    },
    'header',
  );
});
