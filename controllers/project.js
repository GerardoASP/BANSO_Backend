const express = require('express');
const modelProject = require('../models/project');
const modelUser = require('../models/user');


/* CRUD*/

/*Crear un usuario */
const createProject = async (req, res)=>{
    try{
        const {nameProject,stateProject,dateStart,descriptionProject,projectUsers,projectSubjects} = req.body;
        // console.log(req.body);
        const newProject = new modelProject({nameProject,stateProject,dateStart,descriptionProject,projectUsers,projectSubjects});
        // console.log(newPost);
        const savedProject = await newProject.save();
        // res.status(201).json({message: "Post created"});
        res.status(201).json(savedProject);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

/*Listar todos los proyectos */
const getProjects = async (req, res)=>{
    try{
        const projects = await modelProject.find();
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/*Obtener un proyecto en especifico */
const getProject = async (req, res) => {
  const id = req.params.id;

  try {
      const project = await modelProject.findById(id);
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
 
/*Actualizar un proyecto */
const updateProject = async (req,res)=>{
  const { id } = req.params;
  const { nameProject,stateProject,dateStart,descriptionProject,projectUsers,projectSubjects } = req.body;
  try {
    const project = await modelProject.findByIdAndUpdate(id, { nameProject,stateProject,dateStart,descriptionProject,projectUsers,projectSubjects }, { new: true });
    res.status(200).send(project);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

/*Eliminar un usuario en especifico */
const removeProject = async(req, res)=>{
  try{
      const {id} = req.params;
      const projectDelete = await modelProject.findByIdAndDelete(id)
      if(projectDelete === null) {
          return res.status(404).json({message: "Project not found"});
      }
      res.status(204).json();
  }catch(error){
      res.status(400).json({message: error.message});
  }
}

//Metodos Adicionales
//Agregar un usuario a un proyecto
const addUser = async(req,res)=>{
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
    project.projectUsers.push(userId);

    // Guardar el proyecto actualizado en la base de datos
    const updatedProject = await project.save();
 
    // Devolver el proyecto actualizado como respuesta
    res.status(200).json(updatedProject);
  }catch(error){
    res.status(400).json({message: error.message});
  }
}

// Listar los usuarios de un proyecto
const getUsersOfProject = async (req, res) => {
  try {
      // Obtenemos el ID del proyecto de los parámetros de la solicitud
      const { id } = req.params;

      // Buscamos el proyecto en la base de datos utilizando su ID
      const project = await modelProject.findById(id);

      // Verificamos si el proyecto existe
      if (!project) {
          return res.status(404).json({ message: "Project not found" });
      }

      // Obtenemos los IDs de los usuarios asociados al proyecto
      const userIds = project.projectUsers;

      // Buscamos los usuarios en la base de datos utilizando sus IDs
      const users = await modelUser.find({ _id: { $in: userIds } });

      // Retornamos la lista de usuarios asociados al proyecto
      res.status(200).json(users);
  } catch (error) {
      // Manejamos errores
      res.status(500).json({ message: error.message });
  }
}

//Adicional al crud
//Listar todos los proyectos que tengan un cierto tema
const getProjectsBySubject = async (req,res) =>{
  try{
    const {subject} = req.params;

    //Verificar si se proporciona un tema en los parámetros de la URL
    if(!subject){
      return res.status(400).json({message:'Por favor, proporciona un tema valido'})
    }

    //Busca los productos que coincidan con el tema
    const projects = await modelProject.find({projectSubjects:subject});

    //Verifica si se encontraron productos
    if(projects.length === 0){
      return res.status(404).json({message:'No se encontraron proyectos para el tema proporcionado'});
    }

    //Devuelve los proyectos encontrados
    res.status(200).json(projects);
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProject,
  getProjects,
  updateProject,
  removeProject,
  getProject,
  addUser,
  getUsersOfProject,
  getProjectsBySubject
}