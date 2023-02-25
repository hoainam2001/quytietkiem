import { NextFunction, Response } from 'express';
import { Error as ErrorLog } from './logger';
import { createTransport } from 'nodemailer';
import Jimp from 'jimp';
import fs from 'fs';

const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASS_EMAIL}`
    }
});

const errCode1 = async (next: NextFunction, error: Error) => {
    const err = new ErrorLog(500, error.message);
    next(err);
};

const errCode2 = async (next: NextFunction, message: string) => {
    const err = new ErrorLog(304, message);
    next(err);
};

const dataCode = async (res: Response, data: any) => {
    return res
        .status(200)
        .json({ code: 0, message: 'Successfully', data: data });
};

const successCode = async (res: Response, message: string) => {
    return res.status(200).json({ code: 0, message: message });
};

const saltBcrypt = 10;

const precisionRound = (number: number) => {
    const precision = 10;
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

const mail = (email: string, message: string, subject: string) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: message
    };
    const p = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            }
            resolve({ code: 0, message: 'Send Mail successfully' });
        });
    });

    return p;
};

const restoreImageFromBase64 = async (
    imageBase64: string,
    fileName: string,
    where: string
) => {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(imageBase64, 'base64');
        Jimp.read(buffer, (err, image) => {
            if (err) console.log(err);
            image
                .quality(100)
                .writeAsync(`./uploads/${where}/${fileName}`)
                .then(() => {
                    resolve({ code: 0, message: 'Restore image successfully' });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Upload file failed in file = ${fileName} .${err.message}`
                    })
                );
        });
    });
};

const rename_file = (oldPath: string, newPath: string) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err)
                reject({
                    code: 1,
                    message: `Failed for upload image. ${err.message}`
                });
            resolve({
                code: 0,
                message: 'Upload image successfully'
            });
        });
    });
};

const formatUSD = (number: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
        // notation: 'compact', // compact, short, long - rút gọn
        // compactDisplay: 'short'  ,
    }).format(number);
};

const formatVND = (number: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number);
};

const generatePassword = async (length: number) => {
    const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

export {
    errCode1,
    errCode2,
    dataCode,
    successCode,
    saltBcrypt,
    precisionRound,
    mail,
    restoreImageFromBase64,
    formatUSD,
    formatVND,
    rename_file,
    generatePassword
};
