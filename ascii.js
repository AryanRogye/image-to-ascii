const sharp = require('sharp');

class Ascii {
    
    constructor() {
        console.log("Ascii constructor");
    }

    async getMetaData(path) {
        const { data, info } = await sharp(path)
            .resize(48 , 48)
            .raw()
            .toBuffer({ resolveWithObject: true });
            
        // Getting image width because need to know num of pixels in a row
        // Getting image height because need to know num of pixels in a column
        const { width, height, channels } = info;
            
        if (channels !== 3) {
            throw new Error('Image must be RGB');
        }
            
        let rgbOfImage = [];

        for(let y = 0; y < height; y++) {
            //when reached here need to clear rbgOfLine array
            let rgbOfLine = [];
            for(let x = 0; x < width; x++) {
                let rgbOfPixel = [];
                // need to store each rbgOfPixel Array in a rgbOfLine Array

                const idx = (width * y + x) * channels;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                    
                rgbOfPixel.push(r, g, b);
                rgbOfLine.push(rgbOfPixel);
            }
            rgbOfImage.push(rgbOfLine);
        } 
        return rgbOfImage;
    }

    async convertToAscii(path) {
        // Need to convert rgbOfImage to ascii
        let rgbOfImage = await this.getMetaData(path);
        console.log(rgbOfImage);
        let asciiOfImage = [];

        let asciiSymbols = ".:-=+*#%@"; 
        //the 1st index represents 255 and the last index represents 0
        //need to split 255 divided by the length of asciiSymbols

        let asciiSymbolsLength = asciiSymbols.length;
        let interval = Math.ceil(255 / asciiSymbolsLength);
        console.log('interval', interval);

        let asciiOfPicture = [];
    

        for(let i = 0; i < rgbOfImage.length; i++) {
            let lineLength = rgbOfImage[i].length;
            let asciiOfLine = [];
            for(let j = 0; j < lineLength; j++) {

                

                let r = rgbOfImage[i][j][0];
                let g = rgbOfImage[i][j][1];
                let b = rgbOfImage[i][j][2];
                let avg = (r + g + b) / 3;
                let start = 255;

                let charIndex = Math.floor((avg / 255) * (asciiSymbolsLength - 1));
                asciiOfLine.push(asciiSymbols[charIndex]);            
            }
            asciiOfPicture.push(asciiOfLine);
        }
        for(let i = 0; i < asciiOfPicture.length; i++) {
            console.log(asciiOfPicture[i].join(''));
        }

    }
}

function main() {
    var ascii = new Ascii();
    ascii.convertToAscii('pikachu.jpg');
}

main();
