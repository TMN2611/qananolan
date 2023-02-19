
async function textAreaSpace(textString) {
    const lines = textString.split('\n');
    const newText = lines.map(line => {
        return {descText:line.trim(),emoji:'✔️'}
    })
    return newText;
}
async function inputSpace(textString) {
    const lines = textString.split(' ');
    return lines;

}

module.exports = { textAreaSpace,inputSpace };
