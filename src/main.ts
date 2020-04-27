import * as camelcase from 'camelcase';

export interface InputArgs {
  packageName: string;
  typeName: string;
  parseFunc?: boolean;
  header?: string;
}

interface PropData {
  prop: string;
  type: string;
}

function goType(value: unknown): string {
  if (typeof value === 'string') {
    return 'string';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float64';
  }
  throw new Error(`Unsupported type of value ${value}`);
}

export default function gen(obj: object, args: InputArgs): string {
  let code = args.header ? args.header + '\n' : '';
  code += `package ${args.packageName}\n\n`;

  if (args.parseFunc === true) {
    code += `import (
\t"encoding/json"
\t"io/ioutil"
)

`;
  }

  code += `// ${args.typeName} ...\n`;
  code += `type ${args.typeName} struct {\n`;

  let maxPropLen = 0;
  let maxTypeLen = 0;
  const sortedProps: PropData[] = [];
  for (const prop of Object.keys(obj).sort()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (obj as any)[prop];
    const propData: PropData = {
      prop,
      type: goType(value),
    };
    maxPropLen = Math.max(maxPropLen, prop.length);
    maxTypeLen = Math.max(maxTypeLen, propData.type.length);
    sortedProps.push(propData);
  }

  for (const propData of sortedProps) {
    const propName = camelcase(propData.prop, { pascalCase: true });
    code += `\t${propName.padEnd(maxPropLen, ' ')} ${propData.type.padEnd(
      maxTypeLen,
      ' ',
    )} \`json:"${propData.prop}"\`\n`;
  }

  code += `}\n`;

  if (args.parseFunc === true) {
    code += '\n';
    const parseFuncName = `Parse${args.typeName}`;
    code += `// ${parseFuncName} reads a ${args.typeName} from a JSON file.
func ${parseFuncName}(file string) (*${args.typeName}, error) {
\tbytes, err := ioutil.ReadFile(file)
\tif err != nil {
\t\treturn nil, err
\t}

\tvar data ${args.typeName}
\terr = json.Unmarshal(bytes, &data)
\tif err != nil {
\t\treturn nil, err
\t}
\treturn &data, nil
}
`;
  }

  return code;
}
