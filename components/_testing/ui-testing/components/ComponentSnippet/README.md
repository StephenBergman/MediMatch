# ComponentSnippet

`ComponentSnippet` is a flexible component for displaying formatted code snippets, examples, notes, warnings, and errors. It is used for documentation, UI testing, and developer previews in the Medimatch project.

## Props

| Name       | Type              | Required | Description                                 |
| ---------- | ----------------- | -------- | ------------------------------------------- |
| title      | `string`          | Yes      | The title of the component/snippet.         |
| snippet    | `React.ReactNode` | Yes      | The code snippet or shortcut.               |
| badSnippet | `boolean`         | No       | Highlights the snippet as an error if true. |
| example    | `React.ReactNode` | No       | Example usage of the component.             |
| example2   | `React.ReactNode` | No       | Additional example usage.                   |
| notes      | `React.ReactNode` | No       | Informational notes.                        |
| warnings   | `React.ReactNode` | No       | Warning messages.                           |
| errors     | `React.ReactNode` | No       | Error messages.                             |

## Usage

Import and use `ComponentSnippet` in your test screens or component showcases:

```tsx
import ComponentSnippet from "./components/ui-testing/components/ComponentSnippet";

<ComponentSnippet
  title="Button"
  snippet="gs-ButtonBasic-lg"
  example={<Button>Click me</Button>}
  notes="This is a gluestack-ui button."
  warnings="Avoid using on legacy screens."
  errors={null}
/>;
```
