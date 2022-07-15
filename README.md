# svelte-segmented-input [![svelte-segmented-input](https://img.shields.io/badge/-svelte--segmented--input-orange)](https://github.com/ZuriPL/svelte-segmented-input)

A simple component for number-only segmented input. Ideal for 2FA codes.

**NOTE:** Even though it's at version 1.x, expect bugs and breaking changes up until 2.0.

## HOW TO USE:

```svelte
<script>
    import SvelteSegmentedInput from 'svelte-segmented-input'

    let value

    let callback = (e) => console.log(e)
</script>

<SvelteSegmentedInput bind:value="{value}" length="{6}" style="{{borderColor: 'black', inputWidth: '50%'}}" on:valueEntered="{callback}" />
```

`value` is the current value of the input as a string with spaces in non-populated fields. Setting rhe variable value will change the input value to the given input if it's a number or can be coerced to a number.

`length` is the number of fields. accepts number or an array of numbers. when an array is passed, it will create the segments such as for an array [3, 3, 4] the input will look like this: [] [] [] - [] [] [] - [] [] [] [].

`style` is an object which holds sets custom CSS properties to control the styling of the component.

`on:valueEntered` is an event that fires every time a full value is entered. `event.detail.value` is the value that was entered.

## STYLING:

### input

-   font-size: var(--fontSize, 2rem);
-   border-radius: var(--borderRadius, 0.4rem);
-   border: var(--borderWidth, 2px) solid var(--borderColor, #e5e5e5);
-   padding: var(--padding, 0.25rem 1rem);
-   background-color: var(--bgInput, transparent);

### input:focus

-   border: var(--borderWidth, 2px) solid var(--borderColorActive, #5f91f0);

### input-wrapper

-   width: var(--inputWidth, 100%);
-   background-color: var(--bgWrapper, transparent);
-   gap: var(--gap);
    // if gap is not set or is set to 'auto', it's treated as setting `justify content: space-between;` instead

Alternatively, you can target each item with a descendant selector, as all elements are inside a div with id #input-wrapper.

## KNOWN ISSUES:

1. This solution isn't accessible, as it relies on multiple input elements and breaks a lot of browsers behaviours (i. e. ctrl+f to search). This is a milestone I'm trying to reach with v2.0
2. On mobile phones it is possible to input + and - characters. I have no idea how it happens.
3. Binding the `length` property will break when length is smaller than the number of fields that are populated. Please, don't bind the `length` property.
