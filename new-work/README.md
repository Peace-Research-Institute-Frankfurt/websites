# New Work

## Project structure

As an editor, everything you need to work on this site is inside the `/content` folder (though feel free to look around the rest of the project). The `/content` folder contains the following subdirectories:

### `/authors`

This is where we keep all information related to learning unit authors. Each author is represented by an `mdx` file that looks like this:

```yaml
---
name: Federica Dall'Arche
author_id: federica-dall-arche
role: Senior Researcher
institution: Istituto Affari Internazionali I.A.I
image: './assets/Federica-DallArche.jpg'
image_alt: ''
---
Federica Dall’Arche is a policy advisor to the Italian Presidency of the Council of Ministers and a researcher at the \[International Affairs Institute\](https://www.iai.it/en) ...
```

#### Parameters

- `name` **(Required)**
- `author_id` **(Required)**: This is a unique string that's used to refer to authors in other places.
- `institution`: Organisation or company the author is affiliated with
- `image`: Path for the author's profile image. The file has to be stored in `/content/authos/assets/`
- `image_alt`: Alternative text for the author's profile image

### `/data`

This is where we keep information we want to reference across learning units, like glossary definitions and image licenses. Each type of data is represented by a `.json` file.

### `/posts`

This is where we keep the chapter content. We keep each chapter in a numbered sub-folder, like this: `/posts/lu-18`. Inside that folder you’ll find a file called `index.mdx` with information about the unit in general and a series of further `.mdx` files for the individual chapters.

#### `index.mdx`

```yaml
---
order: 18
title: The United Nations Disarmament Machinery
intro: The unit introduction goes here.
hero_image: ./assets/knotted-gun.jpg
hero_alt: Sculpture of revolver with a knot in the barrel
hero_credit: 'Gerhard Huber / CC-BY-NC 4.0'
color: '#123456'
authors:
  - federica-dall-arche
  - sonia-drobysz
---
```

- Authors: List of one or more `author_id`s defined in `/content/authors/`.

## Components

When you write posts you can embed different components to make things more interesting. If a component you need isn't available, we'll consider building it for you.

### Figure

Display an image. Both raster images (JPG, PNG) and vector images (SVG) are supported.

```jsx
<Figure
  size="medium"
  src="ban-is-coming.jpg"
  caption="Campaigners dressed as nuclear bombs express confidence that a treaty banning nuclear weapons is on its way."
  credit="International Campaign to Abolish Nuclear Weapons / Tim Wright"
  license="cc-by-2"
  alt=""
></Figure>
```

#### Parameters

- `size` **(Required):** How big should the image appear in the layout? Possible values are `medium`, `large`, and `huge`.
- `src` **(Required)**: The name of an image in the learning unit’s `assets` folder
- `alt` **(Required)**: Short, visual description of the image.
- `caption` (Optional)
- `credit` (Optional)
- `license` (Optional): Must be a `license_id` defined in `/content/data/licenses.json`

### Quote

Display a quotation.

```jsx
<Quote
  type="document"
  fullDocument="https://en.wikisource.org/wiki/The_Chance_for_Peace"
  cite='Dwight D. Eisenhower, "Chance for Peace", speech to American Society of Newspaper Editors.'
>
  [...] **Every gun that is made, every warship launched, every rocket fired signifies, in the final sense, a theft from those who hunger and are not
  fed, those who are cold and are not clothed.** This world in arms is not spending money alone. **It is spending the sweat of its laborers, the
  genius of its scientists, the hopes of its children.**
</Quote>
```

#### Parameters

- `type` (Optional). Possible values are `document` and `default`.
- `audio` (Optional): Must be a valid `.mp3` file.
- `fullDocument` (Optional)
- `cite` (Optional)

### Details

Display a collapsible section of arbitrary markdown content.

```jsx
<Details summary="Biological weapons and materials">
  - 1925 Protocol for the Prohibition of Asphyxiating, Poisonous or Other Gases, and of Bacteriological Methods of Warfare - 1972 Convention on the
  prohibition of the development, production and stockpiling of bacteriological (biological) and toxin weapons and on their destruction (BWC)
</Details>
```

#### Parameters

- `summary` **(Required)**: Text to show when the section is collapsed

Wrap multiple `<Details>` components in a `<DetailsGroup>` component to display them as a coherent unit:

```jsx
<DetailsGroup>
  <Details summary="...">...</Details>
  <Details summary="...">...</Details>
</DetailsGroup>
```

### File

Display a downloadable file.

```jsx
<File file="lounge.jpg" title="Presentation.pdf" />
```

#### Parameters

- `file` (Required): Name of a file in the `/assets` folder.
- `title` (Optional): Title to be displayed to the user. If none is supplied, the filename is used.
