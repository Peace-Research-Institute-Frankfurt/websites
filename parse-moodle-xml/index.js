const { XMLParser } = require('fast-xml-parser')
const fs = require('fs')
const luxon = require('luxon')

function sanitise(s) {
  return s
    .toString()
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/(\r\n|\n|\r)/g, '')
    .trim()
}

function renderQuestion(question) {
  if (question['@_type'] === 'cloze') {
    return ''
  } else {
    return `**${sanitise(question.questiontext.text)}**\n`
  }
}

function renderClozeText(s) {
  return sanitise(s).replace(/(\{\d:([A-Z]+):=?.+?\})+/g, (match, p1, p2) => {
    if (p2 === 'SHORTANSWER') {
      return `[**${sanitise(match)
        .replace(/\{\d:(SHORTANSWER:=)/, '')
        .replace(/\}/, '')
        .split('~=')
        .join('; ')}**]`
    } else if (p2 === 'MULTICHOICE') {
      return `[Multiple choice: ${sanitise(match)
        .replace(/\{\d:(MULTICHOICE:)/, '')
        .replace(/\}/, '')
        .replace(/#OK|#Wrong/g, '')
        .split('~')
        .map((choice) => {
          if (choice.includes('=')) {
            return `${choice.replace('=', '')} **(Correct)**`
          }
          return choice
        })
        .join('; ')}]`
    }
  })
}

function renderQuestionType(s) {
  const dictionary = {
    multichoice: 'Multiple Choice',
    truefalse: 'True/False',
    matching: 'Matching',
    cloze: 'Fill in the blanks',
    ddwtos: 'Drag words into text',
    shortanswer: 'Short Answer',
  }

  return dictionary[s] ? dictionary[s] : s
}

function renderAnswers(question) {
  if (question['@_type'] === 'multichoice') {
    return question.answer
      .map((a, j) => {
        const points = parseFloat(a['@_fraction'])
        return `${j + 1}. ${sanitise(a.text)} **(${points > 0 ? 'Correct' : 'False'})**`
      })
      .join('\n')
  } else if (question['@_type'] === 'truefalse') {
    return question.answer
      .filter((a) => {
        const points = parseFloat(a['@_fraction'])
        return points > 0
      })
      .map((a) => {
        return `Answer: **${a.text}**`
      })
      .join('\n')
  } else if (question['@_type'] === 'matching') {
    return question.subquestion
      .map((sq) => {
        return `- ${sq.text.length > 0 ? `${sanitise(sq.text)}` : ''}(${sq.answer.text})`
      })
      .join('\n')
  } else if (question['@_type'] === 'cloze') {
    let text = null
    let hint = null
    const tokens = question.questiontext.text.match(/(?:<div class="clozebox">)(?<hint>(?:.|\n)+)(?:<\/div>)(?<text>(?:.|\n)+)/)

    if (tokens) {
      hint = sanitise(tokens.groups.hint)
      text = sanitise(tokens.groups.text)
    } else {
      text = question.questiontext.text
      hint = sanitise(question?.hint?.text || '')
    }
    return `${renderClozeText(text)}${hint && `\nHint: ${hint}`}`
  } else if (question['@_type'] === 'numerical') {
    return `Answer: ${question.answer.text} (Tolerance: ${question.answer.tolerance})`
  } else if (question['@_type'] === 'shortanswer') {
    if (Array.isArray(question.answer)) {
      return `\nAnswer: **${question.answer[0].text}**`
    } else {
      return `\nAnswer: **${question.answer.text}**`
    }
  } else if (question['@_type'] === 'ddwtos') {
    return question.dragbox
      .map((el, i) => {
        return `${i}. ${el.text} (Group ${el.group})`
      })
      .join('\n')
  }
  console.log(question)
  throw Error(`Unkown question type: ${question['@_type']}`)
}

function processFiles(files, outputDirectory) {
  const parser = new XMLParser({
    ignoreAttributes: false,
  })

  for (let i = 0; i < inputFiles.length; i++) {
    const inputFile = inputFiles[i]
    const xmlData = fs.readFileSync(inputFile)

    const exportedOn = inputFile.match(/(?<date>\d+-\d+)(?:.xml$)/)
    const exportedOnDate = luxon.DateTime.fromFormat(exportedOn.groups.date, 'yyyyMMdd-hhmm')

    const data = parser.parse(xmlData)
    const category = data.quiz.question.find((q) => {
      return q?.category
    })

    const questions = data.quiz.question
      .filter((q) => {
        return !q.category
      })
      .map((q, i) => {
        return `### Question ${i + 1} (${renderQuestionType(q['@_type'])})
${renderQuestion(q)}${renderAnswers(q)}
`
      })

    const categoryTitle = category ? category.category.text.replace('$cat1$/top/', '') : null
    const output = `# EUNPDC eLearning
${categoryTitle ? `## Certificate questions for ${categoryTitle}` : null}
Exported: ${exportedOnDate.toLocaleString(luxon.DateTime.DATETIME_MED)}

${questions.join('\n')}`

    const outputFilename = `${outputDirectory}/questions-${categoryTitle.toLowerCase()}.md`
    fs.writeFileSync(outputFilename, output)
    console.log(`Wrote ${questions.length} questions to ${outputFilename}`)
  }
}

const inputDirectory = './data'
const inputFiles = fs.readdirSync(inputDirectory).map((filename) => `${inputDirectory}/${filename}`)

const outputDirectory = './output'

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory)
}

processFiles(inputFiles, outputDirectory)
