<script>
    import { createEventDispatcher, onMount } from 'svelte' 

    export let length
    export let value = ''
    export let style = {}
    let values = []
    let els = []

    const dispatch = createEventDispatcher()

    let styleProvider
    
    onMount(() => {
        // apply all styles from the styles prop
        let varNames = Object.keys(style)
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
            // number inputs don't tolerate " " (warning in console), 
            // but we need to show a field is empty in the value string

            // clones an array w/o copying the reference
            // this also replaces empty with null
            let normValues = JSON.parse(JSON.stringify(values))
            
            let indices = []
            
            let idx = normValues.indexOf(null)
            while (idx != -1) {
                indices.push(idx)
                idx = normValues.indexOf(null, idx + 1)
            }

            indices.forEach(idx => {
                normValues[idx] = ' '
            })
            
            setValue(normValues.join(''))
            if (normValues.length != getTotalLength() || normValues.includes(' ')) return
            dispatch('valueEntered', {value: getValue()})
        })()
    }

    $: {
        
        value = value.toString().slice(0, getTotalLength())
        if (!Number.isNaN(+value)) {
            let vals = value.toString().split('')
            
            let indices = []
            let idx = vals.indexOf(' ')
            while (idx != -1) {
                indices.push(idx)
                idx = vals.indexOf(' ', idx + 1)
            }
            indices.forEach(idx => {
                vals[idx] = null
            })
            
            setValues(vals)
        }
    }
    
    const setValues = (val) => values = val
    const setValue = (val) => value = val.toString() 
    const getValue = () => value

    function handleMoveAndBackspace(e) {
        let targetIndex = +e.target.getAttribute('index')

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault()
                // focus the next cell
                els[min((getTotalLength() - 1), targetIndex + 1)].focus()
                break
            case 'ArrowLeft':
                e.preventDefault()
                // focus the previous cell
                els[max(0, targetIndex - 1)].focus()
                break
            case 'Backspace':
                e.preventDefault()

                // if curent cell is empty we want to backspace the previous cell
                if (!values[targetIndex] && targetIndex != 0) { 
                    els[max(0, targetIndex - 1)].focus()
                    values[targetIndex - 1] = null
                } else {
                    values[targetIndex] = null
                }

                // remove all trailing empty strings, since we replace them for spaces later and 
                // it can throw off some expectations for end users
                values.reverse()
                while (values[0] === null) {
                    values.splice(0, 1)
                }
                values.reverse()
                break
            case 'Space':
                e.preventDefault()
                break
        }
    }
    
    function handleKey(e) {
        if (Number.isNaN(+e.key) || e.key === ' ') return // validate our input is a number, not sth like an 'e' char
        values[e.target.getAttribute('index')] = +e.key
        els[min((getTotalLength() - 1), +e.target.getAttribute('index') + 1)].focus()
    }
    
    function handlePaste(e) {
        // check if clipboard contains a pure number
        if (Number.isNaN(+e.clipboardData.getData('text'))) return 
        waterfall({target: e.target, text: e.clipboardData.getData('text')})
    }

    function waterfall(data) {
        // separated the first char from the string
        let [first, ...rest] = data.text
        values[data.target.getAttribute('index')] = +first
        els[min((getTotalLength() - 1), +data.target.getAttribute('index') + 1)].focus()
        // return if every field is populated or there's nothing else left to copy
        if (data.target.getAttribute('index') == getTotalLength() - 1 || rest.length === 0) return
        waterfall({target: els[+data.target.getAttribute('index') + 1], text: rest })
    }


    // Helpers:

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

    // gets the sum of every number in the length array
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
<button on:click="{_ => value = 'www'}">Set value</button>


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
