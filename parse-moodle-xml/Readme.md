# Moodle Quiz XML Parser

Quick tool to parse quiz questions export from moodle in the [Moodle XML format](https://docs.moodle.org/403/en/Moodle_XML_format) and render them to human-readable text files for editing. Inspired by [moodlexml.fly.dev](https://moodlexml.fly.dev/converter/quiz).

## Usage

1. `git clone` the monorepo
2. `cd` into the `parse-moodle-xml` directory
3. Run `npm install`
4. [Export quiz questions](https://nonproliferation-elearning.eu/question/bank/exportquestions/export.php) one unit at a time, ensuring `File Format: Moodle XML` and `Write category to file` are selected and place the files in the `/data` folder.
5. Run `node .`
