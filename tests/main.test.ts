import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodepath from 'path';
import convert, { InputArgs } from '../';

async function t(obj: object, args: InputArgs, file: string) {
  // The compiled file is in "src/dist_tests" folder.
  const expectedFile = nodepath.join(__dirname, '../tests/data', `${file}.go`);
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.strictEqual(convert(obj, args), expected);
}

it('Basic', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    { packageName: 'test', typeName: 'Test', disableDefaultHeader: true },
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
    {
      packageName: 'test',
      typeName: 'Test',
      parseFunc: true,
      disableDefaultHeader: true,
    },
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
      disableDefaultHeader: true,
    },
    'header',
  );
});

it('injectValues', async () => {
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
      variableName: 'Var',
      disableDefaultHeader: true,
    },
    'injectValues',
  );
});

it('Default header', async () => {
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
    'defaultHeader',
  );
});

it('No JSON tag', async () => {
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
      disableDefaultHeader: true,
      hideJSONTags: true,
    },
    'noJSONTag',
  );
});

it('Basic without formatting', async () => {
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
      disableDefaultHeader: true,
      disablePropertyFormatting: true,
    },
    'basicWithoutFormatting',
  );
});
