// Importar modulo fs, necesario para leer el archivo
// import fs from 'node:fs';

/**
 * Convertir texto sksy, en un formato JSON
 * @param {String} script Texto a cargar
 */
export function scriptParser(script){

    let content = ""; // Contendra el contenido del .txt

    /*
    try{
        // Cargar el archivo
        //const data = fs.readFileSync(script, "utf-8");
        const data = fs.readFileSync(script, "utf-8");
        //console.log(data);
        content = data; // Guardar los datos del txt
    }
    catch(error){
        // Si no se encuentra el archivo
        console.error("Error al leer el archivo: ", error);

        return {"labels": {}}; // Retornar un JSON vacio
    };¨
    */

    const data = script;
    //console.log(data);
    content = data; // Guardar los datos

    let result_json = {"labels": {}} // El JSON resultante de la conversión

    //////////////// Logica de parseo ////////////////

    if(content != ""){
        // Dividir el contenido del archivo en lineas separadas
        let lines = content.split(/\r?\n/);
        //console.log("lines split = ", lines, " - lines length = ", lines.length);

        // Obtener la lista de todos los labels que hay
        let labels = content.match(new RegExp(/(?<=label\s*)(\w+)/, "g"));
        //console.log("labels = ", labels);

        // Guardar los labels existentes
        for(let i = 0; i < labels.length; i++){
            result_json["labels"][labels[i]] = [];
        }

        let current_label = ""; // Label actual (Para saber donde colocar las lineas)
        let label_index = 0; // Permite saber que nombre de label usar

        let comment_regex = /\/\/(.*)/;

        let last_line_type = ""; // if, else, else if, option, para poder obtener los bloques de cada una

        let line_regex = /^(\s+)(.*)/ // Obtener cualquier tipo de linea
        let is_label_regex = /^label\s*/; // Comprobación si la linea empieza con "label"

        let special_regex = /^(if|elif|else|option)/; // Obtener el tipo de linea especial

        // Controla cuantos elif hay
        let is_elif_index = 0;

        // El stack guarda el nivel de tabulación y a qué "bloque" (array) pertenece
        let stack = [];

        for(let i = 0; i < lines.length; i++){
            // Comprobar que la linea actual empiece por "label" para guardar el nombre
            if(is_label_regex.test(lines[i])){
                current_label = labels[label_index]; // Guardar el nombre del label
                stack = [
                    { tab_size: 0, block: result_json["labels"][current_label] }
                ];
                label_index++; 
                //console.log("current_label = ", current_label);

                continue; // Saltar a una linea que no sea label
            }

            // Si la primera linea es un espacio vacio o un comentario, saltarla
            if(lines[i] == "" || lines[i].match(comment_regex)){
                continue;
            }

            // Si no se detecta ningun nombre de label, entonces detener ejecución
            if(current_label == "") return {"labels": {}};

            // Comprobar que la linea tenga espacios/tabulaciones
            if(line_regex.test(lines[i])){
                // Linea actual
                let current_line = lines[i].match(line_regex);
                let get_tab_size = current_line[1].length; // Obtener la tabulación
                
                // Si la tabulación actual es menor que la del bloque superior, regresar al bloque anterior
                while (stack.length > 1 && get_tab_size < stack[stack.length - 1].tab_size) {
                    stack.pop();
                }

                // Siempre trabajar con el bloque que esté arriba del stack
                let current_block = stack[stack.length - 1].block;
                
                // Obtener el primer caracter de la linea
                let first_char = current_line[2][0];
                //console.log(first_char); 

                // Caracteres especiales para determinar la linea
                let first_chars_array = [['"', "["], ["i", "e", "o"]];

                // Bloques especiales
                if(first_chars_array[1].includes(first_char)){
                    // Asegurarse de que es una linea especial
                    last_line_type = current_line[2].match(special_regex)[1];

                    let conditionals = ["if", "elif", "else"];

                    // Comprobar que la linea actual sea una condicional
                    if(conditionals.includes(last_line_type)){
                        // Guarda la condición seguida del if-elif
                        let condition_regex = /^(?:if|elif)\s+(.+?)\s*:/;

                        // Una linea condicional, jamás se puede llamar sin if
                        if(last_line_type == "if"){
                            let new_conditional = {
                                "type": "conditional",
                                "conditions": {
                                    "if": { 
                                        "condition": current_line[2].match(condition_regex)[1], 
                                        "block": [] 
                                    }
                                }
                            };

                            current_block.push(new_conditional);
                                
                            // Agregar bloque if al stack
                            // Las siguientes líneas que tengan más tabulación irán aquí adentro.
                            stack.push({
                                tab_size: get_tab_size + 4, // Asumimos que el bloque interno tendrá 4 espacios más
                                block: new_conditional.conditions["if"].block
                            });
                        }

                        // Si existe el bloque "elif", guardarlo
                        else if(last_line_type == "elif"){
                            // Buscamos la última condición que agregamos en el bloque actual
                            let last_node = current_block[current_block.length - 1];
                            let elif_name = "elif_" + is_elif_index; // Asegúrate de actualizar el índice
                                
                            last_node.conditions[elif_name] = {
                                "condition": current_line[2].match(condition_regex)[1], 
                                "block": [] 
                            };
                                
                            // Agregar bloque elif al stack
                             // Las siguientes líneas que tengan más tabulación irán aquí adentro.
                            stack.push({
                                tab_size: get_tab_size + 4,
                                block: last_node.conditions[elif_name].block
                            });
                            is_elif_index++;
                        }

                        // Si existe "else", entonces guardar su bloque
                        // No es necesario escribirlo si existe elif
                        // Pero nunca puede existir si no existe elif
                        else if(last_line_type == "else"){
                            let last_node = current_block[current_block.length - 1];
            
                            last_node.conditions["else"] = { "block": [] };
                            
                            // Agregar bloque else al stack
                            stack.push({
                                tab_size: get_tab_size + 4,
                                block: last_node.conditions["else"].block
                            });
                        }
                    }

                    // Bloque de opción
                    else if(last_line_type == "option"){
                        let new_option = {
                            "type": "options",
                            "choices": []
                        }

                        current_block.push(new_option);

                        // Guardar primero como bloque a choices
                        stack.push({
                            tab_size: get_tab_size + 4, // El bloque interno tendrá 4 espacios más
                            block: new_option.choices
                        });

                        continue; // Saltar a la siguiente linea
                    }
                }

                // Aqui se maneja los dialogos y nombre, pero como extra si se detecta un :
                // Entonces se tomara como opción
                if(first_chars_array[0].includes(first_char)){

                    // Detectar nombre de opción
                    let choice_regex = /^"([^"]+)"\s*:/;
                    let choice_match = current_line[2].match(choice_regex);

                    if(choice_regex.test(current_line[2])){
                        let new_choice = {
                            "text": choice_match[1],
                            "block": []
                        };


                        // Justo aca, estamos dentro del bloque choices
                        current_block.push(new_choice);

                        // Agregar opción
                        stack.push({
                            tab_size: get_tab_size + 4,
                            block: new_choice.block
                        });

                        continue;
                    }

                    /// Logica de dialogo

                    // Obtener el nombre encerrado en los []
                    let who_regex = current_line[2].match(/^\[(.*?)\]\s*(?=")/);

                    let who = who_regex != null ? who_regex[1] : "" ;
                    //console.log("who = ", who);

                    let dialog_regex = current_line[2].match(/(?!=\[.*\])\s*\"([^"]*)/) 
                    let dialog_line = dialog_regex != null ? dialog_regex[1] : "";
                    //console.log("d_line = ", dialog_line);

                    // Guardar la linea de dialogo y el who (Si existe)
                    current_block.push({
                        "type": "dialogue",
                        "who": who,
                        "line": dialog_line
                    }) ;

                }
                // Linea especial "pass"
                else if(first_char === "p"){
                    current_block.push({
                        "type": "pass"
                    });

                }
                else if(first_char === "$"){
                    // Obtener toda la linea de comando
                    let command_regex = current_line[2].match(/\$\s*(\w+)\s*\((.*)\)/);
                        
                    // Obtener los parametros como cadena
                    let params_string = command_regex[2];
                    //console.log(params_string, " - ", "typeof params = ", typeof params_string);

                    // Guardar nombre de comando
                    current_block.push({
                        "type": "command",
                        "line": command_regex[1],
                        // Obtener los parametros en un Array y eliminar espacios y ""
                        "params": params_string.split(",")
                            .map(param => param.trim())
                            .map(param => param.replaceAll('"', ""))
                    });
                }
            }
        }
    }

    //console.log("result_json = ", JSON.stringify(result_json, null, 2));
    
    // Obtener el JSON parseado
    return JSON.stringify(result_json, null, 2);
}