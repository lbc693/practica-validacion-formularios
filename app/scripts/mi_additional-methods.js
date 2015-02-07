/*!
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "./jquery.validate"], factory);
    } else {
        factory(jQuery);
    }
}(function($) {

    /*
    --Opción 2, no la utilizo
    Teléfono contendrá solo dígitos y un total de 9.
    */
    $.validator.addMethod("telefono9d", function(phone_number, element) {

        if (phone_number == '')
            return false;

        var rxDatePattern = /^[0-9]{9}$/;

        if (rxDatePattern.test(phone_number)) {
            return true;
        } else {
            return false;
        }

    }, 'Introduce un teléfono válido, debe contener sólo 9 dígitos.');

    /*
    Comprueba el código postal y si lo que hay son números, lo completa con ceros
    */
    /*
    $.validator.addMethod("comprobar_corregirCP", function(caracteres, element) {

        if (caracteres == '')
            return false;
        if (caracteres.length > 0 && !$("#postal_code").is(":focus") && isNumeric(caracteres)) {
            while (caracteres.length <= 4) {
                $("#postal_code").val(caracteres + "0");
                caracteres = $("#postal_code").val();
            }
            return true;
        } else {
            return false;
        }

    }, 'Introduce un email válido.');
*/
    /*
    Comprueba que el mail es correcto
    */
    $.validator.addMethod("email_custom", function(email, element) {

        if (email == '')
            return false;

        var rxDatePattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        return (rxDatePattern.test(email));

    }, 'Introduce un email válido.');

    $.validator.addMethod("spanishlettersspacesonly", function(value, element) {
        return this.optional(element) || /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/i.test(value);
    }, "Introduce sólo letras");

    $.validator.addMethod("compleja", function(value, element) {
        complejidad =$("input[for='password'][name='complexity']").val();
        if (complejidad == 100) {
            return true;
        } else {
            return false;
        }
    }, "La contraseña debe ser más compleja");


}));
