/** @type {import('lint-staged').Config} */
module.exports = {
  // type check typescript files
  '**/*.ts': () => 'yarn tsc --noEmit',
  // lint & prettify ts and js files
  '**/*.(ts|js)': (filenames) => [
    `yarn eslint --fix ${filenames.join(' ')} --cache`,
    `yarn prettier --write ${filenames.join(' ')} --cache`,
  ],
  // prettify only markdown and json files
  '**/*.(md|json)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')} --cache`,
}
