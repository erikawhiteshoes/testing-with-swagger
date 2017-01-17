const generateDocs = require("./docs");
/**
 * This endpoint documents itself and everything else!
 *
 * @swagger
 * /swagger.json:
 *   get:
 *     tags: [ Documentation ]
 *     summary: Get the Swagger.js documentation for the API (you're reading it)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */

module.exports = (app) => {

	const docs = generateDocs();

	const swaggerPath = {
		path: "/swagger.json",
		name: "swagger API descriptor"
	};

	app.get(swaggerPath, function(req, res) {
		res.send(200, docs);
	});
};
