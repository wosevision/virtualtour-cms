const fs = require('fs');

exports.addCustomAdminStyles = function () {
	// Load UI template file
	const buffer = fs.readFileSync('node_modules/keystone/admin/server/templates/index.html');
	const content = buffer.toString();
	const styleLink = '<link rel="stylesheet" href="/styles/admin.css">';
	// If already links to our stylesheet we have nothing else to do
	if (!content.includes(styleLink)) {
		// Add link to our stylesheet at the end of <head>
		const newContent = content.replace('</head>', `${styleLink} \n </head>`);
		fs.writeFileSync('node_modules/keystone/admin/server/templates/index.html', newContent);
	}
};
