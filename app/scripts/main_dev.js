 $(document).ready(function() {

     //Esta será la validación general del formulario
     $("#validForm").validate({
         //Reglas de validación
         rules: {
             //- Todos los campos con * son requeridos
             name: {
                 required: true,
                 spanishlettersspacesonly: true
             },
             surname: {
                 required: true,
                 spanishlettersspacesonly: true
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
             cifnif: {
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
                 remote: "php/validar_nif_db.php"
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
             localidad: {
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
                 //- El código IBAN debe ser válido. 
                 iban: true
             },
             r_payment: {
                 required: true
             },
             user: {
                 required: true
             },
             password: {
                 required: true,
                 // La contraseña se debe forzar a que sea compleja. 
                 compleja: true
             },
             password2: {
                 required: true,
                 equalTo: password
             }
         },
         messages: {
             email: {
                 remote: "Este correo ya esta en uso."
             },
             cifnif: {
                 remote: "Este NIF ya esta en uso."
             }
         },
         errorPlacement: function(error, element) {
             error.insertAfter($("label[for='" + element.attr('name') + "']"));
         },
         //Captura el envío del formulario una vez que se ha rellenado correctamente
         // Una vez pulsemos enviar en el formulario se mostrará un aviso al usuario de 
         // que se va a dar de alta y que se le pasará la primera cuota de 50€, 140€ o 
         //550€ según corresponda(forma de pago).El usuario podrá cancelar la operación.
         submitHandler: function() {
             var cuota = $('input[name=r_payment]:checked', '#validForm').val();
             var r = confirm("¿Aceptas el pago de la primera cuota, " + cuota + "€?");
             if (r == true) {
                 alert("Así que vas a pagar... Formulario enviado! :)");
             }
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

     $("#postal_code").bind("change paste keyup", function(evento) {
         if ($(this).val().length >= 5) {
             var dato = $(this).val();
             //-Una vez insertado el código postal, se debe seleccionar la provincia y la localidad de forma 
             // automática.La localidad se rellenará con criterio libre.

             //Completo de forma automática la provincia
             $.ajax({
                 type: "POST",
                 dataType: "json",
                 url: "php/getProvincia.php",
                 data: {
                     zip: dato
                 },
                 success: function(msg) {
                     $("#province").val(msg[0].Provincia);
                 }
             });

             //Completo de forma automática la localidad
             var promise = $.ajax({
                 type: "POST",
                 dataType: "json",
                 url: "php/getMunicipios.php",
                 data: {
                     cp: dato
                 }
             });

             //al terminar la promesa:
             promise.done(function(data) {
                 var sel = $("#localidad");
                 sel.empty();
                 for (var i = 0; i < data.length; i++) {
                     sel.append('<option value="' + data[i].idMunicipio + '">' + data[i].Municipio + '</option>');
                 }
             });
         }
     });


     //Por defecto estará marcado como demandante Particular y como Nombre (apartado Datos de facturación) 
     //la combinación de los campos Nombre y Apellidos de la información de contacto.
     //Los campos CIF / NIF y Nombre / Empresa adecuarán su label en función del demandante seleccionado.

     //Cuando se pierde el foco del input del apellido se autocompletará el Nombre en el apartado Datos de facturación
     $("#surname").focusout(function(event) {
         autocompletarNombre();
     });

     //- El usuario debe tener al menos 4 caracteres, se rellenará de modo automático con el correo electrónico y no podrá ser modificado.
     //Cuando se pierde el foco del correo electrónico se autocompletará el usuario en el apartado Datos de acceso
     $("#email").focusout(function(event) {
         autocompletarUsuario();
     });

     // Si el input:radio #particular esta marcado:
     $("#particular").change(function(evento) {
         if ($("#particular").is(':checked')) {
             $("label[for='name_enterprise_name']").first().html('Nombre<span class="required"> *</span>');
             $("#name_enterprise_name").val('');
             $("#name_enterprise_name").attr('placeholder', 'Nombre');
             autocompletarNombre();
             $("label[for='cifnif']").first().html('NIF<span class="required"> *</span>');
             $("#cifnif").val('');
             $("#cifnif").attr('placeholder', 'NIF');
         }
     });

     // Si el usuario selecciona como demandante Empresa, se borrará el contenido del campo“ Nombre”, que pasará a llamarse“ Empresa” para que el usuario lo rellene. 
     // Si el input:radio #particular esta marcado:
     $("#empresa").change(function(evento) {
         if ($("#empresa").is(':checked')) {
             $("label[for='name_enterprise_name']").first().html('Empresa<span class="required"> *</span>');
             $("#name_enterprise_name").val('');
             $("#name_enterprise_name").attr('placeholder', 'Nombre de la empresa');
             $("label[for='cifnif']").first().html('CIF<span class="required"> *</span>');
             $("#cifnif").val('');
             $("#cifnif").attr('placeholder', 'CIF');
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
     $('#pb').css({
         'background-image': 'none',
         'background-color': 'red'
     });

     /*
      * Autocompletará el Usuario (apartado Datos de acceso) a partir del email
      */
     function autocompletarUsuario() {
         $("#user").val($("#email").val());
     }

     $('#password').complexify({
         strengthScaleFactor: 0.2
     }, function(valid, complexity) {
         if (complexity < 50) {
             $('#pbPassword').css({
                 'background-color': 'red'
             });
         } else if (complexity < 100) {
             $('#pbPassword').css({
                 'background-color': 'orange'
             });
         } else {
             $('#pbPassword').css({
                 'background-color': 'green'
             });
         }
         $('#pbPassword').css({
             'width': complexity + '%'
         }).attr('aria-valuenow', complexity);
         $("input[for='password'][name='complexity']").val(complexity);
     });

     /*
      * Evita que se pueda cortar, copiar y pegar en los campos de password
      */
     $('#password').bind("cut copy paste", function(e) {
         e.preventDefault();
     });
     $('#password2').bind("cut copy paste", function(e) {
         e.preventDefault();
     });

     //Evita poder pegar en el campo de repetir email
     $('#email2').bind("paste", function(e) {
         e.preventDefault();
     });
 });
