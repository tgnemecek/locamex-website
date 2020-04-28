const Jimp = require('jimp');
const resizeOptimizeImages = require('resize-optimize-images');
const glob = require('glob');
const webp = require('webp-converter');

function getAllImages() {
	return new Promise((resolve, reject) => {
		glob("build/test/**/*.jpg", {}, function (err, images) {
			if (err) reject(err);
			if (images) {
				console.log(images);
				resolve(images);
			}
		})
	})
}

async function resizeToWidths(images, widths, callback) {
	try {
		for (let width of widths) {
			// await resizeOptimizeImages({width, images, quality: 90});
			for (let image of images) {
				let output = image.replace(/(.+\/)(.+)(\.\w+)/, `$1$2-${width}$3`);
				console.log(output);
				await Jimp.read(image).then((file) => {
					console.log(222);
					file
					  .resize(width, Jimp.AUTO) // resize
					  .quality(90) // set JPEG quality
					  .write(output); // save
				}).catch((err) => { throw err });
			}
		}
	}
	catch(err) {
		callback(err);
	}
	callback(null, images);
}

async function convertToWebp(images) {
	console.log(333);
	for (let image of images) {
		let output = image.replace(/\.\w+$/, ".webp");
		webp.cwebp(image, output, "-q 80", (status, err) => {
			if (err) throw err;
			if (status == '100') {
				console.log("Conversion Complete");
			} else {
				console.log("Conversion Failed");
			}
		});
	}
}

getAllImages().then((images) => {
	resizeToWidths(images, [100, 200, 300], (err, res) => {
		if (err) throw err;
		if (res) {
			getAllImages().then((images) => {
				convertToWebp(images);
			})
		}
	});
})