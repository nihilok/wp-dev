/**
 * Scaffold command implementation
 * Creates a new headless WordPress project from template
 */

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function scaffold(options) {
  console.log(chalk.blue.bold('\n🚀 WP-Dev Scaffolding Tool\n'))

  // Prompt for missing options
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: options.name || 'my-wp-project',
      when: !options.name,
    },
    {
      type: 'input',
      name: 'dir',
      message: 'Target directory:',
      default: options.dir || './my-wp-project',
      when: !options.dir,
    },
    {
      type: 'confirm',
      name: 'includePython',
      message: 'Include Python middleware?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeWordPress',
      message: 'Include WordPress Docker setup?',
      default: true,
    },
  ])

  const config = { ...options, ...answers }
  const spinner = ora('Creating project structure...').start()

  try {
    const targetDir = path.resolve(config.dir || config.name)
    
    // Create project directory
    await fs.ensureDir(targetDir)
    
    spinner.text = 'Setting up Next.js frontend...'
    // Copy frontend template
    await copyTemplate('frontend', path.join(targetDir, 'frontend'))
    
    if (config.includePython) {
      spinner.text = 'Setting up Python middleware...'
      await copyTemplate('backend', path.join(targetDir, 'backend'))
    }
    
    spinner.text = 'Setting up component library...'
    await copyTemplate('components', path.join(targetDir, 'components'))
    
    if (config.includeWordPress) {
      spinner.text = 'Setting up WordPress configuration...'
      await copyTemplate('wordpress', path.join(targetDir, 'wordpress'))
    }
    
    spinner.text = 'Creating configuration files...'
    await createConfigFiles(targetDir, config)
    
    spinner.succeed(chalk.green('Project created successfully!'))
    
    console.log(chalk.blue('\n📝 Next steps:\n'))
    console.log(chalk.white(`  cd ${config.name}`))
    console.log(chalk.white('  bun install'))
    console.log(chalk.white('  docker-compose up -d'))
    console.log(chalk.white('  bun run dev\n'))
    
  } catch (error) {
    spinner.fail(chalk.red('Error creating project'))
    console.error(error)
    process.exit(1)
  }
}

async function copyTemplate(template, target) {
  const templatePath = path.join(__dirname, '..', '..', template)
  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, target)
  }
}

async function createConfigFiles(targetDir, config) {
  // Create README
  const readme = `# ${config.name}

Headless WordPress project with Next.js, Python middleware, and React components.

## Getting Started

1. Install dependencies:
   \`\`\`
   bun install
   \`\`\`

2. Start services:
   \`\`\`
   docker-compose up -d
   \`\`\`

3. Start development:
   \`\`\`
   bun run dev
   \`\`\`

## Services

- Frontend: http://localhost:3000
- Python API: http://localhost:8000
- WordPress: http://localhost:8080

## Documentation

See /docs for detailed documentation.
`
  await fs.writeFile(path.join(targetDir, 'README.md'), readme)
}
