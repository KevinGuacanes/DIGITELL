const auditEvent = (event) => {
    switch (event) {
        case "created":
            return "creado";
        case "updated":
            return "actualizado";
        case "deleted":
            return "eliminado";
        case "restored":
            return "restaurado";
        case "role_change":
            return "cambio de rol";
        default:
            return event;
    }
};

export const transformAuditData = (audits) => {
    const data = {
        labels: [],
        datasets: {
            creado: [],
            actualizado: [],
            eliminado: [],
            restaurado: [],
            "cambio de rol": [],
        },
    };

    const userTableMap = {};

    audits.forEach((audit) => {
        if (
            !audit.user ||
            !audit.user.username ||
            !audit.modified_table ||
            !audit.modified_table.table_name ||
            !audit.event
        ) {
            return;
        }

        const user = audit.user.username;
        const table = audit.modified_table.table_name;
        const event = auditEvent(audit.event);

        const key = `${user} - ${table}`;

        if (!userTableMap[key]) {
            userTableMap[key] = {
                creado: 0,
                actualizado: 0,
                eliminado: 0,
                restaurado: 0,
                "cambio de rol": 0,
            };
            data.labels.push(key);
        }

        userTableMap[key][event] += 1;
    });

    data.labels.forEach((label) => {
        data.datasets.creado.push(userTableMap[label].creado);
        data.datasets.actualizado.push(userTableMap[label].actualizado);
        data.datasets.eliminado.push(userTableMap[label].eliminado);
        data.datasets.restaurado.push(userTableMap[label].restaurado);
        data.datasets["cambio de rol"].push(
            userTableMap[label]["cambio de rol"],
        );
    });

    return data;
};

export const transformRoleActivityData = (audits) => {
    const roleActivity = {};

    audits.forEach((audit) => {
        if (!audit.user_roles || !Array.isArray(audit.user_roles)) {
            return;
        }

        audit.user_roles.forEach((role) => {
            if (!roleActivity[role]) {
                roleActivity[role] = 0;
            }
            roleActivity[role]++;
        });
    });

    return {
        labels: Object.keys(roleActivity),
        datasets: [
            {
                data: Object.values(roleActivity),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };
};

export const transformEntityActivityData = (audits) => {
    const entityActivity = {};
    audits.forEach((audit) => {
        if (!audit.auditable_type) {
            return;
        }

        const entity = audit.auditable_type.split("\\").pop();
        if (!entityActivity[entity]) {
            entityActivity[entity] = 0;
        }
        entityActivity[entity]++;
    });

    return {
        labels: Object.keys(entityActivity),
        datasets: [
            {
                label: "Actividad por Entidad",
                data: Object.values(entityActivity),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };
};

export const transformTimelineData = (audits) => {
    const timeline = {};
    audits.forEach((audit) => {
        if (!audit.created_at) {
            return;
        }

        const date = audit.created_at.split("T")[0];
        if (!timeline[date]) {
            timeline[date] = 0;
        }
        timeline[date]++;
    });

    return {
        labels: Object.keys(timeline).sort(),
        datasets: [
            {
                label: "Actividad Diaria",
                data: Object.keys(timeline)
                    .sort()
                    .map((key) => timeline[key]),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };
};

export const transformEventCounts = (audits) => {
    const eventCounts = {
        creado: 0,
        actualizado: 0,
        eliminado: 0,
        restaurado: 0,
        "cambio de rol": 0,
    };

    audits.forEach((audit) => {
        if (!audit.event) return;

        const event = auditEvent(audit.event);
        if (eventCounts.hasOwnProperty(event)) {
            eventCounts[event] += 1;
        }
    });

    return eventCounts;
};
