const accounting = require('accounting');

accounting.settings = {
	currency: {
		symbol : "R$",   // default currency symbol is '$'
		format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
		decimal : ",",  // decimal point separator
		thousand: ".",  // thousands separator
		precision : 2   // decimal places
	},
	number: {
		precision : 2,  // default precision on numbers is 0
    decimal : ",",  // decimal point separator
		thousand: ".",  // thousands separator
	}
}

// These can be changed externally to edit the library's defaults:
accounting.settings.currency.format = "%s %v";

// Format can be an object, with `pos`, `neg` and `zero`:
accounting.settings.currency.format = {
	pos : "%s %v",   // for positive values, eg. "$ 1.00" (required)
	neg : "%s (%v)", // for negative values, eg. "$ (1.00)" [optional]
	zero: "%s  0,00 "  // for zero values, eg. "$  --" [optional]
};
