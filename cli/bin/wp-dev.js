#!/usr/bin/env node

/**
 * WP-Dev CLI
 * Command-line tool for scaffolding and deploying headless WordPress projects
 */

import { Command } from 'commander'
import { scaffold } from '../lib/scaffold.js'
import { deploy } from '../lib/deploy.js'
import { component } from '../lib/component.js'

const program = new Command()

program
  .name('wp-dev')
  .description('CLI tooling for headless WordPress with Next.js and Python')
  .version('1.0.0')

// Scaffold command
program
  .command('scaffold')
  .description('Create a new headless WordPress project')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --dir <directory>', 'Target directory')
  .action(scaffold)

// Component generation command
program
  .command('generate:component')
  .alias('g:c')
  .description('Generate a new React component')
  .option('-n, --name <name>', 'Component name')
  .option('-t, --type <type>', 'Component type (post, page, block, custom)')
  .action(component)

// Deploy command
program
  .command('deploy')
  .description('Deploy the application')
  .option('-e, --env <environment>', 'Environment (dev, staging, production)', 'dev')
  .option('--build', 'Build before deploying')
  .action(deploy)

// Dev command
program
  .command('dev')
  .description('Start development environment')
  .action(() => {
    console.log('Starting development environment...')
    console.log('Run: docker-compose up -d')
    console.log('Then: bun run dev (in frontend directory)')
  })

// Status command
program
  .command('status')
  .description('Check status of services')
  .action(() => {
    console.log('Checking service status...')
    console.log('Run: docker-compose ps')
  })

program.parse()
