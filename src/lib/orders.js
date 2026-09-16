const ORDER_HISTORY_KEY = "technest-order-history";

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "{}");
    } catch (error) {
        console.error("Could not read order history:", error);
        return {};
    }
}

export function getStoredOrders(email) {
    if (!email) return [];
    return getHistory()[email.toLowerCase()] || [];
}

export function saveOrderForUser(email, order) {
    if (!email || !order?.orderId) return;
    const history = getHistory();
    const userEmail = email.toLowerCase();
    const currentOrders = history[userEmail] || [];
    history[userEmail] = [order, ...currentOrders.filter((item) => item.orderId !== order.orderId)];
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
}
