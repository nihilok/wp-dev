/**
 * Component generation command
 * Generates React components with WordPress patterns
 */

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'

const COMPONENT_TEMPLATES = {
  post: `/**
 * {{NAME}} Component
 * WordPress post pattern component
 * 
 * Escape Hatch: Use WordPress when:
 * - Need advanced custom fields (ACF)
 * - Require WordPress-specific post types
 * - Using WordPress taxonomies
 */
import React from 'react'

export interface {{NAME}}Props {
  // Add your props here
}

export const {{NAME}}: React.FC<{{NAME}}Props> = (props) => {
  return (
    <div className="{{kebab-name}}">
      {/* Component content */}
    </div>
  )
}
`,
  page: `/**
 * {{NAME}} Component
 * WordPress page pattern component
 * 
 * Escape Hatch: Use WordPress when:
 * - Need page templates from WordPress
 * - Require page hierarchy
 * - Using WordPress page builders
 */
import React from 'react'

export interface {{NAME}}Props {
  // Add your props here
}

export const {{NAME}}: React.FC<{{NAME}}Props> = (props) => {
  return (
    <div className="{{kebab-name}}">
      {/* Component content */}
    </div>
  )
}
`,
  block: `/**
 * {{NAME}} Component
 * WordPress block pattern component
 * 
 * Escape Hatch: Use WordPress blocks when:
 * - Need Gutenberg block editor integration
 * - Require WordPress block patterns
 * - Using WordPress block themes
 */
import React from 'react'

export interface {{NAME}}Props {
  // Add your props here
}

export const {{NAME}}: React.FC<{{NAME}}Props> = (props) => {
  return (
    <div className="{{kebab-name}}">
      {/* Component content */}
    </div>
  )
}
`,
  custom: `/**
 * {{NAME}} Component
 * Custom React component
 */
import React from 'react'

export interface {{NAME}}Props {
  // Add your props here
}

export const {{NAME}}: React.FC<{{NAME}}Props> = (props) => {
  return (
    <div className="{{kebab-name}}">
      {/* Component content */}
    </div>
  )
}
`,
}

export async function component(options) {
  console.log(chalk.blue.bold('\n📦 Component Generator\n'))

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Component name (PascalCase):',
      when: !options.name,
      validate: (input) => {
        if (!input) return 'Component name is required'
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Component name must be in PascalCase'
        }
        return true
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'Component type:',
      choices: [
        { name: 'Post Component (WordPress post pattern)', value: 'post' },
        { name: 'Page Component (WordPress page pattern)', value: 'page' },
        { name: 'Block Component (WordPress block pattern)', value: 'block' },
        { name: 'Custom Component', value: 'custom' },
      ],
      when: !options.type,
    },
  ])

  const config = { ...options, ...answers }
  const componentName = config.name
  const componentType = config.type
  // Convert PascalCase to kebab-case (handles consecutive capitals correctly)
  const kebabName = componentName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase()

  const spinner = ora('Generating component...').start()

  try {
    // Determine target directory
    const componentDir = path.resolve('./components')
    await fs.ensureDir(componentDir)

    // Generate component file
    const fileName = `${componentName}.tsx`
    const filePath = path.join(componentDir, fileName)

    if (await fs.pathExists(filePath)) {
      spinner.warn(chalk.yellow(`Component ${componentName} already exists`))
      return
    }

    let template = COMPONENT_TEMPLATES[componentType] || COMPONENT_TEMPLATES.custom
    template = template.replace(/{{NAME}}/g, componentName)
    template = template.replace(/{{kebab-name}}/g, kebabName)

    await fs.writeFile(filePath, template)

    // Update index.ts
    const indexPath = path.join(componentDir, 'index.ts')
    let indexContent = ''
    
    if (await fs.pathExists(indexPath)) {
      indexContent = await fs.readFile(indexPath, 'utf-8')
    }

    const exportLine = `export { ${componentName} } from './${componentName}'\nexport type { ${componentName}Props } from './${componentName}'\n`
    
    if (!indexContent.includes(componentName)) {
      await fs.appendFile(indexPath, '\n' + exportLine)
    }

    spinner.succeed(chalk.green(`Component ${componentName} created successfully!`))
    console.log(chalk.blue(`\n📄 File: ${filePath}\n`))

  } catch (error) {
    spinner.fail(chalk.red('Error generating component'))
    console.error(error)
    process.exit(1)
  }
}
