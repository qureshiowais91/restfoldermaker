# restfoldermaker

`restfoldermaker` is a command-line tool to quickly scaffold an MVC folder structure for your Node.js project.

## Installation

```bash
npm install -g restfoldermaker
```

## Usage

```bash
npx restfoldermaker
```

This command will create the following folder structure in the current working directory:

- `controllers/`
- `models/`
- `routes/`
- `middleware/`
- `config/`
- `services/`
- `validators/`
- `app.js`
- `server.js`
- `package.json`
- `.env`

## Local Development

```bash
# Link the package locally
npm link

# Run the tool
npx restfoldermaker
```

## License

This project is licensed under the [ISC License](LICENSE).

Feel free to use and modify this tool according to your project's needs!

```



# restfoldermaker

`restfoldermaker` is a command-line tool to scaffold project folder structures. Stay tuned for upcoming features:

## New Features in Future Versions

1. Folder Structures:
   - GraphQL: Ideal for projects using GraphQL.
   - React: Support for React project structures.
   - Vue.js: Tailored folder structure for Vue.js projects.

2. CRUD Examples:
   - Sample files for CRUD operations in models, routes, and controllers.

3. Error Handling Boilerplate:
   - Standardized error handling mechanisms and response formats.

4. Command-Line Options:
   - Choose project structures and features via command-line options.
     ```bash
     npx restfoldermaker --graphql
     npx restfoldermaker --react
     npx restfoldermaker --crud
     ```

5. Interactive Mode:
   - Customize project structure interactively based on user preferences.

How to Use

For now, install the tool globally and run:

```bash
npx restfoldermaker
