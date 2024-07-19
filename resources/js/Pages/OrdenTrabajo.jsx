import React from "react";

const OrdenTrabajo = () => {
    return (
        <>
            <div className="grid grid-cols-6 gap-1 m-1 font-console">
                <div className="uppercase bg-green-500 text-center text-white text-2xl font-semibold col-span-5 py-1">
                    Orden de trabajo
                </div>
                <div className="flex items-center justify-center md:row-span-3 bg-red-50">
                    ❤️
                </div>

                <div className="uppercase hidden md:block font-bold text-center border border-black">
                    Fecha
                </div>

                <div className="font-console col-span-full md:col-span-3 md:row-span-2 border border-black flex items-center justify-center px-2">
                    <p>
                        Lo más importante en mi empresa son los clientes.
                        Gracias por preferirnos.
                    </p>
                </div>

                <div className="uppercase md:hidden font-bold text-center border border-black">
                    Fecha
                </div>

                <div className="uppercase md:hidden text-center border border-black col-span-5">
                    <Fecha />
                </div>

                <div className="uppercase font-bold text-center border border-black">
                    Ticket
                </div>

                <div className="uppercase hidden md:block text-center border border-black col-span-3 md:col-span-1">
                    <Fecha />
                </div>

                <div className="uppercase text-center border border-black col-span-5 md:col-span-1"></div>

                <div className="col-span-full text-center border border-black px-1">
                    022837001 / 0963162626 Llano Grande, Carapungo N° OE9-382
                </div>
            </div>
            {/*Sección 2 */}
            <div className="grid grid-cols-6 gap-1 m-1 font-console">
                {/* Fila 1 */}
                <div className="uppercase bg-green-500 text-center text-white text-xl font-semibold col-span-full py-1">
                    información cliente
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    nombre
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    garzon barahona rodolfo leandro/dec-0038
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    sector:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold">
                    llano grande
                </div>

                {/* Fila 2 */}
                <div className="uppercase ps-3 border font-console border-black">
                    dirección:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    pasaje s/n y jose miguel guarderas /
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    plan/comptarticion:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold">
                    gpon entretenimiento
                </div>

                {/* Fila 3 */}
                <div className="uppercase ps-3 border font-console border-black">
                    telefonos:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    0963270711
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    ip:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold">
                    10.0.3.17
                </div>

                {/* Fila 4 */}
                <div className="uppercase ps-3 border font-console border-black">
                    nap:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    {" "}
                    c04 / parque-decll -oltp3-dist03-um004
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    id olt:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold">
                    dec-003/c04/garzon.r
                </div>

                {/* Fila 5 */}
                <div className="uppercase ps-3 border font-console border-black">
                    responsable:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    s1 dmeneses
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    estado:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold">
                    activo
                </div>
            </div>
            {/*Sección 3 */}
            <div className="grid grid-cols-6 gap-1 m-1 font-console">
                {/* Fila 1 */}
                <div className="uppercase bg-green-500 text-center text-white text-xl font-semibold col-span-full py-1">
                    soportes
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    tipo de orden
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    requeriminetos técnico
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    ab reaclamo reclamo:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold"></div>

                {/* Fila 2 */}
                <div className="uppercase ps-3 border font-console border-black">
                    tipo de reporte:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    cambio de clave
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    ab isp inicial:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold"></div>

                {/* Fila 3 */}
                <div className="uppercase ps-3 border font-console border-black">
                    fecha y hora solución:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold flex items-center justify-center">
                    <span>sábado, 27 de abril de 2024, 19:12:0</span>
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    potencia inicial:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold"></div>

                {/* Fila 4 */}
                <div className="uppercase ps-3 border font-console border-black">
                    canal:
                </div>
                <div className="uppercase ps-3 border border-black md:col-span-3 font-semibold">
                    personalizado
                </div>
                <div className="uppercase ps-3 border font-console border-black">
                    ab isp final:
                </div>
                <div className="uppercase ps-3 border border-black font-semibold"></div>
            </div>
            {/*Sección 4 */}
            <div className="grid grid-cols-6 gap-1 m-1 font-console">
                {/*Fila 1*/}
                <div className="uppercase ps-3 border border-black py-3">
                    diagnostico incial
                </div>
                <div className="col-span-5 ps-3 border border-black py-3">
                    s1 dmeneses-averías técnicas-corte interno-indica que no
                    tiene servicio en este momento tiene luz roja
                </div>

                {/*Fila 2*/}
                <div className="uppercase ps-3 border border-black py-3">
                    diagnostico final
                </div>
                <div className="uppercase col-span-5 text-red-500 ps-3 border border-black py-3">
                    Sin servicio
                </div>

                {/*Fila 3*/}
                <div className="uppercase ps-3 border border-black py-3">
                    solucion
                </div>
                <div className="uppercase col-span-5 text-red-500 ps-3 border border-black py-3">
                    cambio de clave
                </div>

                {/*Fila 4*/}
                <div className="uppercase ps-3 border border-black">
                    potencia final
                </div>
                <div className="uppercase col-span-3 text-red-500 ps-3 border border-black "></div>
                <div className="uppercase ps-3 border border-black">
                    procedentes
                </div>
                <div className="uppercase ps-3 border border-black">NO</div>

                {/*Fila 4*/}
                <div className="flex justify-around col-span-full mt-3">
                    <button className="uppercase px-5 py-2 rounded-lg bg-gradient-to-b from-green-200 to-green-500 font-medium border-2 border-green-400 hover:bg-green-600">
                        limpiar
                    </button>
                    <button className="uppercase px-5 py-2 rounded-lg bg-gradient-to-b from-green-200 to-green-500 font-medium border-2 border-green-400 hover:bg-green-600">
                        guardar
                    </button>
                </div>
            </div>
        </>
    );
};

const Fecha = () => {
    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return <>{getFormattedDate()}</>;
};

export default OrdenTrabajo;
