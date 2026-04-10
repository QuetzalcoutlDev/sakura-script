# Guia de inicio 💡

Está guia está diseñada para entender rapidamente los conceptos de Sakura Script.

Como ya estas aqui, debes saber que necesitas tener instalado Visual Studio Code en tu PC.

Descarga la extensión Sakura Script desde [aca]() o puedes instalarla desde la tienda de extensiones de Visual Studio Code.

- Para GDevelop:
    - Debes instalar la extensión Sakura Dialog System en tu proyecto [descargala aqui]() o puedes instalarla desde la tienda de extensiones de GDevelop
    - Puedes leer la doc de Sakura Dialog System para GDevelop haciendo [clic aca]()

Puedes leer ejemplos desde [aca](https://github.com/QuetzalcoutlDev/sakura-script/blob/master/examples)

---

## Creación de un dialogo

Cuando tengas todo listo, es momento de saber como escribir un dialogo

```js
label Start:
    "Hola mundo!"
```

Cada dialogo se escribe dentro de una rama que debe empezar por el nombre especial "label", una rama no es más que un contenedor de tu historia.

Con label, seguido le sigue un nombre, "Start" puede ser el label de inicio, pero no es necesario que sea "Start", puede ser el que quieras, pero siempre evita no repetir nombres.

```js
label Start:
    [Nami] "Hola mundo!"
```

Aqui agregamos esto [Nami], en Sakura Script, los [], contienen el nombre del personaje hablante, util para dejar claro quien esta hablando.

Si no se coloca [], entonces se tomara como que no hay nadie hablando, puedes usar eso para el narrador o los pensamientos internos del protagonista.

Los dialogos pueden ser todos los que quieras, pero siempre deben estar encerrados en "".


## Comandos

Los comandos son acciones que se deben realizar justo después o antes de una linea de dialogo.

Como mostrar un personaje o cambiar a otra escena.

```js
label Start:
    [Nami] "Hola mundo!"

    // Los comandos empiezan por $
    $ show_nami()
```

Puedes crear los tuyos propios y crear cuantos parametros necesites

```js
label Start:
    [Nami] "Hola mundo!"

    // Los comandos empiezan por $
    $ show_nami(100, 0.5, "linear")
```

Por defecto, existen por ahora solo 3 comandos, end, jump y set_variable()

Vease [ejemplos de comandos](https://github.com/QuetzalcoutlDev/sakura-script/blob/master/examples/commands.sksy)

## Condicionales

Las condicionales no son más que bloques especiales que permiten mostrar dialogos si se cumple una condición (Valga la redundancia).

Se usan variables para dichas condiciones, las variables no son más que contenedores de datos que pueden cambiar (Numeros, textos, etc)

```js
label Start:
    [Nami] "Hola!"
    [Nami] "¿Cuantas manzanas habrá en esta mesa?"
    // Los bloques condicionales siempre empiezan por if
    // Se buscara una variable llamada apples 
    if apples == 20:
        [Nami] "Wow, hay 20 manzanas"
    
    [Nami] "Quiero 3 manzanas."
```

Si la variable apples es 20, entonces se mostrara el dialogo dentro del bloque.

> [!NOTE]
> Las condicionales por ahora solo aceptan un nombre fijo, o sea, no puede ser fruits.apples o fruits[0]
> Debe ser solo una variable sin hijos.
> Y siempre debe haber por ahora un == o cualquier operador, después del nombre de la variable.

Comparación variable con variable

```js
label Start:
    [Nami] "Hola!"

    // También puedes comparar 2 variables entre si
    if Test == Test_2:
        "..."
```

## Opciones

Las opciones no son más que rutas que una forma de dar interración y menos linealidad a tu historia.

```js
label Start:
    [Nami] "Hola!"
    [Nami] "¿Que comere ahora?"
    // Las opciones, se crean usando la palabra especial "option"
    option:
        // Todas las opciones se encierran usando "", pero se diferencian de los dialogos porque llevan 
        // un : al final
        "Ramen":
            "Un delicioso ramen, que bien!"
        "Sandwich":
            "Un sandwich simple, pero delicioso!"

    [Nami] "Que rico~"
```

> [!NOTE]
> Puedes usar bloques condicionales (if-elif-else) dentro de bloques option y viceversa.

---

# Ultimos detalles

Eso es todo, ya debes saber como usar lo basico de Sakura Script, este lenguaje ira creciendo poco a poco, pero se puede usar igualmente.

## Como uso Sakura Script en GDevelop?

Simple, sigue los primeros pasos, pero hay un problema.

El formato .sksy no es posible hacer que GDevelop lo lea.

Por lo que hay que hacer esto.

Desde tu script .sksy en VS Code, haz clic derecho y te aparecerá la opción "Export script to JSON"
![export](/img/export.png)

Al hacer clic, te aparecera una ventana para donde quieras exportar el JSON del script.

En tu carpeta de assets proyecto de GDevelop, puedes guardarlo.