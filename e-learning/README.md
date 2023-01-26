# E-Learning 2022 Documentation

[![Build and deploy](https://github.com/Peace-Research-Institute-Frankfurt/eunpdc-elearning/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Peace-Research-Institute-Frankfurt/eunpdc-elearning/actions/workflows/deploy.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/be127c78-15e4-457f-8880-078ca5f1128c/deploy-status)](https://app.netlify.com/sites/eunpdc-elearning/deploys)

We publish our learning content with a custom-built system based on [Gatsby](https://www.gatsbyjs.com/).

## Workflow

### How to get set up

You only need to do these steps once, when you start working on our project. If you've never worked in software engineering before, you might want to read a [gentler introduction](https://awesomephant.github.io/untitled-coding-workshop/chapters/tools/) to the process before you move on.

1. Download and install [Node.js](https://nodejs.org/en/), [git,](https://git-scm.com/) and [VS Code](https://code.visualstudio.com/)
2. Sign up for a free [Github](https://github.com/) account using your work email
3. Once you’re invited to [the repository](https://github.com/awesomephant/eunpdc-demo), run `git clone https://github.com/awesomephant/eunpdc-demo.git` to make a local copy of it
4. Open the newly-created folder in VS Code
5. Run `npm install` to download and install dependencies (this might take a few minutes)

### How to make changes

You need to complete these steps each time you sit down to work on the project.

1. Open the project folder in VS Code
2. Run `npm run start` in the built-in command line to start a live preview server at `localhost:8000`.
3. Make your changes
4. Use the command line or the version control panel in VS Code to commit your changes to the repository. Your changes should be automatically deployed in about a 90 seconds.

## Project structure

As an editor, everything you need to work on this site is inside the `/content` folder (though feel free to look around the rest of the project). The `/content` folder contains the following subdirectories:

### `/authors`

This is where we keep all information related to learning unit authors. Each author is represented by an `mdx` file that looks like this:

```yaml
---
name: Federica Dall'Arche
author_id: federica-dall-arche
institution: Istituto Affari Internazionali I.A.I
image: './assets/Federica-DallArche.jpg'
image_alt: ''
---
Federica Dall’Arche is a policy advisor to the Italian Presidency of the Council of Ministers and a researcher at the \[International Affairs Institute\](https://www.iai.it/en) ...
```

#### Parameters

- `name` **(Required)**
- `author_id` **(Required)**
- `institution`
- `image`
- `image_alt`

### `/data`

This is where we keep information we want to reference across learning units, like glossary definitions and image licenses. Each type of data is represented by a `.json` file.

### `/learning-units`

This is where we keep the actual learning unit content. We keep each unit in a sub-folder named after the unit number, like this: `/learning-units/lu-18`. Inside that folder you’ll find a file called `index.mdx` with information about the unit in general and a series of further `.mdx` files for the individual chapters.

#### `index.mdx`

```yaml
---
order: 18
title: The United Nations Disarmament Machinery
short_title: The UN Disarmament Machinery
intro: The unit introduction goes here.
authors:
  - federica-dall-arche
  - sonia-drobysz
hero_image: ./assets/knotted-gun.jpg
hero_alt: Sculpture of revolver with a knot in the barrel
hero_credit: 'Gerhard Huber / CC-BY-NC 4.0'
---
```

- Authors **(Required):** List of one or more `author_id` defined in `/content/authors/`.

#### Chapters

```yaml
---
title: Introduction
intro: Chapter introduction.
order: 1
reading_time: 3
---
The chapter content goes here!
```

## Components

When you write learning units you can embed different components to make things more interesting. We’ll produce more of these over time.

### Lecture Video

TBD

### Detail/Expand

Display a collapsible block containing arbitrary Markdown content.

```jsx
<Details summary="UNSR 1325" open>
  This can be any Markdown content
</Details>
```

Make sure you leave empty lines above and below Markdown content, or it won’t render as expected.

#### Parameters

- `summary` (Required). Text to show when the section is collapsed.
- `open` (Optional). If this prop is set, the details block will be expanded by default.

### Flip Cards

Display a set of flippable cards containing Markdown content.

```jsx
<FlipCards>
  <Card front="This the front of the card.">This is the back of the card.</Card>

  <Card front="This is another card">... and here's the back of that one.</Card>
</FlipCards>
```

Make sure you leave empty lines above and below Markdown content, or it won’t render as expected.

#### Parameters

- `front` (Required). Text to show on the front of the card. Shouldn't be longer than ~25 words.

### Figure

Display an image.

```jsx
<Figure
  size="large"
  src="ban-is-coming.jpg"
  caption="Campaigners dressed as nuclear bombs express confidence that a treaty banning nuclear weapons is on its way."
  credit="International Campaign to Abolish Nuclear Weapons / Tim Wright"
  license="cc-by-2"
  alt=""
></Figure>
```

#### Parameters

- `size` **(Required):** How big should the image appear in the layout? Possible values are `tiny`, `medium`, `large`, and `huge`.
- `src` **(Required)**: The name of an image in the learning unit’s `assets` folder
- `alt` **(Required)**: Short, visual description of the image.
- `caption` (Optional)
- `credit` (Optional)
- `license` (Optional): Must be a `license_id` defined in `/content/data/licenses.json`

### Term

Show an inline definition of a pre-defined term. To edit the definition or to add a new term, edit `/content/data/terms.json`.

```md
This is achieved through a broad spectrum of unilateral, bilateral, and multilateral measures and agreements such as the <Term t="BWC">Biological Weapons Convention</Term>, which is designed to eliminate biological weapons.
```

#### Parameters

- `t` **(Required):** Term to be defined. Must be a `term_id` defined in `/content/data/terms.json`

### Quote

Display a quotation.

```md
<Quote type="document" fullDocument="https://en.wikisource.org/wiki/The_Chance_for_Peace" cite='Dwight D. Eisenhower, "Chance for Peace", speech to American Society of Newspaper Editors.'>
    
[...] **Every gun that is made, every warship launched, every rocket fired signifies, in the final sense, a theft from those who hunger and are not fed, those who are cold and are not clothed.**

This world in arms is not spending money alone. **It is spending the sweat of its laborers, the genius of its scientists, the hopes of its children.**

</Quote>
```

#### Parameters

- `type` (Optional)**.** Possible values are `document` and `default`.
- `audio` (Optional): Must be a valid `.mp3` file.
- `fullDocument` (Optional)
- `cite` (Optional)

### Timeline/Event

Display a simple timeline of chronological events. Each event is represented by an `<Event>`-element containing arbitrary Markdown content.

```jsx
<Timeline>
  <Event date="1675" title="Strasbourg Agreement">
    Signed between France and the Holy Roman Empire following the Siege of Groningen (1672), this treaty was the first international agreement banning
    the use of chemical weapons, specifically poisoned bullets.
  </Event>
  <Event date="1863" title="Lieber Code">
    The Lieber Code (named after its author, the legal scholar Franz Lieber) was a set of instructions issued by Abraham Lincoln to Union soldiers in
    the American Civil War. Among other provisions, it prohibited the use of poison on the battlefield:
  </Event>
</Timeline>
```

#### Event Parameters

- `date` (Optional): When did the event take place? Currently, this is just String that’s not processed in any special way, but that might change in the future.
- `title` (Optional): Title for the event.
- `collapsed` (Optional): Minimize the event description by default. Default: `false`.

### Details

Display a collapsible section of arbitrary markdown content.

```md
<Details summary="Biological weapons and materials" open>

- 1925 Protocol for the Prohibition of Asphyxiating, Poisonous or Other Gases, and of Bacteriological Methods of Warfare
- 1972 Convention on the prohibition of the development, production and stockpiling of bacteriological (biological) and toxin weapons and on their destruction (BWC)

</Details>
```

#### Parameters

- `summary` **(Required)**: Text to appear when the section is collapsed
- `open` (Optional). If this prop is set, the details block will be expanded by default.

Wrap multiple `<Details>` components in a `<DetailsGroup>` component to display them in a coherent unit:

```jsx
<DetailsGroup>
  <Details summary="...">...</Details>
  <Details summary="...">...</Details>
</DetailsGroup>
```

### Tabs

Display an interactive tabs component.

```jsx
<Tabs>
  <Tab title="Biological weapons and materials">Tab content A</Tab>
  <Tab title="Chemical weapons and materials">Tab B</Tab>
  <Tab title="Nuclear and other radioactive material">Tab C</Tab>
</Tabs>
```

#### Tab Parameters

- `title` **(Required)**: Text to appear on the tab controller

### Quiz

Display an interactive quiz inside a learning unit chapter.

```jsx
<Quiz>
  <Question type="MultipleChoice" question="What is the goal of arms control?" hint="Select all that apply.">
    <Choice correct="true" value="World peace" />
    <Choice value="Protection of civilians" />
    <Choice correct="true" value="Limiting the number of weapons" />
    <Choice value="Eliminating all weapons" />
  </Question>
  <Question type="Radio" question="Which instrument is considered the first attempt at arms control in modern history?">
    <RadioChoice correct="true" value="The Strasbourg Agreement" />
    <RadioChoice value="The Geneva Protocol" />
    <RadioChoice correct="true" value="The Lieber Code" />
    <RadioChoice value="The Hague Conference" />
  </Question>
</Quiz>
```

#### Question Parameters

- `type` **(Required):** Possible values are `MultipleChoice` and `Radio`. More might be added in the future.
- `question` **(Required):** Text of the question to be displayed. Should end with a question mark.
- `hint` (Optional)
