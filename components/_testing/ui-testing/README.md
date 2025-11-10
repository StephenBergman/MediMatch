# gluestack-ui Kitchen Sink

This directory contains the Kitchen Sink for testing Gluestack UI components.

## Purpose

- Showcase and test Gluestack UI components in a live environment.
- Serve as a reference for usage patterns, props, and cross-platform compatibility.
- If a component doesn't work as expected out of the box, refer here.

## Usage Standards

- All components should use Gluestack UI primitives as the primary building blocks.
- Ensure all examples are compatible with Expo (native and web).
- Prefer cross-platform code; use platform-specific files only when necessary.
- Use clear, concise code snippets and add comments for non-obvious logic.
- Document any custom logic or workarounds for platform differences.

## `<ComponentSnippet>`

- Used to display examples and notes about a gluestack element.
- Displays VSCode snippet, documentation link, usage example, as well as our findings on notes, warnings, and errors.

## Known Component Issues

#### Solution known:

- `<Header>` `size="4xl"` cuts off characters that go below the baseline (lowercase g, j, p, q, y) on Android.
  - Solution: Don't use `4xl`. Or we can adjust `4xl` definition to be smaller when on affected platforms.

- `<Drawer>` Top content cut off by iOS notch, probably Android as well.
  - Solution: Add padding logic for mobile in the `<Drawer>`, or in gluestack as a preset setting (preferred).

- `<Tooltip>` not supported on mobile, no 'hover' action.
  - Solution: Systematically use 'infoicons' with `<Popover>` onPress functionality for displaying 'more info'

- `<Toast>` covers content behind it, making it unclickable, including `position="bottom"` displaying over the NavBar on mobile.
  - Solution: Don't expect content behind a `<Toast>` to be accessible. `<Toast>`s should be resolved first.

- `<Toast>` can span further than screen bounds if there is too much content within.
  - Solution: Design `<Toast>` content so that it does not overflow.

#### Tested, no solution known:

- `<Slider>` behavior erratic when in `<ScrollView>` on mobile
  - Can we add an `onInteract` event handler to disable scrolling? We did this previously on PUMA, but maybe we can create a universal solution.

- `<Select>` `disabled` items on mobile do not appear differently.

- `<Image>` some external images not rendering on Android. Unknown if loaded assets might behave similarly.
  - https://upload.wikimedia.org/wikipedia/commons/3/3b/Windows_9X_BSOD.png
  - On limited testing, happens only with external .pngs, but not _all_ .pngs

- `<Table>` 2-axis scroll non-functional on Web and Android - can research props/classnames/usage cases
  - We shouldn't need 2 axis scroll on desktop, the content should fit anyways.

#### Untested:

- No known issues currently that are untested.

---

For more information, see the main project README or the Gluestack UI documentation.
