document.addEventListener('DOMContentLoaded', () => {
    const pilares = [
        {
            nombre: "Gestión de Capital Humano",
            items: [
                { p: "¿El personal recibe pagos de viáticos y horas extras en los plazos legales?", i: "Incumplimiento de leyes laborales; alta rotación." },
                { p: "¿Se realizan los aportes a la seguridad social según la ley?", i: "Riesgo de demandas y multas por evasión de prestaciones." },
                { p: "¿Existen contratos de trabajo firmados que especifiquen funciones?", i: "Vulnerabilidad legal ante litigios laborales." },
                { p: "¿Se cumple el límite máximo de horas de trabajo legal?", i: "Fatiga del personal y mayor riesgo de accidentes." },
                { p: "¿Hay registro de vacaciones y descanso compensatorio?", i: "Negligencia administrativa que deriva en conflictos." }
            ]
        },
        {
            nombre: "Operaciones y Funciones",
            items: [
                { p: "¿Se respeta el uso exclusivo para vigilancia (sin labores ajenas)?", i: "Desviación de funciones; pérdida de capacidad de respuesta." },
                { p: "¿Existe un protocolo claro de actuación ante emergencias?", i: "Falta de estandarización ante crisis." },
                { p: "¿Se supervisa el desempeño en los puestos de guardia?", i: "Ausencia de control de calidad operativo." },
                { p: "¿Existen bitácoras de servicio protegidas contra alteración?", i: "Falta de trazabilidad legal en incidentes." },
                { p: "¿Se cuenta con un plan de relevos para evitar abandono?", i: "Debilidad operativa ante ausentismo." }
            ]
        },
        {
            nombre: "Equipamiento y Mantenimiento",
            items: [
                { p: "¿Existe mantenimiento documentado para equipo bélico?", i: "Riesgo técnico grave y responsabilidad legal." },
                { p: "¿El armamento cuenta con registro y licencias vigentes?", i: "Ilegalidad en portación; riesgo de incautación." },
                { p: "¿La munición es almacenada en condiciones seguras?", i: "Riesgo de seguridad física y caducidad." },
                { p: "¿Se realizan pruebas periódicas a sistemas de comunicación?", i: "Falla de comunicación en momentos críticos." },
                { p: "¿Existe un inventario centralizado de todo el equipo?", i: "Pérdida de activos y falta de control." }
            ]
        },
        {
            nombre: "Seguridad y Salud Ocupacional",
            items: [
                { p: "¿El personal cuenta con certificaciones vigentes?", i: "Incumplimiento de normativas de competencia." },
                { p: "¿Se suministra el EPP necesario en buen estado?", i: "Riesgo de salud y sanciones laborales." },
                { p: "¿El personal tiene capacitación en primeros auxilios?", i: "Incapacidad de respuesta médica inicial." },
                { p: "¿Existen protocolos de prevención de riesgos ergonómicos?", i: "Riesgo de enfermedades profesionales a largo plazo." },
                { p: "¿Se realizan exámenes médicos periódicos?", i: "Falta de control sobre aptitud física del guardia." }
            ]
        },
        {
            nombre: "Gestión de Riesgos y Continuidad",
            items: [
                { p: "¿Existe un canal anónimo para reportar fallas?", i: "Ausencia de retroalimentación; riesgo oculto." },
                { p: "¿La empresa cuenta con seguro de responsabilidad civil?", i: "Inexposición financiera ante desastres." },
                { p: "¿Se evalúan vulnerabilidades de los sitios custodiados?", i: "Desconocimiento del nivel de riesgo real." },
                { p: "¿Existe plan de contingencia ante brechas de seguridad?", i: "Indefensión ante ciberataques o fugas." },
                { p: "¿Se analizan lecciones aprendidas tras incidentes?", i: "Ciclo de error recurrente por falta de análisis." }
            ]
        }
    ];

    const contenedor = document.getElementById('quiz-container');

    // Renderizar pilares
    pilares.forEach((pilar, pIndex) => {
        contenedor.innerHTML += `<h3>${pilar.nombre}</h3>`;
        pilar.items.forEach((item, iIndex) => {
            contenedor.innerHTML += `
                <div class="pregunta">
                    <p>${item.p}</p>
                    <select id="p-${pIndex}-${iIndex}">
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                    </select>
                </div>
            `;
        });
    });

    document.getElementById('btn-calcular').onclick = () => {
        let totalPuntos = 0;
        let hallazgos = [];

        pilares.forEach((pilar, pIndex) => {
            pilar.items.forEach((item, iIndex) => {
                if (parseInt(document.getElementById(`p-${pIndex}-${iIndex}`).value) === 1) {
                    totalPuntos++;
                } else {
                    hallazgos.push(item.i);
                }
            });
        });

        const resDiv = document.getElementById('resultado');
        let nivel = totalPuntos >= 20 ? "BAJO" : (totalPuntos >= 10 ? "MEDIO" : "CRÍTICO");
        let color = totalPuntos >= 20 ? "#27ae60" : (totalPuntos >= 10 ? "#f39c12" : "#c0392b");

        resDiv.innerHTML = `<h2 style="color: ${color}">Nivel de Riesgo Global: ${nivel} (${totalPuntos}/25)</h2>`;

        if (hallazgos.length > 0) {
            resDiv.innerHTML += `<h3>Hallazgos de Auditoría:</h3><ul style="text-align: left;">`;
            hallazgos.forEach(h => resDiv.innerHTML += `<li>${h}</li>`);
            resDiv.innerHTML += `</ul><a href="mailto:tu-email@ejemplo.com?subject=Solicitud de Auditoría: Sentinel Risk Audit" class="btn-contacto">Solicitar Auditoría Integral</a>`;
        }
    };
});