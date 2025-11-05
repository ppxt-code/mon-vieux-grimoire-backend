
function isInvalidText(string) {
    // Interdire certains caractères spéciaux souvent
    // utilisés dans les attaques XSS, tels que { } ; : < > " / \ etc. 
    // mais on est obligé d'accepter '
    const textRegex = /^[a-zA-Z0-9!@#$%^&*()\-_+=. ']*$/;
    if (!textRegex.test(string)) return true;
    return false;
}
module.exports = { isInvalidText };