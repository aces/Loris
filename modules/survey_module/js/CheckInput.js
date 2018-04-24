/**
 *  Check if the input is supported by the Browser
 */
function checkInput(type) {
    var input = document.createElement("input");
    input.setAttribute("type", type);
    return input.type == type;
}
