export const clients = [];

export const broadcast = (data) => {
    clients.forEach(c => {
        try {
            c.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (e) {
            console.error("SSE Broadcast Error:", e);
        }
    });
};
