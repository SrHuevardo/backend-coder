import { Command } from 'commander';

const program = new Command()

program
.option('-d, --debug', 'output extra debugging', false)
.option('-p <port>', 'specify port', '8080')
.option('--mode <mode>', 'specify mode', 'development')
.requiredOption('-u, --username <username>', 'specify username', 'admin')

program.parse();

console.log('Options:', program.opts());
console.log('Remaining arguments:', program.args);