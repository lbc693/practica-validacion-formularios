 $(document).ready(function() {

     //Esta será la validación general del formulario
     $("#validForm").validate({
         //Reglas de validación
         //-Una vez insertado el código postal, se debe seleccionar la provincia y la localidad de forma automática.La localidad se rellenará con criterio libre. - El código IBAN debe ser válido. - El usuario debe tener al menos 4 caracteres, se rellenará de modo automático con el correo electrónico y no podrá ser modificado. - La contraseña se debe forzar a que sea compleja. - Una vez pulsemos enviar en el formulario se mostrará un aviso al usuario de que se va a dar de alta y que se le pasará la primera cuota de 50€, 140€ o 550€ según corresponda(forma de pago).El usuario podrá cancelar la operación.
         rules: {
             //- Todos los campos con * son requeridos
             name: {
                 required: true,
                 lettersonly: true
             },
             surname: {
                 required: true,
                 lettersonly: true
             },
             phone: {
                 required: true,
                 //- Teléfono contendrá solo dígitos y un total de 9.
                 digits: true,
                 minlength: 9,
                 maxlength: 9
             },
             email: {
                 required: true,
                 //- email debe ser un correo electrónico válido(al menos en apariencia) 
                 email_custom: true,
                 //- Comprobaremos que el usuario no exista previamente en la bbdd(NIF o email, el CIF no es necesario).
                 remote: "php/validar_email_db.php"
             },
             email2: {
                 required: true,
                 equalTo: email
             },
             r_how_discover: {
                 required: true
             },
             r_plaintiff: {
                 required: true
             },
             cif_nif: {
                 required: true,
                 nifES: function() {
                     if ($("#particular").is(':checked')) {
                         return true;
                     }
                 },
                 cifES: function() {
                     if ($("#empresa").is(':checked')) {
                         return true;
                     }
                 },
             },
             name_enterprise_name: {
                 required: true
             },
             address: {
                 required: true
             },
             postal_code: {
                 required: true,
                 digits: true,
                 maxlength: 5,
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
                 required: true,
                 iban: true
             },
             r_payment: {
                 required: true
             },
             user: {
                 required: true
             },
             password: {
                 required: true
             },
             password2: {
                 required: true,
                 equalTo: password
             }
         },
         messages: {
             email: {
                 remote: "Este correo ya esta en uso."
             }
         },
         errorPlacement: function(error, element) {
             error.insertAfter($("label[for='" + element.attr('name') + "']"));
         },
         //Captura el envío del formulario una vez que se ha rellenado correctamente
         submitHandler: function() {
             alert("¡Enviado!");
         }
     });

     // CP tendrán que ser 5 digitos.Si son menos se completará con 0 a la izquierda.
     /*
      *Cuando el código postal pierde el foco se autocompleta con ceros ala izquierda
      */
     $("#postal_code").focusout(function() {
         var caracteres = $("#postal_code").val();
         if (caracteres.length > 0 && caracteres.match(/^\d+$/))
             while (caracteres.length <= 4) {
                 $("#postal_code").val("0" + caracteres);
                 caracteres = $("#postal_code").val();
             }
     });

     //Por defecto estará marcado como demandante Particular y como Nombre (apartado Datos de facturación) 
     //la combinación de los campos Nombre y Apellidos de la información de contacto.
     //Los campos CIF / NIF y Nombre / Empresa adecuarán su label en función del demandante seleccionado.

     //Cuando se pierde el foco del input del apellido se autocompletará el Nombre en el apartado Datos de facturación
     $("#surname").focusout(function(event) {
         console.log('apellido pierde foco');
         autocompletarNombre();
     });

     // Si el input:radio #particular esta marcado:
     $("#particular").change(function(evento) {
         if ($("#particular").is(':checked')) {
             $("label[for='name_enterprise_name']").first().html('Nombre<span class="required"> *</span>');
             $("#name_enterprise_name").val('');
             $("#name_enterprise_name").attr('placeholder', 'Nombre');
             autocompletarNombre();
             $("label[for='cif_nif']").first().html('NIF<span class="required"> *</span>');
             $("#cif_nif").val('');
             $("#cif_nif").attr('placeholder', 'NIF');
         }
     });

     // Si el usuario selecciona como demandante Empresa, se borrará el contenido del campo“ Nombre”, que pasará a llamarse“ Empresa” para que el usuario lo rellene. 
     // Si el input:radio #particular esta marcado:
     $("#empresa").change(function(evento) {
         if ($("#empresa").is(':checked')) {
             $("label[for='name_enterprise_name']").first().html('Empresa<span class="required"> *</span>');
             $("#name_enterprise_name").val('');
             $("#name_enterprise_name").attr('placeholder', 'Nombre de la empresa');
             $("label[for='cif_nif']").first().html('CIF<span class="required"> *</span>');
             $("#cif_nif").val('');
             $("#cif_nif").attr('placeholder', 'CIF');
         }
     });

     /*
      * Autocompletará el Nombre (apartado Datos de facturación) a partir del nombre y apellidos (Apartado Información de contacto)
      * si estos no están vacíos y si está seleccionado como demandante "particular"
      */
     function autocompletarNombre() {
         //console.log('autocompletarNombre');
         $nombre = $("#name").val() + " " + $("#surname").val();
         if ($nombre !== ' ' && $("#particular").is(':checked')) {
             $("#name_enterprise_name").val($nombre);
             //console.log('Cambio el nombre por: '+$nombre);
         }
     }

 });
