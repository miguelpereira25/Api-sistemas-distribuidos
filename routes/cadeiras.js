const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Cadeira:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: gera automaticamente o id da cadeira
 *         nome:
 *           type: string
 *           description: nome da cadeira
 *       example:
 *         id: lhitn
 *         nome: Algebra
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Cadeiras
  *   description: cadeira API
  */

/**
 * @swagger
 * /cadeiras:
 *   get:
 *     summary: mostra a lista de cadeiras
 *     tags: [Cadeiras]
 *     responses:
 *       200:
 *         description: lista de cadeiras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cadeira'
 */

router.get("/", (req, res) => {
	const cadeiras = req.app.db.get("cadeiras");

	res.send(cadeiras);
});

/**
 * @swagger
 * /cadeiras/{id}:
 *   get:
 *     summary: Encontrar cadeira por id
 *     tags: [Cadeiras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: cadeira id
 *     responses:
 *       200:
 *         description: descricao da cadeira por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cadeira'
 *       404:
 *         description: Nao foi encontrado a cadeira
 */

router.get("/:id", (req, res) => {
  const cadeira = req.app.db.get("cadeiras").find({ id: req.params.id }).value();

  if(!cadeira){
    res.sendStatus(404)
  }

	res.send(cadeira);
});

/**
 * @swagger
 * /cadeiras:
 *   post:
 *     summary: adicionar cadeira
 *     tags: [Cadeiras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cadeira'
 *     responses:
 *       200:
 *         description: cadeira criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cadeira'
 *       500:
 *         description: server erro
 */

router.post("/", (req, res) => {
	try {
		const cadeira = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("cadeiras").push(cadeira).write();
    
    res.send(cadeira)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /cadeiras/{id}:
 *  put:
 *    summary: actualizar cadeira
 *    tags: [Cadeiras]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: cadeira id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Cadeira'
 *    responses:
 *      200:
 *        description: cadeira actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Cadeira'
 *      404:
 *        description: cadeira nao encontrado
 *      500:
 *        description: Erro
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("cadeiras")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("cadeiras").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /cadeiras/{id}:
 *   delete:
 *     summary: apagar cadeira pelo id
 *     tags: [Cadeiras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: cadeira id
 * 
 *     responses:
 *       200:
 *         description: cadeira apagado
 *       404:
 *         description: cadeira nao encontrado
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("cadeiras").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;
