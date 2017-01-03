const chalk = require('chalk');

chalk.enabled = true;

const DASHES = `\n------------------------------------------------\n`;

const LOG_TYPES = {
	note: chalk.green('Notice: \n'),
	auth: chalk.cyan('Authorization: \n'),
	warn: chalk.yellow('Warning: \n')
}

function logFnReducer(logTypes, type) {
	logTypes[type] = function (...messages) {

		let warning;
		const LAST_MSG_INDEX = messages.length - 1;
		if (LAST_MSG_INDEX !== 0) {
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
	}
	return logTypes;
}

exports = module.exports = Object.keys(LOG_TYPES).reduce(logFnReducer, {});
