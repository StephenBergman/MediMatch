# SectionHeading

`SectionHeading` is a reusable component for displaying a section title, optional notes, and a divider. It is used in the UI testing suite of the Overwatch-Connect project.

## Props

| Name  | Type              | Required | Description                    |
| ----- | ----------------- | -------- | ------------------------------ |
| id    | `string`          | Yes      | The unique id for the heading. |
| title | `string`          | Yes      | The section title text.        |
| notes | `React.ReactNode` | No       | Optional notes or description. |

## Usage

Import and use `SectionHeading` in your test screens or component documentation:

```tsx
import SectionHeading from './components/ui-testing/components/SectionHeading';

<SectionHeading id="example-section" title="Example Section" notes="This is an optional note." />;
```

## Implementation

SectionHeading uses the following UI components:

- `Heading` for the section title
- `Text` for optional notes
- `Divider` for visual separation
