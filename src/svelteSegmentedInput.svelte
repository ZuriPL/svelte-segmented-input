<script>
    export let length
    let els = []
    let values = []
    export let code = 'typing'
    
    $: {
        (() => {
            if (values.length != length || values.includes(null)) return code = 'typing'
            code = 0
            values.forEach((value, index) => {
                code += value * (10 ** (length - index - 1))
            })
            code = code.toString().padStart(length, '0')
        })()
    }

    function handleMoveAndBackspace(e) {
        let targetIndex = +e.target.getAttribute('index')

        switch(e.key) {
            case 'ArrowRight': 
                e.preventDefault()
                els[min((length - 1), targetIndex + 1)].focus()
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
        els[min((length - 1), +e.target.getAttribute('index') + 1)].focus()
    }
    
    function handlePaste(e) {
        if (Number.isNaN(+e.clipboardData.getData('text'))) return 
        waterfall({target: e.target, arr: e.clipboardData.getData('text')})
    }

    function waterfall(data) {
        let [first, ...rest] = data.arr
        values[data.target.getAttribute('index')] = +first
        els[min((length - 1), +data.target.getAttribute('index') + 1)].focus()
        if (data.target.getAttribute('index') == length - 1 || rest.length === 0) return
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
</script>

<section class="input-wrapper">
    {#each range(length) as index}
        <input id="{index == 0 ? 'first-input' : ''}" type="number" on:keydown="{handleMoveAndBackspace}" on:keypress|preventDefault="{handleKey}" on:paste|preventDefault="{handlePaste}" bind:this="{els[index]}" bind:value="{values[index]}" index="{index}">
    {/each}
</section>

<style>
    /* removes up and down arrows from inputs */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /* STYLING */
    input {
        font-size: 2rem;
        border-radius: 0.4rem;
        border: 2px solid #e5e5e5;
        outline: none;
        padding: 0.25rem 1rem;
        box-sizing: content-box;
        width: 1ch;
    }
    input:focus {
        border: 2px solid #5f91f0;
    }
    .input-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
</style>
