/**
 * Every active ISO 4217 currency, sorted by name.
 *
 * Codes and the currency list: ISO 4217 List One (SIX Group, published 2026-09-17),
 *   https://www.six-group.com/en/products-services/financial-information/data-standards.html
 * Symbols: Wikipedia, "List of circulating currencies" (the Symbol column), checked
 *   against each currency's own Wikipedia article, retrieved 2026-11-12.
 *   https://en.wikipedia.org/wiki/List_of_circulating_currencies
 * A comment marks every entry that differs from that column, with the reason.
 *
 * Symbols are what countries write locally, so several currencies share one
 * (many use "$"). The ISO code is therefore what gets stored; the symbol is
 * what's shown and printed.
 */
export interface ICurrency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: ICurrency[] = [
  { code: "AFN", name: "Afghan Afghani", symbol: "؋‎" },
  { code: "ALL", name: "Albanian Lek", symbol: "L" },
  { code: "DZD", name: "Algerian Dinar", symbol: "DA" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏" },
  { code: "AWG", name: "Aruban Florin", symbol: "ƒ" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "$" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "BBD", name: "Barbadian Dollar", symbol: "$" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br" }, // National Bank of Belarus symbol 'Br' (table shows an image)
  { code: "BZD", name: "Belize Dollar", symbol: "$" },
  { code: "BMD", name: "Bermudan Dollar", symbol: "$" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu" },
  { code: "VED", name: "Bolívar Soberano", symbol: "Bs.D" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", symbol: "KM" },
  { code: "BWP", name: "Botswanan Pula", symbol: "P" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "BND", name: "Brunei Dollar", symbol: "$" }, // Brunei dollar
  { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "$" }, // Cape Verdean escudo uses the cifrão, written as $ in text (table shows an image)
  { code: "XCG", name: "Caribbean guilder", symbol: "Cg" }, // Caribbean guilder abbreviation Cg
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "$" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "F.CFA" }, // Central African CFA franc
  { code: "XPF", name: "CFP Franc", symbol: "₣" }, // CFP franc
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "KMF", name: "Comorian Franc", symbol: "FC" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡" },
  { code: "CUP", name: "Cuban Peso", symbol: "$" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" },
  { code: "DOP", name: "Dominican Peso", symbol: "$" },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "EC$" },
  { code: "EGP", name: "Egyptian Pound", symbol: "LE" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk" }, // Eritrean nakfa (table typo 'Nkf'; article infobox Nfk)
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "FKP", name: "Falkland Islands Pound", symbol: "£" },
  { code: "FJD", name: "Fijian Dollar", symbol: "$" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "GIP", name: "Gibraltar Pound", symbol: "£" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
  { code: "GNF", name: "Guinean Franc", symbol: "Fr" },
  { code: "GYD", name: "Guyanaese Dollar", symbol: "$" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼" }, // Iranian rial sign (article infobox)
  { code: "IQD", name: "Iraqi Dinar", symbol: "ID" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" }, // Kenyan shilling abbreviation KSh
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD" },
  { code: "KGS", name: "Kyrgyz Som", symbol: "с" }, // Kyrgyz som sign ⃀ not in fonts yet; article gives the letter с
  { code: "LAK", name: "Laotian Kip", symbol: "₭" },
  { code: "LBP", name: "Lebanese Pound", symbol: "LL" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L" }, // Lesotho loti
  { code: "LRD", name: "Liberian Dollar", symbol: "$" },
  { code: "LYD", name: "Libyan Dinar", symbol: "LD" },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$" }, // Macanese pataca
  { code: "MKD", name: "Macedonian Denar", symbol: "den" }, // Macedonian denar abbreviation den
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "K" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf" }, // Rufiyaa sign ⃂ not in fonts yet; article abbreviation Rf
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "Rs" }, // Mauritian rupee
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L" }, // Moldovan leu abbreviation L
  { code: "MNT", name: "Mongolian Tugrik", symbol: "₮" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
  { code: "MZN", name: "Mozambican Metical", symbol: "Mt" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K" }, // Myanmar kyat
  { code: "NAD", name: "Namibian Dollar", symbol: "$" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रु" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KPW", name: "North Korean Won", symbol: "₩" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "OMR", name: "Omani Rial", symbol: "RO" }, // Omani rial sign ⃄ (2025) not in fonts yet; abbreviation RO
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs" }, // Pakistani rupee
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/." }, // Panamanian balboa B/. (table truncated)
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K" },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "₲" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" }, // Romanian leu, plural lei as written on prices
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
  { code: "SVC", name: "Salvadoran Colón", symbol: "₡" }, // Salvadoran colón (article infobox)
  { code: "WST", name: "Samoan Tala", symbol: "$" },
  { code: "STN", name: "São Tomé & Príncipe Dobra", symbol: "Db" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SR" }, // Saudi riyal sign ⃁ (2025) not in fonts on many devices yet; abbreviation SR
  { code: "RSD", name: "Serbian Dinar", symbol: "DIN" }, // Serbian dinar abbreviation DIN
  { code: "SCR", name: "Seychellois Rupee", symbol: "Rs" }, // Seychellois rupee
  { code: "SLE", name: "Sierra Leonean Leone", symbol: "Le" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" }, // Singapore dollar
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "$" },
  { code: "SOS", name: "Somali Shilling", symbol: "Sh.So." }, // Somali shilling sign Sh.So.
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "SS£" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" }, // Sri Lankan rupee
  { code: "SHP", name: "St. Helena Pound", symbol: "£" },
  { code: "SDG", name: "Sudanese Pound", symbol: "LS" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$" },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L" }, // Swazi lilangeni
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr." }, // Swiss franc official symbol Fr.
  { code: "SYP", name: "Syrian Pound", symbol: "LS" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "SM" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" }, // Tanzanian shilling abbreviation TSh
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$" },
  { code: "TTD", name: "Trinidad & Tobago Dollar", symbol: "$" },
  { code: "TND", name: "Tunisian Dinar", symbol: "DT" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TMT", name: "Turkmenistani Manat", symbol: "m" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" }, // Ugandan shilling abbreviation USh
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "Dh" }, // UAE dirham sign ⃃ (2025) not in fonts yet; article abbreviation Dh
  { code: "UYU", name: "Uruguayan Peso", symbol: "$" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "soʻm" }, // Uzbekistani soʻm (no symbol listed; currency name in Uzbek Latin)
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT" },
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.S" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "XOF", name: "West African CFA Franc", symbol: "F.CFA" }, // West African CFA franc
  { code: "YER", name: "Yemeni Rial", symbol: "﷼" }, // Yemeni rial sign (article lead)
  { code: "ZMW", name: "Zambian Kwacha", symbol: "K" },
  { code: "ZWG", name: "Zimbabwean Gold", symbol: "ZiG" },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export const findCurrency = (code: unknown): ICurrency | undefined =>
  typeof code === "string" ? BY_CODE.get(code) : undefined;

export const isKnownCurrency = (code: unknown): code is string => findCurrency(code) !== undefined;
