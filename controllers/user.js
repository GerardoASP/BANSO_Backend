const express = require('express');
const modelUser = require('../models/user');
const modelProject = require('../models/project')
const modelPublication = require('../models/publication')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
/* CRUD*/

/*Crear un usuario */
const createUser = async (req, res)=>{
    try{
        const {firstname,lastname,department,municipality,document_type,document,active,avatar,email,password,rol,user_career,userProjects,userPublications} = req.body;
        // console.log(req.body);
        // Generar un hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const generateRandomCode = () => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const verifyCode = generateRandomCode();
        const newUser = new modelUser({firstname,lastname,department,municipality,document_type,document,active,avatar,email,password:hashedPassword,rol,user_career,userProjects,userPublications,verifyCode});
        // console.log(newPost);
        const savedUser = await newUser.save();
        // res.status(201).json({message: "Post created"});
        res.status(201).json(savedUser);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

/*Listar todos los usuarios */
const getUsers = async (req, res)=>{
    try{
        const users = await modelUser.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/*Obtener un usuario en especifico */
const getUser = async (req, res) => {
  const id = req.params.id;

  try {
      const user = await modelUser.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
/*Obtener un usuario en especifico por el email */
const getUserByEmail = async (req, res) => {
  const email = req.params.email;
 
  try {
     const user = await modelUser.findOne({ email: email });
     if (!user) {
         return res.status(404).json({ message: 'User not found' });
     }
     res.status(200).json(user);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
 }
 
/*Actualizar un usuario */
const updateUser = async (req,res)=>{
  const { id } = req.params;
  const { firstname,lastname,department,municipality,document_type,document,active,avatar,email,password,rol,user_career,userProjects,userPublications,verifyCode } = req.body;
  try {
    const user = await modelUser.findByIdAndUpdate(id, { firstname,lastname,department,municipality,document_type,document,active,avatar,email,password,rol,user_career,userProjects,userPublications,verifyCode }, { new: true });
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

/*Eliminar un usuario en especifico */
const removeUser = async(req, res)=>{
  try{
      const {id} = req.params;
      const userDelete = await modelUser.findByIdAndDelete(id)
      if(userDelete === null) {
          return res.status(404).json({message: "User not found"});
      }
      res.status(204).json();
  }catch(error){
      res.status(400).json({message: error.message});
  }
}

//Metodos Adicionales
//Agregar un proyecto a un usuario
const addProject = async(req,res)=>{
  try{
    //Cuerpo del request
    const {projectId, userId} = req.body;

    //Capturar la información de un proyecto a partir de un id dado
    const project = await modelProject.findById(projectId);
    //Capturar la infromación de un usuario a partir de un id dado
    const user = await modelUser.findById(userId);

    //Validar si el proyecto existe
    if(!project){
      return res.status(404).json({message:"Project not found"})
    }
    //Validar si el proyecto existe
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    
    // Agregar el usuario al array de projectUsers
    user.userProjects.push(projectId);

    // Guardar el proyecto actualizado en la base de datos
    const updatedUser = await user.save();
 
    // Devolver el proyecto actualizado como respuesta
    res.status(200).json(updatedUser);
  }catch(error){
    res.status(400).json({message: error.message});
  }
}

// Listar los proyectos de un usuario
const getProjectsOfUser = async (req, res) => {
  try {
      // Obtenemos el ID del usuario de los parámetros de la solicitud
      const { id } = req.params;

      // Buscamos el proyecto en la base de datos utilizando su ID
      const user = await modelUser.findById(id);

      // Verificamos si el usuario existe
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Obtenemos los IDs de los proyectos asociados al usuario
      const projectIds = user.userProjects;

      // Buscamos los proyectos en la base de datos utilizando sus IDs
      const projects = await modelProject.find({ _id: { $in: projectIds } });

      // Retornamos la lista de usuarios asociados al proyecto
      res.status(200).json(projects);
  } catch (error) {
      // Manejamos errores
      res.status(500).json({ message: error.message });
  }
}

const getPublicationsOfUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos el usuario en la base de datos utilizando su ID
    const user = await modelUser.findById(id);

    // Verificamos si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Obtenemos los IDs de los proyectos asociados al usuario
    const publicationIds = user.userPublications.map(id => mongoose.Types.ObjectId(id));
    console.log(publicationIds)

    // Verificamos que haya IDs de publicaciones
    if (!publicationIds || publicationIds.length === 0) {
      return res.status(404).json({ message: "No publications found for this user" });
    }

    // Buscamos los proyectos en la base de datos utilizando los IDs
    const publications = await modelPublication.find({ _id: { $in: publicationIds } });

    console.log("Publications found:", publications);
    // Verificamos si se encontraron publicaciones
    if (!publications || publications.length === 0) {
      return res.status(404).json({ message: "No publications found for the given IDs" });
    }

    // Retornamos las publicaciones encontradas
    res.status(200).json(publications);
  } catch (error) {
    // Manejamos errores
    console.error("Error fetching user publications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*Obtener un usuario en especifico por el codigo de verificacion*/
const getUserByVerifyCode = async (req, res) => {
  const importantCode = req.params.verifyCode;
  try {
    const user = await modelUser.findOne({ verifyCode: importantCode });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  getUsers,
  updateUser,
  removeUser,
  getUser,
  getUserByEmail,
  addProject,
  getProjectsOfUser,
  getUserByVerifyCode,
  getPublicationsOfUser
}
