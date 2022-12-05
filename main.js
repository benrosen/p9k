#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "fs";
import meow from "meow";
import { basename, join } from "path";

const help = `Usage
  $ p9k <input>

Options
  --constant    -c	Constant
  --function    -f	Function
  --interface   -i	Interface
  --module      -m 	Module
  --package     -p	Package
  --repository  -r	Repository
  --script      -s	Script
  --type        -t	Type`;

const { input, flags } = meow(help, {
  importMeta: import.meta,
  flags: {
    constant: {
      type: "boolean",
      alias: "c",
    },
    function: {
      type: "boolean",
      alias: "f",
    },
    interface: {
      type: "boolean",
      alias: "i",
    },
    module: {
      type: "boolean",
      alias: "m",
    },
    package: {
      type: "boolean",
      alias: "p",
    },
    repository: {
      type: "boolean",
      alias: "r",
    },
    script: {
      type: "boolean",
      alias: "s",
    },
    type: {
      type: "boolean",
      alias: "t",
    },
  },
});

if (
  input.length === 0 &&
  Object.values(flags).every((flag) => flag === false)
) {
  console.log(help);
}

const userInput = input[0];

const directory = userInput ? join(process.cwd(), userInput) : process.cwd();

const directoryName = basename(directory);

const screamingSnakeCaseDirectoryName = directoryName
  .replace("-", "_")
  .toUpperCase();

const camelCaseDirectoryName = directoryName
  .split("-")
  .map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : word[0].toUpperCase() + word.slice(1).toLowerCase()
  )
  .join("");

const pascalCaseDirectoryName =
  camelCaseDirectoryName[0].toUpperCase() + camelCaseDirectoryName.slice(1);

if (!existsSync(directory)) {
  mkdirSync(directory);
}

if (flags.constant) {
  writeFileSync(
    join(directory, directoryName + ".constant.ts"),
    `// TODO define and constrain the ${screamingSnakeCaseDirectoryName} constant
export const ${screamingSnakeCaseDirectoryName}: unknown = undefined;`
  );
}

if (flags.function) {
  writeFileSync(
    join(directory, directoryName + ".function.ts"),
    `
// TODO implement the ${camelCaseDirectoryName} function
export const ${camelCaseDirectoryName} = () => {
  //
};`
  );

  writeFileSync(
    join(directory, directoryName + ".function.test.ts"),
    `import {${camelCaseDirectoryName}} from "./${directoryName}.function"

// TODO test the ${camelCaseDirectoryName} function
describe("The ${camelCaseDirectoryName} function", () => {
  it.todo("should be tested");
});`
  );
}

if (flags.interface) {
  writeFileSync(
    join(directory, directoryName + ".interface.ts"),
    `// TODO define the ${pascalCaseDirectoryName} interface
export interface ${pascalCaseDirectoryName} {};`
  );

  writeFileSync(
    join(directory, directoryName + ".interface.guard.ts"),
    `// TODO implement the ${pascalCaseDirectoryName} interface guard
export const is${pascalCaseDirectoryName}(value: unknown): value is ${pascalCaseDirectoryName} => {
  throw new Error("not implemented");
};`
  );

  writeFileSync(
    join(directory, directoryName + ".interface.guard.test.ts"),
    `import {is${pascalCaseDirectoryName}} from "./is-${directoryName}.interface.guard";

const validExamples: ${pascalCaseDirectoryName}[] = [];

const invalidExamples: unknown[] = [];

describe("The is${pascalCaseDirectoryName} interface guard function", () => {
  describe("should return \`true\`", () => {
    test.each(validExamples)("when the given value, \`%j\`, implements the ${pascalCaseDirectoryName} interface", (validExample) => {
      const result = is${pascalCaseDirectoryName}(validExample);

      expect(result).toStrictEqual(true);
    })
  });

  describe("should return \`false\`", () => {
    test.each(invalidExamples)("when the given value, \`%j\`, does NOT implement the ${pascalCaseDirectoryName} interface", (invalidExample) => {
      const result = is${pascalCaseDirectoryName}(invalidExamples);

      expect(result).toStrictEqual(false);
    })
  });
});`
  );
}

if (flags.module) {
  writeFileSync(
    join(directory, "index.ts"),
    [
      flags.constant
        ? `export {${screamingSnakeCaseDirectoryName}} from "./${directoryName}.constant";`
        : undefined,
      flags.function
        ? `export {${camelCaseDirectoryName}} from "./${directoryName}.function"`
        : undefined,
      flags.interface
        ? `export {${pascalCaseDirectoryName}} from "./${directoryName}.interface";
export {is-${directoryName}} from "./${directoryName}.interface.guard";`
        : undefined,
      flags.type
        ? `export {${pascalCaseDirectoryName}} from "./${directoryName}.type";
export {is-${directoryName}} from "./${directoryName}.type.guard";`
        : undefined,
    ]
      .filter((element) => element !== undefined)
      .join("\n")
  );
}

if (flags.package) {
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: directoryName,
        version: "1.0.0",
        ...(flags.script
          ? {
              main: "main.ts",
              bin: {
                [directoryName]: "main.ts",
              },
            }
          : {}),
      },
      undefined,
      2
    )
  );
}

if (flags.repository) {
  writeFileSync(
    join(directory, ".gitignore"),
    `node_modules
.idea`
  );
}

if (flags.script) {
  writeFileSync(
    join(directory, "main.ts"),
    `#!/usr/bin/env node

${
  flags.function
    ? `import {${camelCaseDirectoryName}} from "./${directoryName}.function";

${camelCaseDirectoryName}();`
    : `(async () => {
  //
})()`
}`
  );
}

if (flags.type) {
  writeFileSync(
    join(directory, directoryName + ".type.ts"),
    `// TODO define ${pascalCaseDirectoryName} type
export type ${pascalCaseDirectoryName} = unknown;`
  );

  writeFileSync(
    join(directory, directoryName + ".type.guard.ts"),
    `// TODO implement ${pascalCaseDirectoryName} type guard
export const is${pascalCaseDirectoryName}(value: unknown): value is ${pascalCaseDirectoryName} => {
  throw new Error("not implemented");
};`
  );

  writeFileSync(
    join(directory, directoryName + ".type.guard.test.ts"),
    `import {is${pascalCaseDirectoryName}} from "./is-${directoryName}.type.guard";

const validExamples: ${pascalCaseDirectoryName}[] = [];

const invalidExamples: unknown[] = [];

describe("The is${pascalCaseDirectoryName} type guard function", () => {
  describe("should return \`true\`", () => {
    test.each(validExamples)("when the given value, \`%j\`, is a valid instance of the ${pascalCaseDirectoryName} type", (validExample) => {
      const result = is${pascalCaseDirectoryName}(validExample);

      expect(result).toStrictEqual(true);
    })
  });

  describe("should return \`false\`", () => {
    test.each(invalidExamples)("when the given value, \`%j\`, is NOT a valid instance of the ${pascalCaseDirectoryName} type", (invalidExample) => {
      const result = is${pascalCaseDirectoryName}(invalidExamples);

      expect(result).toStrictEqual(false);
    })
  });
});`
  );
}
