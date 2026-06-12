// Vollständige mathematische Immobilienberechnung – kein LLM

export interface CalculatorInputs {
  // Kaufpreis & Objekt
  kaufpreis: number;
  wohnflaeche: number;
  stellplaetze: number;
  kaufdatum: string;

  // Kaufnebenkosten
  maklerProzent: number;
  notarProzent: number;
  grundbuchProzent: number;
  grunderwerbsteuerProzent: number;

  // Anfängliche Investitionen
  kueche: number;
  sonstigeInvestitionen: number;

  // Miete
  kaltmieteProQm: number;
  stellplatzMiete: number;

  // Bewirtschaftung
  hausgeldUmlagefaehig: number;   // €/Monat umlagefähig
  hausgeldNichtUmlagefaehig: number; // €/Monat nicht umlagefähig
  verwaltungskostenMonat: number;
  instandhaltungProQmJahr: number;
  mietausfallProzent: number;

  // Steuern
  afaSatz: number;               // % p.a.
  anteilGebaeudeAnKaufpreis: number; // %
  persoenlicherSteuersatz: number; // %
  grundsteuerMonat: number;

  // Prognose
  kostensteigerungPa: number;    // % p.a.
  mietsteigerungPa: number;      // % p.a.
  wertsteigerungPa: number;      // % p.a.

  // Finanzierung Darlehen 1
  d1Summe: number;
  d1Zinssatz: number;
  d1Tilgung: number;

  // Finanzierung Darlehen 2
  d2Summe: number;
  d2Zinssatz: number;
  d2Tilgung: number;

  // Betrachtungszeitraum
  betrachtungsjahreBis: number;  // Jahr z.B. 2040
}

export interface CalculatorResult {
  // Kaufnebenkosten
  maklerBetrag: number;
  notarBetrag: number;
  grundbuchBetrag: number;
  grunderwerbsteuerBetrag: number;
  gesamtNebenkosten: number;
  gesamtInvestition: number;
  eigenkapital: number;

  // Miete
  kaltmieteGesamt: number;         // mit Stellplatz
  betriebskostenUmlagefaehig: number;
  betriebskostenNichtUmlagefaehig: number;
  nettoKaltmiete: number;
  warmmiete: number;

  // Finanzierung
  d1KapitaldienstrMonat: number;
  d1ZinsMonat: number;
  d1TilgungMonat: number;
  d1JahrVollTilgung: number;
  d2KapitaldienstrMonat: number;
  d2ZinsMonat: number;
  d2TilgungMonat: number;
  d2JahrVollTilgung: number;
  gesamtDarlehenssumme: number;
  gesamtKapitaldienst: number;
  zinssatzGewichtet: number;
  anfaenglicheTilgungGewichtet: number;

  // Cashflow heute
  warmmieteCashflow: number;
  bewirtschaftungskostenGesamt: number;
  zinsenMonat: number;
  tilgungMonat: number;
  cashflowOperativ: number;
  afaMonat: number;
  steuernMonat: number;
  cashflowNachSteuern: number;

  // Kennzahlen
  bruttoMietrendite: number;
  nettoMietrendite: number;
  eigenkapitalrendite: number;
  eigenkapitalrenditeOhneWertsteigerung: number;
  kaufpreisfaktor: number;
  nettomietrenditeDisplay: number;

  // AfA
  afaBasisBetrag: number;
  afaJahrBetrag: number;

  // Break-Even
  breakEvenJahr: number;
  breakEvenJahreNachKauf: number;
  breakEvenCashflowPositivJahr: number;

  // Zukunft (Betrachtungszeitraum)
  vermoegenszuwachsMitWertsteigerung: number;
  vermoegenszuwachsOhneWertsteigerung: number;
  immobilienwertZukunft: number;
  restschuldZukunft: number;
  kumulierterCashflowZukunft: number;

  // Profi
  beleihungsreserve: number;
  zinsaenderungsrisiko: number;  // monatliche Mehrbelastung bei +1%
  vermoegenszuwachsJahrBetrag: number;

  // Wertschätzung
  nettomietproJahrZukunft: number;
  wertImmobilieNachFaktor: number;
  wertProQmZukunft: number;
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const {
    kaufpreis, wohnflaeche, stellplaetze,
    maklerProzent, notarProzent, grundbuchProzent, grunderwerbsteuerProzent,
    kueche, sonstigeInvestitionen,
    kaltmieteProQm, stellplatzMiete,
    hausgeldUmlagefaehig, hausgeldNichtUmlagefaehig,
    verwaltungskostenMonat, instandhaltungProQmJahr, mietausfallProzent,
    afaSatz, anteilGebaeudeAnKaufpreis, persoenlicherSteuersatz, grundsteuerMonat,
    kostensteigerungPa, mietsteigerungPa, wertsteigerungPa,
    d1Summe, d1Zinssatz, d1Tilgung,
    d2Summe, d2Zinssatz, d2Tilgung,
    betrachtungsjahreBis,
  } = inputs;

  // ─── Kaufnebenkosten ───
  const maklerBetrag = kaufpreis * (maklerProzent / 100);
  const notarBetrag = kaufpreis * (notarProzent / 100);
  const grundbuchBetrag = kaufpreis * (grundbuchProzent / 100);
  const grunderwerbsteuerBetrag = kaufpreis * (grunderwerbsteuerProzent / 100);
  const gesamtNebenkosten = maklerBetrag + notarBetrag + grundbuchBetrag + grunderwerbsteuerBetrag;
  const anfangsInvestitionen = kueche + sonstigeInvestitionen;
  const gesamtInvestition = kaufpreis + gesamtNebenkosten + anfangsInvestitionen;
  const gesamtDarlehenssumme = d1Summe + d2Summe;
  const eigenkapital = gesamtInvestition - gesamtDarlehenssumme;

  // ─── Miete ───
  const kaltmieteGesamt = wohnflaeche * kaltmieteProQm + stellplaetze * stellplatzMiete;
  const mietausfallBetrag = kaltmieteGesamt * (mietausfallProzent / 100);
  const effektiveKaltmiete = kaltmieteGesamt - mietausfallBetrag;
  const instandhaltungMonat = (wohnflaeche * instandhaltungProQmJahr) / 12;
  const betriebskostenUmlagefaehig = hausgeldUmlagefaehig;
  const betriebskostenNichtUmlagefaehig = hausgeldNichtUmlagefaehig + verwaltungskostenMonat + instandhaltungMonat + grundsteuerMonat;
  const nettoKaltmiete = effektiveKaltmiete - mietausfallBetrag;
  const warmmiete = effektiveKaltmiete + betriebskostenUmlagefaehig;

  // ─── Finanzierung Darlehen 1 ───
  const d1ZinsMonat = d1Summe > 0 ? (d1Summe * (d1Zinssatz / 100)) / 12 : 0;
  const d1TilgungMonat = d1Summe > 0 ? (d1Summe * (d1Tilgung / 100)) / 12 : 0;
  const d1KapitaldienstrMonat = d1ZinsMonat + d1TilgungMonat;
  const d1JahrVollTilgung = d1Summe > 0 && d1Tilgung > 0
    ? new Date().getFullYear() + Math.ceil(Math.log(1 + (d1Zinssatz / 100) / (d1Tilgung / 100)) / Math.log(1 + (d1Zinssatz + d1Tilgung) / 100))
    : 0;

  // ─── Finanzierung Darlehen 2 ───
  const d2ZinsMonat = d2Summe > 0 ? (d2Summe * (d2Zinssatz / 100)) / 12 : 0;
  const d2TilgungMonat = d2Summe > 0 ? (d2Summe * (d2Tilgung / 100)) / 12 : 0;
  const d2KapitaldienstrMonat = d2ZinsMonat + d2TilgungMonat;
  const d2JahrVollTilgung = d2Summe > 0 && d2Tilgung > 0
    ? new Date().getFullYear() + Math.ceil(Math.log(1 + (d2Zinssatz / 100) / (d2Tilgung / 100)) / Math.log(1 + (d2Zinssatz + d2Tilgung) / 100))
    : 0;

  const gesamtKapitaldienst = d1KapitaldienstrMonat + d2KapitaldienstrMonat;
  const zinsenMonat = d1ZinsMonat + d2ZinsMonat;
  const tilgungMonat = d1TilgungMonat + d2TilgungMonat;
  const zinssatzGewichtet = gesamtDarlehenssumme > 0
    ? (d1Summe * d1Zinssatz + d2Summe * d2Zinssatz) / gesamtDarlehenssumme
    : 0;
  const anfaenglicheTilgungGewichtet = gesamtDarlehenssumme > 0
    ? (d1Summe * d1Tilgung + d2Summe * d2Tilgung) / gesamtDarlehenssumme
    : 0;

  // ─── AfA ───
  const afaBasisBetrag = kaufpreis * (anteilGebaeudeAnKaufpreis / 100);
  const afaJahrBetrag = afaBasisBetrag * (afaSatz / 100);
  const afaMonat = afaJahrBetrag / 12;

  // ─── Cashflow heute ───
  const warmmieteCashflow = warmmiete;
  const bewirtschaftungskostenGesamt = betriebskostenNichtUmlagefaehig + betriebskostenUmlagefaehig;
  const cashflowOperativ = effektiveKaltmiete - betriebskostenNichtUmlagefaehig - gesamtKapitaldienst;

  // Steuerberechnung: (Miete - Zinsen - AfA - Verwaltung - Instandhaltung) * Steuersatz
  const zuVersteuernderCashflow = effektiveKaltmiete - zinsenMonat - afaMonat - verwaltungskostenMonat - instandhaltungMonat - grundsteuerMonat - betriebskostenNichtUmlagefaehig;
  const steuernMonat = zuVersteuernderCashflow > 0 ? zuVersteuernderCashflow * (persoenlicherSteuersatz / 100) : 0;
  const cashflowNachSteuern = cashflowOperativ - steuernMonat;

  // ─── Renditekennzahlen ───
  const bruttoMietrendite = gesamtInvestition > 0 ? (kaltmieteGesamt * 12 / gesamtInvestition) * 100 : 0;
  const nettoMietrendite = gesamtInvestition > 0 ? ((effektiveKaltmiete - betriebskostenNichtUmlagefaehig) * 12 / gesamtInvestition) * 100 : 0;
  const kaufpreisfaktor = kaltmieteGesamt > 0 ? kaufpreis / (kaltmieteGesamt * 12) : 0;
  const nettomietrenditeDisplay = nettoMietrendite;

  // Eigenkapitalrendite (Cashflow nach Steuern + Tilgung) / EK
  const gesamtRueckflussJahr = (cashflowNachSteuern + tilgungMonat) * 12;
  const eigenkapitalrendite = eigenkapital > 0 ? (gesamtRueckflussJahr / eigenkapital) * 100 : 0;
  const eigenkapitalrenditeOhneWertsteigerung = eigenkapital > 0 ? ((cashflowNachSteuern * 12) / eigenkapital) * 100 : 0;

  // ─── Zukunftsberechnung ───
  const jahre = Math.max(1, betrachtungsjahreBis - new Date().getFullYear());
  const immobilienwertZukunft = kaufpreis * Math.pow(1 + wertsteigerungPa / 100, jahre);

  // Restschuld berechnen (vereinfacht)
  let restschuld = gesamtDarlehenssumme;
  for (let j = 0; j < jahre; j++) {
    const zinsJahr = restschuld * (zinssatzGewichtet / 100);
    const tilgungJahr = Math.min(gesamtKapitaldienst * 12 - zinsJahr, restschuld);
    restschuld = Math.max(0, restschuld - tilgungJahr);
  }
  const restschuldZukunft = restschuld;

  const kumulierterCashflowZukunft = cashflowNachSteuern * 12 * jahre;
  const vermoegenszuwachsMitWertsteigerung = immobilienwertZukunft - restschuldZukunft - eigenkapital + kumulierterCashflowZukunft;
  const vermoegenszuwachsOhneWertsteigerung = kaufpreis - restschuldZukunft - eigenkapital + kumulierterCashflowZukunft;
  const vermoegenszuwachsJahrBetrag = immobilienwertZukunft - kaufpreis;

  // Break-Even: Jahr in dem kumulierter Cashflow positiv wird
  let kumuliert = -eigenkapital;
  let breakEvenJahr = 0;
  let breakEvenCashflowPositivJahr = 0;
  for (let j = 1; j <= 40; j++) {
    kumuliert += cashflowNachSteuern * 12;
    if (kumuliert >= 0 && breakEvenJahr === 0) {
      breakEvenJahr = new Date().getFullYear() + j;
    }
    if (cashflowNachSteuern > 0 && breakEvenCashflowPositivJahr === 0) {
      breakEvenCashflowPositivJahr = new Date().getFullYear();
    }
  }
  const breakEvenJahreNachKauf = breakEvenJahr > 0 ? breakEvenJahr - new Date().getFullYear() : 99;

  // Beleihungsreserve (Immobilienwert * 80% - Restschuld)
  const beleihungsreserve = immobilienwertZukunft * 0.8 - restschuldZukunft;

  // Zinsänderungsrisiko: monatliche Mehrbelastung bei +1%
  const zinsaenderungsrisiko = gesamtDarlehenssumme * 0.01 / 12;

  // Wertschätzung Zukunft
  const nettomietproJahrZukunft = (effektiveKaltmiete - betriebskostenNichtUmlagefaehig) * 12 * Math.pow(1 + mietsteigerungPa / 100, jahre);
  const wertImmobilieNachFaktor = nettomietproJahrZukunft * kaufpreisfaktor;
  const wertProQmZukunft = wohnflaeche > 0 ? wertImmobilieNachFaktor / wohnflaeche : 0;

  return {
    maklerBetrag, notarBetrag, grundbuchBetrag, grunderwerbsteuerBetrag,
    gesamtNebenkosten, gesamtInvestition, eigenkapital,
    kaltmieteGesamt, betriebskostenUmlagefaehig, betriebskostenNichtUmlagefaehig,
    nettoKaltmiete, warmmiete,
    d1KapitaldienstrMonat, d1ZinsMonat, d1TilgungMonat, d1JahrVollTilgung,
    d2KapitaldienstrMonat, d2ZinsMonat, d2TilgungMonat, d2JahrVollTilgung,
    gesamtDarlehenssumme, gesamtKapitaldienst, zinssatzGewichtet, anfaenglicheTilgungGewichtet,
    zinsenMonat, tilgungMonat,
    warmmieteCashflow, bewirtschaftungskostenGesamt,
    cashflowOperativ, afaMonat, steuernMonat, cashflowNachSteuern,
    bruttoMietrendite, nettoMietrendite, eigenkapitalrendite, eigenkapitalrenditeOhneWertsteigerung,
    kaufpreisfaktor, nettomietrenditeDisplay, afaBasisBetrag, afaJahrBetrag,
    breakEvenJahr, breakEvenJahreNachKauf, breakEvenCashflowPositivJahr,
    vermoegenszuwachsMitWertsteigerung, vermoegenszuwachsOhneWertsteigerung,
    immobilienwertZukunft, restschuldZukunft, kumulierterCashflowZukunft,
    beleihungsreserve, zinsaenderungsrisiko, vermoegenszuwachsJahrBetrag,
    nettomietproJahrZukunft, wertImmobilieNachFaktor, wertProQmZukunft,
  };
}
