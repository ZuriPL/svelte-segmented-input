<script>
    import { onMount } from "svelte/internal";
    import { createEventDispatcher } from 'svelte' 

    export let length
    let els = []
    let values = []
    export let value = ''
    export let style = {}

    const dispatch = createEventDispatcher()

    let varNames = Object.keys(style)
    let styleProvider

    onMount(() => {
        // apply all styles from the styles prop
        for (let i = 0; i < varNames.length; i++) {
            styleProvider.style.setProperty(`--${varNames[i]}`, style[varNames[i]]);
        }

        // remove all empty ids from the inputs made by for loop in template
        [...document.querySelectorAll('#input-wrapper input')].forEach(el => {
            if (el.getAttribute('id') === '') el.removeAttribute('id')
        })
    })
    
    $: {
        (() => {
            if (values.length != getTotalLength() || values.includes(null)) return value = ''
            value = values.join('')
            dispatch('valueEntered', {value})
        })()
    }

    function handleMoveAndBackspace(e) {
        let targetIndex = +e.target.getAttribute('index')

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault()
                els[min((getTotalLength() - 1), targetIndex + 1)].focus()
                break
            case 'ArrowLeft':
                e.preventDefault()
                els[max(0, targetIndex - 1)].focus()
                break
            case 'Backspace':
                e.preventDefault()

                // if curent cell is empty we want to backspace the previous cell
                if (!values[targetIndex] && values[targetIndex] != 0) { 
                    els[max(0, targetIndex - 1)].focus()
                    values[targetIndex - 1] = null
                } else {
                    values[targetIndex] = null
                }
                break
        }
    }
    
    function handleKey(e) {
        if (Number.isNaN(+e.key)) return
        values[e.target.getAttribute('index')] = +e.key
        els[min((getTotalLength() - 1), +e.target.getAttribute('index') + 1)].focus()
    }
    
    function handlePaste(e) {
        if (Number.isNaN(+e.clipboardData.getData('text'))) return 
        waterfall({target: e.target, arr: e.clipboardData.getData('text')})
    }

    function waterfall(data) {
        let [first, ...rest] = data.arr
        values[data.target.getAttribute('index')] = +first
        els[min((getTotalLength() - 1), +data.target.getAttribute('index') + 1)].focus()
        if (data.target.getAttribute('index') == getTotalLength() - 1 || rest.length === 0) return
        waterfall({target: els[+data.target.getAttribute('index') + 1], arr: rest })
    }

    function range(length) {
        let arr = []

        for (let i = 0; i < length; i++) {
            arr.push(i)
        }

        return arr
    }

    function min(a, b) {
        if (a < b) return a
        return b
    }

    function max(a, b) {
        if (a > b) return a
        return b
    }

    function getTotalLength(idx = length.length) {
		if (!Array.isArray(length)) length = [ length ]
        return length.slice(0, idx ?? 1).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    }
</script>


<section id="input-wrapper" bind:this="{styleProvider}">
    {#if Array.isArray(length)}
        {#each length as part, idx}
            {#if idx != 0}
                <span>-</span>
            {/if}
            {#each range(part) as index}
                <input id="{index == 0 ? 'first-input' : ''}" type="number" on:keydown="{handleMoveAndBackspace}" on:keypress|preventDefault="{handleKey}" on:paste|preventDefault="{handlePaste}" bind:this="{els[index + getTotalLength(idx)]}" bind:value="{values[index + getTotalLength(idx)]}" index="{index + getTotalLength(idx)}">
            {/each}
        {/each}
    {:else}
        {#each range(length) as index}
            <input id="{index == 0 ? 'first-input' : ''}" type="number" on:keydown="{handleMoveAndBackspace}" on:keypress|preventDefault="{handleKey}" on:paste|preventDefault="{handlePaste}" bind:this="{els[index]}" bind:value="{values[index]}" index="{index}">
        {/each}
    {/if}
</section>

<style>
    /* removes up and down arrows from inputs */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type=number] {
        -moz-appearance: textfield; 
    }

    /* STYLING */
    input {
        font-size: var(--fontSize, 2rem);
        border-radius: var(--borderRadius, 0.4rem);
        border: var(--borderWidth, 2px) solid var(--borderColor, #e5e5e5);
        color: var(--textColor, black);
        outline: none;
        padding: var(--padding, 0.25rem 1rem);
        box-sizing: content-box;
        width: 1ch;
        background-color: var(--bgInput, transparent);
    }
    input:focus {
        border: var(--borderWidth, 2px) solid var(--borderColorActive, #5f91f0);
    }
    span {
        font-weight: bold;
    }
    #input-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: var(--inputWidth, 100%);
        background-color: var(--bgWrapper, transparent);
    }
</style>
