const fs = require('fs');
const jsonfile = require('jsonfile');
const file = 'categories.json';
const templateFile = 'template.html';

function template(oldString, lookFor, replacement) {
    let str = "\\*\\{" + lookFor + "\\}";
    let term = new RegExp(str, 'g');
    return oldString.replace(term, replacement);
}

function replace(htmlString, data) {
    let allFigures = '';
    data.figures.forEach((figure, i) => {
        let index = i+1;
        let figuresString = `
        <figure>
            <figcaption>
                <p>${figure.title}</p>
                <p>${figure.subtitle}</p>
            </figcaption>
            <picture>
                <source type="image/webp" srcset="assets/categories/*{name}/${index}.webp">
                <img src="assets/categories/*{name}/${index}.jpg" alt="${figure.title}">
            </picture>
        </figure>`
        allFigures += figuresString;
    })
    htmlString = template(htmlString, 'figures', allFigures);
    let list = "";
    data.list.forEach((main) => {
        let sub = main.sub.reduce((acc, cur) => {
            return acc + `
                \t\t\t<li><p>${cur}</p></li>`
        }, "")
        list += `
        \t\t<li>${main.label}
            \t\t\t<ul class="sub-list">${sub}
            \t\t\t</ul>
        \t\t</li>`;
    })
    htmlString = template(htmlString, 'list', list);
    htmlString = template(htmlString, 'name', data.name);
    htmlString = template(htmlString, 'label', data.label);
    return htmlString;
}

function readTemplate() {
    let html = fs.readFileSync(templateFile);
    return String(html);
}

function generate(data) {
    data.forEach((category, i) => {
        let htmlString = readTemplate();
        let newString = replace(htmlString, category);
        console.log(newString);
        fs.writeFileSync(category.url, newString);
    })
}

jsonfile.readFile(file, function (err, data) {
  if (err) console.error(err)
  generate(data);
})