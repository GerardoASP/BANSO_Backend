const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const { transporter } = require("../config/emailService");
//registro de un usuario nuevo en el sistema
const register = async (req, res) => {
    const { 
            firstname, 
            lastname, 
            email:email, 
            password, 
            country, 
            department, 
            municipality, 
            document_type, 
            document,
            rol,
            user_career
        } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es requerido "});
    if (!password) return res.status(400).send({ msg: "La contraseña es requerida "});
    if (!document) return res.status(400).send({ msg: "El documento es requerida "});

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //const hashPassword = await bcrypt.hash(password,salt);
    const generateRandomCode = () => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const verifyCode = generateRandomCode();
    const user = new User({
        firstname,
        lastname,
        country,
        department,
        municipality,
        document_type,
        document,
        email: email.toLowerCase(),
        password: hashPassword,
        rol,
        active: false,
        user_career,
        verifyCode
    });

    try {
        const userStorage = await user.save();
        res.status(201).send(userStorage);
        let mailOptions = {
            from: process.env.EMAIL_MAILER,
            to: email,
            subject: 'Welcome to Our Website BANSO',
            html: `
        <p style="font-size: 16px; color: #333; text-align: center;">
            <b>Thank you for registering with us. We are glad to have you as part of our community.</b>
        </p>
        <p style="font-size: 16px; color: #333; text-align: center;">
            <img src="" alt="Welcome Image" style="max-width: 100%; height: auto;">
        </p>
        <p style="font-size: 16px; color: #333; text-align: center;">
            <a href="http://localhost:3002/verify-component" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">
                Verify Your Account
            </a>
        </p>
    `,
        };
        // Send the email
       transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario", error: error.message || "Error desconocido" });
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!password) {
            throw new Error("la contraseña es obligatoria");
        }
        if(!email){
            throw new Error("El email es obligatorio");
        }
        const emailLowerCase = email.toLowerCase();
        const userStore = await User.findOne({ email: emailLowerCase }).exec();
        if (!userStore){
            throw new Error("El usuario no existe");
        }
        const check = await bcrypt.compare(password, userStore.password);
        if (!check){
            throw new Error("Contraseña incorrecta");
        }
        if (!userStore.active){
            throw new Error("Usuario no autorizado o no activo");
        }
        res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
            verifyCodeI: userStore.verifyCode,
        })
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
};

async function refreshAccessToken(req, res){
    const {token} = req.body;
    if (!token){
        return res.status(401).send({ msg: "Token requerido"});
    }
    try {
        const { user_id} = jwt.decoded(token);
        const userStorage = await User.findOne({_id: user_id});
        if (!userStorage) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }
        const accessToken = jwt.createAccessToken(userStorage);
        return res.status(200).send({ accessToken });
    } catch (error) {
        console.error("Error del servidor: ", error);
        return res.status(500).send({ msg: "Error del servidor "});
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken
};