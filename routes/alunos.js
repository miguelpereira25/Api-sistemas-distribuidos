const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Aluno = require('../models/user');

const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - nome
 *         - sobrenome
 *       properties:
 *         id:
 *           type: string
 *           description: gera automaticamente o id do aluno
 *         nome:
 *           type: string
 *           description: nome do aluno
 *         sobrenome:
 *           type: string
 *           description: sobrenome do aluno
 *       example:
 *         id: d5fE_asz
 *         nome: Tiago
 *         sobrenome: Santos
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Alunos
  *   description: alunos API
  */

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: mostra a lista de alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 */

router.get("/", (req, res) => {
	const alunos = req.app.db.get("alunos");

	res.send(alunos);
});

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Encontrar aluno por id
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: aluno id
 *     responses:
 *       200:
 *         description: descricao do aluno por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Nao foi encontrado o aluno
 */

router.get("/:id", (req, res) => {
  const aluno = req.app.db.get("alunos").find({ id: req.params.id }).value();

  if(!aluno){
    res.sendStatus(404)
  }

	res.send(aluno);
});

/**
 @swagger
 * /alunos:
 *   post:
 *     summary: adicinar aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       500:
 *         description: server erro
 */

router.post("/", (req, res) => {
	/*try {
		const aluno = {
			id: nanoid(idLength),
			...req.body,
		};
		console.log("cheguei aqui")
		aluno.save()
		.then(item =>{
			res.send("item sent to database");

		})
		.catch(err=>{
			res.status(400).send("unable to send");
		});
		
    req.app.db.get("alunos").push(aluno).write();
    
    res.send(aluno)
	} catch (error) {
		return res.status(500).send(error);
	}*/

	//console.log(req.app.db);
	try {
		const aluno = new Aluno(req.body)
		aluno.save()
		req.app.db.get("alunos").push(aluno).write();
		res.send(aluno);
		console.log("Novo aluno criado");
		
	} catch (error) {
		return res.status(500).send(error);
	}
	
});




/**
 * @swagger
 * /alunos/{id}:
 *  put:
 *    summary: actualizar aluno
 *    tags: [Alunos]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Aluno id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Aluno'
 *    responses:
 *      200:
 *        description: Aluno actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Aluno'
 *      404:
 *        description: Aluno nao encontrado
 *      500:
 *        description: Erro
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("alunos")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("alunos").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: apagar aluno pelo id
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: aluno id
 * 
 *     responses:
 *       200:
 *         description: aluno apagado
 *       404:
 *         description: aluno nao encontrado
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("alunos").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;



