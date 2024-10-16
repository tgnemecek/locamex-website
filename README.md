# Locamex Website

## Instructions

For the homepage, edit the HTML directly.
For the other pages, edit:
-  categories.json to change text content
-  categories.js to change slideshow functionality
-  template.html to change the markup

### Template

The template.html uses custom placeholders with the format *{variable} to be replaced with the corresponding value inside categories.json. After any change in either of these files, run the html-generator.js to create the files (warning: the current files will be replaced).

### CSS

After any changes to a .scss file, run `node compileCSS` and refresh the page to see the changes reflected.

### Images

All image tags are placed inside picture tags that try to load webp versions.
To convert to webp, open bash, navigate to the folder and run:
> for file in *.jpg ; do cwebp -q 80 "$file" -o "${file%.jpg}.webp"; done

## Live Version

<https://www.locamex.com.br>

## License

All rights reserved.