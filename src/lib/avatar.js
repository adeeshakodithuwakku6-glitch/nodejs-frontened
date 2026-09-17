const manAvatar = "http://localhost:3000/src/man%20avatar.jfif";
const womanAvatar = "http://localhost:3000/src/woman%20avatar.jfif";
const otherAvatar = "http://localhost:3000/src/other%20avatar.jfif";

export function getDefaultAvatar(gender) {
    if (gender === "male") return manAvatar;
    if (gender === "female") return womanAvatar;
    return otherAvatar;
}

export function isPlaceholderImage(value) {
    return !value || /^profile(?:\s+image)?$/i.test(String(value).trim());
}

export function isDefaultAvatarUrl(value) {
    return [manAvatar, womanAvatar, otherAvatar].includes(value);
}
