const express = require('express');
const { bidRoutes, listingRoutes } = require('./routes');

function setupServer(port) {
	const app = express();
	app.use(express.json());
	app.use('/api', bidRoutes, listingRoutes);

	return app;
}

function startServer(port = 3000) {
	const app = setupServer(port);
	return new Promise((resolve, reject) => {
		const server = app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
			resolve(server);
		});
	});
}

module.exports = { startServer };
