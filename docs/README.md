# Getting Started Guide 💡

This guide is designed to help you quickly understand the concepts of Sakura Script.

Since you're already here, you should know that you need to have Visual Studio Code installed on your PC.

Download the Sakura Script extension from [here](https://github.com/QuetzalcoutlDev/sakura-script/releases/).

Install the extension by going to the "Extensions" menu, clicking on the ellipsis (...), and selecting "Install from VSIX" 

Or you can download the extension from the Visual Studio Code Marketplace.

- For GDevelop:
    - You must install the Sakura Dialog System extension in your project [download it here](https://github.com/QuetzalcoutlDev/SakuraDialogSystemGD/releases/)
    - You can read the Sakura Dialog System documentation for GDevelop by clicking [here](https://github.com/QuetzalcoutlDev/SakuraDialogSystemGD/tree/master/docs)

You can read examples [here](https://github.com/QuetzalcoutlDev/sakura-script/blob/master/examples).

---

## Creating a Dialogue

Once you have everything ready, it's time to learn how to write a dialogue.

```js
label Start:
    "Hello world!"
```

Each dialogue is written within a branch that must begin with the special name "label." A branch is simply a container for your story.

After "label," a name follows. "Start" can be the starting label, but it doesn't have to be "Start"—you can use any name you want, but always avoid repeating names.

```js
label Start:
    [Nami] "Hello world!"
```

Here we add [Nami]. In SakuraScript, the brackets [], contain the name of the speaking character, useful for making it clear who is speaking.

If the brackets [], are not used, then it will be assumed that no one is speaking. You can use this for the narrator or the protagonist's internal thoughts.

The dialogues can be as many as you want, but they must always be enclosed in quotation marks.

> [!NOTE]
> Every line of dialogue is written within a block, in this case "label," which must contain four spaces at the beginning.
> Pressing the TAB key once allows you to do this.

## Commands

Commands are actions that must be performed immediately after or before a line of dialogue.

For example, showing a character or switching to another scene.

```js
label Start:
    [Nami] "Hello world!"
    // Commands start with $
    $ show_nami()
```

You can create your own and add as many parameters as you need.

```js
label Start:
    [Nami] "Hello world!"
    $ show_nami(100, 0.5, "linear")
```

By default, there are currently only 3 commands: end, jump, and set_variable.

See [command examples](https://github.com/QuetzalcoutlDev/sakura-script/blob/master/examples/commands.sksy)

## Conditionals

Conditionals are simply special blocks that allow you to display dialogs if a condition is met (redundancy intended).

Variables are used for these conditions; variables are simply containers for data that can change (numbers, text, etc.).

```js
label Start:
    [Nami] "Hello!"
    [Nami] "How many apples are on this table?"
    // Conditional blocks always begin with if
    // We will look for a variable called apples
    if apples == 20:
        [Nami] "Wow, there are 20 apples"
    [Nami] "I want 3 apples."
```

If the variable apples is 20, then the dialog inside the block will be displayed.

> [!NOTE]
> Conditional statements currently only accept a fixed name; that is, it cannot be fruits.apples or fruits[0].
> It must be a single variable without children, and there must always be a == or any other comparison operator after the variable name.

Comparing variables with each other:
```js
label Start:
    [Nami] "Hello!"
    // You can also compare two variables
    if Test == Test_2:
        "..."
```

## Options

Options are simply paths that add interaction and less linearity to your story.

```js
label Start:
    [Nami] "Hello!"
    [Nami] "What should I eat now?"
    // Options are created using the special word "option"
    option:
        // All options are enclosed in quotation marks, but they differ from dialogue because they have a colon at the end.
        "Ramen":
            "Delicious ramen, how nice!"
        "Sandwich":
            "A simple but delicious sandwich!"
    [Nami] "Yummy~"

```

> [!NOTE]
> You can use conditional blocks (if-elif-else) inside option blocks and vice versa.

---

# Final Details

That's it! You should now know how to use the basics of Sakura Script. This language will grow little by little, but you can still use it.

## How do I use Sakura Script in GDevelop?

Simple, follow the first steps, but there's a problem.

The .sksy format cannot be read by GDevelop.

So you have to do this:

From your .sksy script in VS Code, right-click and the option "Export script to JSON" will appear.
![export](/img/export.png)

When you click, a window will appear where you can choose to export the script's JSON.

You can save it in your GDevelop project's assets folder, making it easier to use.