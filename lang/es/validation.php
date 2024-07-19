<?php

declare(strict_types=1);

return [
    "accepted" => "El campo :attribute debe ser aceptado.",
    "accepted_if" =>
        "El campo :attribute debe ser aceptado cuando :other sea :value.",
    "active_url" => "El campo :attribute debe ser una URL válida.",
    "after" => "El campo :attribute debe ser una fecha posterior a :date.",
    "after_or_equal" =>
        "El campo :attribute debe ser una fecha posterior o igual a :date.",
    "alpha" => "El campo :attribute sólo debe contener letras.",
    "alpha_dash" =>
        "El campo :attribute sólo debe contener letras, números, guiones y guiones bajos.",
    "alpha_num" => "El campo :attribute sólo debe contener letras y números.",
    "array" => "El campo :attribute debe ser un conjunto.",
    "ascii" =>
        "El campo :attribute solo debe contener caracteres alfanuméricos y símbolos de un solo byte.",
    "before" => "El campo :attribute debe ser una fecha anterior a :date.",
    "before_or_equal" =>
        "El campo :attribute debe ser una fecha anterior o igual a :date.",
    "between" => [
        "array" =>
            "El campo :attribute tiene que tener entre :min - :max elementos.",
        "file" => "El campo :attribute debe pesar entre :min - :max kilobytes.",
        "numeric" => "El campo :attribute tiene que estar entre :min - :max.",
        "string" =>
            "El campo :attribute tiene que tener entre :min - :max caracteres.",
    ],
    "boolean" => "El campo :attribute debe tener un valor verdadero o falso.",
    "can" => "El campo :attribute contiene un valor no autorizado.",
    "confirmed" => "La confirmación de :attribute no coincide.",
    "contains" => "The :attribute field is missing a required value.",
    "current_password" => "La contraseña es incorrecta.",
    "date" => "El campo :attribute debe ser una fecha válida.",
    "date_equals" => "El campo :attribute debe ser una fecha igual a :date.",
    "date_format" =>
        "El campo :attribute debe coincidir con el formato :format.",
    "decimal" => "El campo :attribute debe tener :decimal cifras decimales.",
    "declined" => "El campo :attribute debe ser rechazado.",
    "declined_if" =>
        "El campo :attribute debe ser rechazado cuando :other sea :value.",
    "different" => "El campo :attribute y :other deben ser diferentes.",
    "digits" => "El campo :attribute debe tener :digits dígitos.",
    "digits_between" =>
        "El campo :attribute debe tener entre :min y :max dígitos.",
    "dimensions" =>
        "El campo :attribute tiene dimensiones de imagen no válidas.",
    "distinct" => "El campo :attribute contiene un valor duplicado.",
    "doesnt_end_with" =>
        "El campo :attribute no debe finalizar con uno de los siguientes: :values.",
    "doesnt_start_with" =>
        "El campo :attribute no debe comenzar con uno de los siguientes: :values.",
    "email" => "El campo :attribute no es un correo válido.",
    "ends_with" =>
        "El campo :attribute debe finalizar con uno de los siguientes valores: :values",
    "enum" => "El campo :attribute no está en la lista de valores permitidos.",
    "exists" => "El campo :attribute no existe.",
    "extensions" =>
        "El campo :attribute debe tener una de las siguientes extensiones: :values.",
    "file" => "El campo :attribute debe ser un archivo.",
    "filled" => "El campo :attribute es obligatorio.",
    "gt" => [
        "array" => "El campo :attribute debe tener más de :value elementos.",
        "file" => "El campo :attribute debe tener más de :value kilobytes.",
        "numeric" => "El campo :attribute debe ser mayor que :value.",
        "string" => "El campo :attribute debe tener más de :value caracteres.",
    ],
    "gte" => [
        "array" =>
            "El campo :attribute debe tener como mínimo :value elementos.",
        "file" =>
            "El campo :attribute debe tener como mínimo :value kilobytes.",
        "numeric" => "El campo :attribute debe ser como mínimo :value.",
        "string" =>
            "El campo :attribute debe tener como mínimo :value caracteres.",
    ],
    "hex_color" =>
        "El campo :attribute debe tener un color hexadecimal válido.",
    "image" => "El campo :attribute debe ser una imagen.",
    "in" => "El campo :attribute no está en la lista de valores permitidos.",
    "in_array" => "El campo :attribute debe existir en :other.",
    "integer" => "El campo :attribute debe ser un número entero.",
    "ip" => "El campo :attribute debe ser una dirección IP válida.",
    "ipv4" => "El campo :attribute debe ser una dirección IPv4 válida.",
    "ipv6" => "El campo :attribute debe ser una dirección IPv6 válida.",
    "json" => "El campo :attribute debe ser una cadena JSON válida.",
    "list" => "El campo :attribute debe ser una lista.",
    "lowercase" => "El campo :attribute debe estar en minúscula.",
    "lt" => [
        "array" => "El campo :attribute debe tener menos de :value elementos.",
        "file" => "El campo :attribute debe tener menos de :value kilobytes.",
        "numeric" => "El campo :attribute debe ser menor que :value.",
        "string" =>
            "El campo :attribute debe tener menos de :value caracteres.",
    ],
    "lte" => [
        "array" =>
            "El campo :attribute debe tener como máximo :value elementos.",
        "file" =>
            "El campo :attribute debe tener como máximo :value kilobytes.",
        "numeric" => "El campo :attribute debe ser como máximo :value.",
        "string" =>
            "El campo :attribute debe tener como máximo :value caracteres.",
    ],
    "mac_address" => "El campo :attribute debe ser una dirección MAC válida.",
    "max" => [
        "array" => "El campo :attribute no debe tener más de :max elementos.",
        "file" => "El campo :attribute no debe ser mayor que :max kilobytes.",
        "numeric" => "El campo :attribute no debe ser mayor que :max.",
        "string" =>
            "El campo :attribute no debe ser mayor que :max caracteres.",
    ],
    "max_digits" => "El campo :attribute no debe tener más de :max dígitos.",
    "mimes" => "El campo :attribute debe ser un archivo con formato: :values.",
    "mimetypes" =>
        "El campo :attribute debe ser un archivo con formato: :values.",
    "min" => [
        "array" => "El campo :attribute debe tener al menos :min elementos.",
        "file" =>
            "El tamaño de :attribute debe ser de al menos :min kilobytes.",
        "numeric" => "El tamaño de :attribute debe ser de al menos :min.",
        "string" =>
            "El campo :attribute debe contener al menos :min caracteres.",
    ],
    "min_digits" => "El campo :attribute debe tener al menos :min dígitos.",
    "missing" => "El campo :attribute no debe estar presente.",
    "missing_if" =>
        "El campo :attribute no debe estar presente cuando :other sea :value.",
    "missing_unless" =>
        "El campo :attribute no debe estar presente a menos que :other sea :value.",
    "missing_with" =>
        "El campo :attribute no debe estar presente si alguno de los campos :values está presente.",
    "missing_with_all" =>
        "El campo :attribute no debe estar presente cuando los campos :values estén presentes.",
    "multiple_of" => "El campo :attribute debe ser múltiplo de :value",
    "not_in" => "El campo :attribute no debe estar en la lista.",
    "not_regex" => "El formato del campo :attribute no es válido.",
    "numeric" => "El campo :attribute debe ser numérico.",
    "password" => [
        "letters" => "La :attribute debe contener al menos una letra.",
        "mixed" =>
            "La :attribute debe contener al menos una letra mayúscula y una minúscula.",
        "numbers" => "La :attribute debe contener al menos un número.",
        "symbols" => "La :attribute debe contener al menos un símbolo.",
        "uncompromised" =>
            "La :attribute proporcionada se ha visto comprometida en una filtración de datos (data leak). Elija una :attribute diferente.",
    ],
    "present" => "El campo :attribute debe estar presente.",
    "present_if" =>
        "El campo :attribute debe estar presente cuando :other es :value.",
    "present_unless" =>
        "El campo :attribute debe estar presente a menos que :other sea :value.",
    "present_with" =>
        "El campo :attribute debe estar presente cuando :values esté presente.",
    "present_with_all" =>
        "El campo :attribute debe estar presente cuando :values estén presentes.",
    "prohibited" => "El campo :attribute está prohibido.",
    "prohibited_if" =>
        "El campo :attribute está prohibido cuando :other es :value.",
    "prohibited_unless" =>
        "El campo :attribute está prohibido a menos que :other sea :values.",
    "prohibits" => "El campo :attribute prohibe que :other esté presente.",
    "regex" => "El formato del campo :attribute no es válido.",
    "required" => "El campo :attribute es obligatorio.",
    "required_array_keys" =>
        "El campo :attribute debe contener entradas para: :values.",
    "required_if" =>
        "El campo :attribute es obligatorio cuando :other es :value.",
    "required_if_accepted" =>
        "El campo :attribute es obligatorio si :other es aceptado.",
    "required_if_declined" =>
        "The :attribute field is required when :other is declined.",
    "required_unless" =>
        "El campo :attribute es obligatorio a menos que :other esté en :values.",
    "required_with" =>
        "El campo :attribute es obligatorio cuando :values está presente.",
    "required_with_all" =>
        "El campo :attribute es obligatorio cuando :values están presentes.",
    "required_without" =>
        "El campo :attribute es obligatorio cuando :values no está presente.",
    "required_without_all" =>
        "El campo :attribute es obligatorio cuando ninguno de :values está presente.",
    "same" => "Los campos :attribute y :other deben coincidir.",
    "size" => [
        "array" => "El campo :attribute debe contener :size elementos.",
        "file" => "El tamaño de :attribute debe ser :size kilobytes.",
        "numeric" => "El tamaño de :attribute debe ser :size.",
        "string" => "El campo :attribute debe contener :size caracteres.",
    ],
    "starts_with" =>
        "El campo :attribute debe comenzar con uno de los siguientes valores: :values",
    "string" => "El campo :attribute debe ser una cadena de caracteres.",
    "timezone" => "El campo :attribute debe ser una zona horaria válida.",
    "ulid" => "El campo :attribute debe ser un ULID válido.",
    "unique" => "El campo :attribute ya ha sido registrado.",
    "uploaded" => "Subir :attribute ha fallado.",
    "uppercase" => "El campo :attribute debe estar en mayúscula.",
    "url" => "El campo :attribute debe ser una URL válida.",
    "uuid" => "El campo :attribute debe ser un UUID válido.",

    "attributes" => [
        "login" => "email o usuario",
        "email" => "correo electrónico",
        "password" => "contraseña",
        "username" => "nombre de usuario",
        "client_id" => "cédula",
        "address" => "dirección",
        "reference" => "referencia",
        "sector_id" => "sector",
        "client_name" => "nombres",
        "client_email" => "correo electrónico",
        "phone_number" => "número de télefono",
        "sector_name" => "nombre del sector",
        "parish_id" => "parroquia",
        "description" => "descripción",
        "canton_id" => "canton",
        "parish_name" => "nombre de la parroquia",
        "province_id" => "provincia",
        "canton_name" => "nombre del canton",
        "contract_num" => "número de contrato",
        "contract_id" => "contrato",
        "status_id" => "estado",
        "discount_id" => "descuento",
        "status_name" => "nombre del estado",
        "discount_name" => "nombre del descuento",
        "plan_id" => "plan",
        "plan_name" => "nombre del plan",
        "plan_megas" => "megas del plan",
        "plan_value" => "valor del plan",
        "plan_description" => "descripción del plan",
        "installation_date" => "fecha de instalación",
        "maximum_date" => "fecha máxima de pago",
        "product_id" => "producto",
        "product_name" => "nombre del producto",
        "product_description" => "descripción del producto",
        "product_price" => "precio del producto",
        "product_quantity" => "cantidad del producto",
        "product_brand" => "marca del producto",
        "product_vat" => "iva del producto",
        "movement_id" => "movimiento",
        "movement_date" => "fecha del movimiento",
        "movement_quantity" => "cantidad del movimiento",
        "movement_total" => "total del movimiento",
        "movement_type" => "tipo del movimiento",
        "olt_id"=> "Olt",
        "olt_name"=> "nombre OLT",
        "olt_address"=> "dirección",
        "olt_coordx"=> "coordenada x",
        "olt_coordy"=> "coordenada y",
        "olt_ports"=> "puerto",
        "distribution_nap_id"=> "nap de distribución",
        "distribution_nap_name"=> "nombre de la nap",
        "distribution_nap_address"=> "dirección de la nap",
        "distribution_nap_coordx"=> "coordenada x",
        "distribution_nap_coordy"=> "coordenada y",
        "distribution_nap_splitter"=> "splitter",
        "last_mile_nap_id"=> "nap ultima milla",
        "last_mile_nap_name"=> "nombre de la nap",
        "last_mile_nap_address"=> "dirección de la nap",
        "last_mile_nap_coordx"=> "coordenada x",
        "last_mile_nap_coordy"=> "coordenada y",
        "last_mile_nap_splitter"=> "splitter",
        "ip_address"=> "dirección ip",
        "ip_status"=> "estado ip",
        "type_order_id"=> "tipo de orden",
        "name_type_order"=> "nombre del tipo",
        "description_type_order"=> "descripción del tipo",
        "type_report_id"=> "tipo de reporte",
        "name_type_report"=> "nombre del tipo",
        "description_type_report"=> "descripción del tipo",
        "work_order_id"=> "Orden de trabajo",
        "employee_id"=> "empleado",
        "order_channel"=> "Canal de pedido",
        "issue_date"=> "fecha de problema",
        "order_precedents"=> "precedentes",
        "order_abclaim"=> "reclamación ab",
        "solution_date"=> "fecha de solución",
        "order_initial_abis"=> "inicio de ABIS",
        "order_initial_potency"=> "potencia inicial",
        "order_final_abis"=> "ABIS final",
        "order_initial_diagnosis"=> "diagnóstico inicial",
        "order_solution"=> "solución",
        "order_final_potency"=> "potencia final",
        "order_final_diagnosis"=> "diagnóstico final",
        "value_due"=> "valor adeudado",
    ],
];
