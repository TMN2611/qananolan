
async function numberToMoney(price) {
    const stringPrice = `${price}`;
    return stringPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ' ' +  '  VND';
}

module.exports = { numberToMoney };
