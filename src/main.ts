import * as camelcase from 'camelcase';

export interface InputArgs {
  packageName: string;
  typeName: string;
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

export default function gen(obj: Object, args: InputArgs): string {
  let code = '';
  code += `package ${args.packageName}\n\n`;
  code += `// ${args.typeName} ...\n`;
  code += `type ${args.typeName} struct {\n`;

  let maxPropLen = 0;
  let maxTypeLen = 0;
  const sortedProps: PropData[] = [];
  for (const prop of Object.keys(obj).sort()) {
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
  return code;
}
