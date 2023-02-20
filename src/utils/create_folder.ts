import fs from 'fs';
const DIR_UPLOADS = `./uploads`;
const images = `${DIR_UPLOADS}/images`;
const images_user = `${DIR_UPLOADS}/images_user`;
const files = `${DIR_UPLOADS}/files`;

if (!fs.existsSync(DIR_UPLOADS)) {
    fs.mkdirSync(DIR_UPLOADS);
}

if (!fs.existsSync(images)) {
    fs.mkdirSync(images);
}

if (!fs.existsSync(images_user)) {
    fs.mkdirSync(images_user);
}

if (!fs.existsSync(files)) {
    fs.mkdirSync(files);
}

if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

if (!fs.existsSync('./logs/morgan')) {
    fs.mkdirSync('./logs/morgan');
}
