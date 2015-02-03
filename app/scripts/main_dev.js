 $(document).ready(function() {

     //Esta será la validación general del formulario
     $("#validForm").validate({
         //Reglas de validación
         //- Comprobaremos que el usuario no exista previamente en la bbdd(NIF o email, el CIF no es necesario).
         //- Los campos CIF / NIF y Nombre / Empresa adecuarán su label en función del demandante seleccionado. - Una vez insertado el código postal, se debe seleccionar la provincia y la localidad de forma automática.La localidad se rellenará con criterio libre. - El código IBAN debe ser válido. - El usuario debe tener al menos 4 caracteres, se rellenará de modo automático con el correo electrónico y no podrá ser modificado. - La contraseña se debe forzar a que sea compleja. - Una vez pulsemos enviar en el formulario se mostrará un aviso al usuario de que se va a dar de alta y que se le pasará la primera cuota de 50€, 140€ o 550€ según corresponda(forma de pago).El usuario podrá cancelar la operación.
         rules: {
             //- Todos los campos con * son requeridos
             name: {
                 required: true
             },
             surname: {
                 required: true
             },
             phone: {
                 required: true,
                 //- Teléfono contendrá solo dígitos y un total de 9.
                 //Opción 1        
                 digits: true,
                 minlength: 9,
                 maxlength: 9

                 //Opcion 2, no la utilizo, ya que la 1 es más simple
                 //telefono9d: true
             },
             email: {
                 required: true,
                 //- email debe ser un correo electrónico válido(al menos en apariencia) 
                 // No me convence que "a@a" sea un email válido, como acepta el jquery-validate, busco alternativas
                 //email: true
                 //Alternativa 1
                 //Utilizar https://github.com/amail/Verimail.js  --No sé y no veo que esté siendo muy utilizado
                 //Alternativa 2
                 email_custom: true,
                 //- Comprobaremos que el usuario no exista previamente en la bbdd(NIF o email, el CIF no es necesario).
                 remote: "php/validar_email_db.php"
             },
             r_how_discover: {
                 required: true
             },
             r_plaintiff: {
                 required: true
             },
             cif_nif: {
                 required: true
             },
             name_enterprise_name: {
                 required: true
             },
             address: {
                 required: true
             },
             postal_code: {
                 required: true,
                 //- CP tendrán que ser 5 digitos.Si son menos se completará con 0 a la izquierda.
                 digits: true,
                 maxlength: 5,
                 //comprobar_corregirCP: true, 
                 //minlength; 5
                 /*
                 autocompletar: function() {
                     var caracteres = $("#postal_code").val();
                     if (caracteres.length > 0 && !$("#postal_code").is(":focus") && isNumeric(caracteres))
                         while (caracteres.length <= 4) {
                             $("#postal_code").val(caracteres + "0");
                             caracteres = $("#postal_code").val();
                         }
                 }
                 */
             },
             location: {
                 required: true
             },
             province: {
                 required: true
             },
             country: {
                 required: true
             },
             iban: {
                 required: true
             },
             r_payment: {
                 required: true
             },
             user: {
                 required: true
             },
             password: {
                 required: true
             }
         },
         messages: {
             firstName: {
                 lettersonly: "Introduce sólo carácteres."
             },
             lastName1: {
                 lettersonly: "Introduce sólo carácteres."
             },
             lastName2: {
                 lettersonly: "Introduce sólo carácteres."
             },
             documentNumber: {
                 remote: "Este DNI ya esta en uso.",
             },
             email: {
                 remote: "Este correo ya esta en uso.",
             },
             tarjetacredito: {
                 creditcardtypes: "Número de tarjeta incorrecto."
             }
         },
         errorPlacement: function(error, element) {
             /*
                          if (element.is("input:radio")) {
                              //$parent = element.parentsUntil('.form-group','.form-group').parent();
                              //$parent = element.parentsUntil('.fieldset',"label[for^='element.name']").parent();
                              //$parent = element.parentsUntil('.fieldset', '.form-group').parent();
                              //console.log($parent);
                              //error.insertAfter($parent);
                              error.insertAfter($("label[for='" + element.attr('name') + "']"));
                          } else {
                             // error.insertAfter(element);
                          }
                         */
             error.insertAfter($("label[for='" + element.attr('name') + "']"));
         },
         //Captura el envío del formulario una vez que se ha rellenado correctamente
         submitHandler: function() {
             alert("¡Enviado!");
         }
     });

     $("#postal_code").focusout(function() {
         var caracteres = $("#postal_code").val();
         if (caracteres.length > 0 && caracteres.match(/^\d+$/))
             while (caracteres.length <= 4) {
                 $("#postal_code").val(caracteres + "0");
                 caracteres = $("#postal_code").val();
             }
     });

     /*
     $("#particular").keyup(function(event) {
         if ($("#particular").is(':checked')) {
             $("#name_enterprise_name").attr("placeholder", $("#name").val() + " " + $("#surname").val());
         }
     });
    */

     $("#surname").blur(function(event) {
         autocompletarNombre();
     });



     //Por defecto estará marcado como demandante Particular y como Nombre (apartado Datos de facturación) 
     //la combinación de los campos Nombre y Apellidos de la información de contacto.
     // Si el input:radio #particular esta marcado:
     $("#particular").change(function(evento) {
         if ($("#particular").is(':checked')) {
             $("label[for='name_enterprise_name']").first().text("Nombre");
             //$("#name_enterprise_name").attr("placeholder", $("#name").val() + " " + $("#surname").val());
             $("#name_enterprise_name").attr("placeholder", "Nombre");
             autocompletarNombre();
         }
     });

     // Si el usuario selecciona como demandante Empresa, se borrará el contenido del campo“ Nombre”, que pasará a llamarse“ Empresa” para que el usuario lo rellene. 
     // Si el input:radio #particular esta marcado:
     $("#empresa").change(function(evento) {
         if ($("#empresa").is(':checked')) {
             $("label[for='name_enterprise_name']").first().text("Empresa");
             $("#name_enterprise_name").val('');
             $("#name_enterprise_name").attr("placeholder", "Nombre de la empresa");
         }
     });

     function autocompletarNombre() {
         $nombre = $("#name").val() + " " + $("#surname").val();
         if ($nombre != '')
             $("#name_enterprise_name").val($nombre);
     }
 });
