const express = require('express');
const modelPublication = require('../models/publication');
const modelUser = require('../models/user');

/* CRUD*/

/*Crear un usuario */
const createPublication = async (req, res)=>{
    try{
        const {title,active,description,datePublication,author,observations,contact} = req.body;
        const newPublication = new modelPublication({title,active,description,datePublication,author,observations,contact});

        const savedPublication = await newPublication.save();

        // Recupera el usuario al que deseas agregar el post
        const user = await modelUser.findById(author);

        // Agrega el ObjectId del nuevo post al array correspondiente
        user.userPublications.push(savedPublication._id);
        
        // Guarda el usuario
        await user.save();
        res.status(201).json({ message: "Publication created", publication: savedPublication });
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

const getPublications = async (req, res)=>{
    try{
        const publications = await modelPublication.find();
        res.status(200).json(publications);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/*Obtener un usuario en especifico */
const getPublication = async (req, res) => {
    const id = req.params.id;
  
    try {
        const publication = await modelPublication.findById(id);
        if (!publication) {
            return res.status(404).json({ message: 'publication not found' });
        }
        res.status(200).json(publication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

const removePublication = async(req, res)=>{
    const publicationId = req.params.id;
    const userId = req.body.userId;
    console.log(publicationId);
    console.log(userId);
    // const {postId, userId} = req.query;
    // console.log("postId", postId);
    // console.log("userId", userId);
    try{
        // Encuentra el usuario al que deseas agregar el post
        const user = await modelUser.findById(userId);
        
        // Elimina el post del array 'posts' del usuario
        user.userPublications.pull(publicationId);
        await user.save();

        const publicationDelete = await modelPublication.findByIdAndDelete(publicationId)
        if(publicationDelete === null) {
            return res.status(404).json({message: "Publication not found"});
        }
        res.status(204).json(publicationDelete);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/*Actualizar un proyecto */
const updatePublication = async (req,res)=>{
    const { id } = req.params;
    const { title,active,description,datePublication,author,observations,contact } = req.body;
    try {
      const publication = await modelProject.findByIdAndUpdate(id, { title,active,description,datePublication,author,observations,contact }, { new: true });
      res.status(200).send(publication);
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
}

module.exports = {
    createPublication,
    getPublications,
    getPublication,
    removePublication,
    updatePublication
}