const CART_STORAGE_KEY = "technest-cart";
const CART_UPDATED_EVENT = "technest-cart-updated";

function notifyCartUpdated() {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    notifyCartUpdated();
    return cart;
}

export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.productID === product.productID);
    const stock = Number(product.stock ?? 0);
    const requestedQuantity = Math.max(1, Number(quantity) || 1);

    if (existingItem) {
        existingItem.quantity = stock > 0
            ? Math.min(existingItem.quantity + requestedQuantity, stock)
            : existingItem.quantity + requestedQuantity;
    } else {
        cart.push({
            productID: product.productID,
            name: product.name,
            price: Number(product.price ?? 0),
            image: product.images?.[0] || "https://placehold.co/160x120/e2e8f0/475569?text=No+Image",
            stock,
            quantity: stock > 0 ? Math.min(requestedQuantity, stock) : requestedQuantity,
        });
    }

    return saveCart(cart);
}

export function updateCartQuantity(productID, quantity) {
    const cart = getCart()
        .map((item) => item.productID === productID
            ? { ...item, quantity: item.stock > 0 ? Math.min(quantity, item.stock) : quantity }
            : item)
        .filter((item) => item.quantity > 0);

    return saveCart(cart);
}

export function removeFromCart(productID) {
    return saveCart(getCart().filter((item) => item.productID !== productID));
}

export function clearCart() {
    return saveCart([]);
}

export function getCartItemCount(cart = getCart()) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(cart = getCart()) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export { CART_UPDATED_EVENT };
