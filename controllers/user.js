const express = require('express');
const modelUser = require('../models/user');
const modelProject = require('../models/project')


/* CRUD*/

/*Crear un usuario */
const createUser = async (req, res)=>{
    try{
        const {firstname,lastname,country,department,municipality,document_type,document,active,avatar,email,password,rol,userProjects} = req.body;
        // console.log(req.body);
        const newUser = new modelUser({firstname,lastname,country,department,municipality,document_type,document,active,avatar,email,password,rol,userProjects});
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
  const { firstname,lastname,country,department,municipality,document_type,document,active,avatar,email,password,rol,userProjects } = req.body;
  try {
    const user = await modelUser.findByIdAndUpdate(id, { firstname,lastname,country,department,municipality,document_type,document,active,avatar,email,password,rol,userProjects }, { new: true });
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

module.exports = {
  createUser,
  getUsers,
  updateUser,
  removeUser,
  getUser,
  getUserByEmail,
  addProject,
  getProjectsOfUser
}
