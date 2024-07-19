<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCedula implements ValidationRule {
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        if (!$this->isValidCedula($value)) {
            $fail($attribute, "No es una cédula válida.");
        }
    }

    /**
     * Validar si la cédula es válida.
     *
     * @param  string  $cedula
     * @return bool
     */
    function isValidCedula($cedula) {
        if (strlen($cedula) != 10) {
            return false;
        }

        $provincia = intval(substr($cedula, 0, 2));
        if ($provincia < 1 || $provincia > 24) {
            return false;
        }

        $suma = 0;
        for ($i = 0; $i < 9; $i++) {
            $digito = intval($cedula[$i]);
            if ($i % 2 == 0) {
                $resultado = $digito * 2;
                if ($resultado >= 10) {
                    $resultado -= 9;
                }
            } else {
                $resultado = $digito * 1;
            }
            $suma += $resultado;
        }

        $digitoVerificadorCalculado = (10 - ($suma % 10)) % 10;

        return $digitoVerificadorCalculado == intval($cedula[9]);
    }
}
