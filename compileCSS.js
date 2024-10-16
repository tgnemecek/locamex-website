const sass = require('sass');
const fs = require('fs')

const OUTPUT_DIR = "./build/styles"
const INPUT_DIR = `${OUTPUT_DIR}/sass`

const files = ["category", "critical", "index"]

files.forEach(file => {
  const {css} = sass.compile(`${INPUT_DIR}/${file}.scss`, {style: "compressed"});

  const outputFile = `${OUTPUT_DIR}/${file}.css`


  fs.writeFileSync(outputFile, css, {encoding: "utf-8"})

  console.info(`Wrote to ${outputFile}`)
});

