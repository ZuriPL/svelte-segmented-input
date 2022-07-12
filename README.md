# svelte-segmented-input

A simple component for number-only segmented input. Ideal for phone numbers or 2FA codes

HOW TO USE:

```
<script>
    import SvelteSegmentedInput from 'svelte-segmented-input'

    let code
</script>

<SvelteSegmentedInput bind:value="{code}" length="{6}" />
```

value is the current value of the input as a string or the string 'typing' if not ebery field is populated

length is the number of fields. accepts number or an array of numbers. when an array is passed, it will create the segments such as for an array [3, 3, 4] the input will look like this: [] [] [] - [] [] [] - [] [] [] []
