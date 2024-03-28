const packageJson = require('./package.json')

module.exports = {
  entries: [
    {
      filePath: './src/index.ts',
      outFile: `./dist/${packageJson.name}.d.ts`,
      noCheck: false,
    }
  ]
}
