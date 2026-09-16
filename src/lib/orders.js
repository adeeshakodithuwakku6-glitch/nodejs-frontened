const ORDER_HISTORY_KEY = "technest-order-history";
const ALL_ORDERS_KEY = "technest-all-orders";

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "{}");
    } catch (error) {
        console.error("Could not read order history:", error);
        return {};
    }
}

function getAllOrders() {
    try {
        return JSON.parse(localStorage.getItem(ALL_ORDERS_KEY) || "[]");
    } catch (error) {
        console.error("Could not read all orders:", error);
        return [];
    }
}

export function getStoredOrders(email) {
    if (!email) return [];
    return getHistory()[email.toLowerCase()] || [];
}

export function getAllStoredOrders() {
    return getAllOrders();
}

export function saveOrderForUser(email, order) {
    const normalizedOrder = { ...order };
    const resolvedEmail = email || normalizedOrder.customerEmail || normalizedOrder.email;
    const orderId = normalizedOrder.orderId || normalizedOrder._id || normalizedOrder.id || normalizedOrder.orderID;

    if (!resolvedEmail || !orderId) return;

    normalizedOrder.orderId = orderId;
    normalizedOrder.customerEmail = normalizedOrder.customerEmail || resolvedEmail;
    normalizedOrder.email = normalizedOrder.email || resolvedEmail;

    const history = getHistory();
    const userEmail = resolvedEmail.toLowerCase();
    const currentOrders = history[userEmail] || [];

    history[userEmail] = [normalizedOrder, ...currentOrders.filter((item) => (item.orderId || item._id || item.id || item.orderID) !== orderId)];
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));

    const allOrders = getAllOrders();
    const mergedOrders = [normalizedOrder, ...allOrders.filter((item) => (item.orderId || item._id || item.id || item.orderID) !== orderId)];
    localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(mergedOrders));
}
