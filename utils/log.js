const chalk = require('chalk');

chalk.enabled = true;

const DASHES = `\n------------------------------------------------\n`;

const LOG_TYPES = {
	note: chalk.green('Notice: \n'),
	auth: chalk.cyan('Authorization: \n'),
	warn: chalk.yellow('Warning: \n'),
	error: chalk.red('Error: \n'),
};

exports = module.exports = Object.keys(LOG_TYPES)
	.reduce((logTypes, type) => {
		logTypes[type] = (...messages) => {
			let warning;
			const LAST_MSG_INDEX = messages.length - 1;
			if (LAST_MSG_INDEX !== 0 && typeof messages[LAST_MSG_INDEX] === 'string') {
				warning = chalk.red(messages[LAST_MSG_INDEX]);
				messages.splice(LAST_MSG_INDEX);
			}

			let output = '';
			output += DASHES;
			output += LOG_TYPES[type];
			output += messages.join('\n');
			output += warning || '';
			output += DASHES;

			console.log(output);
		};
		return logTypes;
	}, {});
