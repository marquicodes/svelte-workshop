#!/usr/bin/env node

const { spawnSync } = require('child_process')
const { resolve } = require('path')

const [, , exerciseToCopyPath = 'src/exercises/00-Begin'] = process.argv

const CWD = process.cwd()
const WORKSHOP_PATH = resolve(CWD, 'src/workshop')
const EXERCISE_PATH = resolve(CWD, exerciseToCopyPath, 'final')

const COLOR_STYLES = {
  blue: { open: '\u001b[34m', close: '\u001b[39m' },
  dim: { open: '\u001b[2m', close: '\u001b[22m' },
  red: { open: '\u001b[31m', close: '\u001b[39m' },
  green: { open: '\u001b[32m', close: '\u001b[39m' },
}

const color = (modifier, message) => {
  return COLOR_STYLES[modifier].open + message + COLOR_STYLES[modifier].close
}
const blue = (message) => color('blue', message)
const dim = (message) => color('dim', message)
const red = (message) => color('red', message)
const green = (message) => color('green', message)

const logRunStart = (title, subtitle) => {
  console.log(blue(`▶️ Starting: ${title}`))
  console.log(`  ${subtitle}`)
}

const logRunSuccess = (title) => {
  console.log(green(`✅ Success: ${title}\n\n`))
}

const run = (title, subtitle, command) => {
  logRunStart(title, subtitle)
  console.log(dim(`  Running the following command: ${command}`))

  const result = spawnSync(command, { stdio: 'inherit', shell: true })

  if (result.status !== 0) {
    console.error(
      red(
        `🚨  Failure: ${title}. Please review the messages above for information on how to troubleshoot and resolve this issue.`,
      ),
    )
    process.exit(result.status)
  }

  logRunSuccess(title)
}

const main = async () => {
  // Now that the dependencies have been installed we can use `fs-extra`
  const { pathExists, move, copy, readFile, writeFile } = require('fs-extra')

  const WORKSHOP_CREATION_TITLE = 'Workshop Folder Creation'
  const WORKSHOP_CREATION_SUBTITLE = `Creating workshop directory from ${exerciseToCopyPath}.`

  logRunStart(WORKSHOP_CREATION_TITLE, WORKSHOP_CREATION_SUBTITLE)

  // create a backup of the workshop folder if it exists
  if (await pathExists(WORKSHOP_PATH)) {
    const now = Date.now()

    console.log(
      dim(
        `  Workshop folder already exists. Backing up to src/workshop-${now}`,
      ),
    )
    await move(WORKSHOP_PATH, resolve(`${WORKSHOP_PATH}-${now}`))
  }

  await copy(EXERCISE_PATH, WORKSHOP_PATH)

  logRunSuccess(WORKSHOP_CREATION_TITLE)
}

main()
