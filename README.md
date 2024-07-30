# vue-transformer

`vue-transformer` is a utility to transform Vue components written using the Options API to the Composition API. This tool aims to facilitate the transition to Vue 3's Composition API by automating the transformation process for various component options such as `data`, `methods`, `computed`, lifecycle hooks, and more.

## Installation

First, clone the repository and navigate to its directory:

```sh
git clonehttps://github.com/mpiniarski/vue-options-to-compostion.git 
cd vue-options-to-composition
```

Install the dependencies:

```sh
npm install
```

## Usage

The `vue-transformer` tool can be run from the command line. Provide the path to the source file you want to transform and an optional destination path for the transformed file.

```sh
npm start path/to/sourceFile.vue [path/to/destinationFile.vue]
```

For example:

```sh
npm start src/components/MyComponent.vue dist/components/MyComponent-composition.vue
```

## Contributing

Feel free to open an issue or submit a pull request if you encounter any problems or have suggestions for improvements.

### Scripts

The following scripts are available in the `package.json` file:

- `build`: Compiles the TypeScript code to JavaScript using `tsc`.
- `start`: Runs the transformation script using `ts-node`.
- `test`: Runs the test suite using Jest.
- `pbcopy`: Copies project files to a clipboard using a custom script.


---
