import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const home = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home/main.html'));
};

export const login = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login/login.html'));
};

export const signin = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/signin/signin.html"));
};

export const detailedInquiry = (req,res) => {
    res.sendFile(path.join(__dirname, "../views/community/detailedInquiry.html"));
};

export const edit = (req,res) => {
    res.sendFile(path.join(__dirname, "../views/community/edit.html"));
};

export const wrtie = (req,res) => {
    res.sendFile(path.join(__dirname, "../views/community/write.html"));
};

export const profile = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/user/profile.html"));
};

export const passwordEdit = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/user/passwordEdit.html"));
};