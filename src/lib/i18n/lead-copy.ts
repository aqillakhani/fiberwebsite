/**
 * Every string the lead form and door page show, in English and Spanish. Keep this file free of
 * server/client-only imports. Spanish consent wording is pending counsel review (see lib/consent.ts).
 */
import { CONSENT_TEXT, CONSENT_TEXT_ES, CONSENT_TEXT_VERSION, CONSENT_TEXT_VERSION_ES } from "@/lib/consent";
import type { PreferredSpeed } from "@/lib/validations/lead-schema";

export const LANGUAGES = ["en", "es"] as const;
export type Language = (typeof LANGUAGES)[number];
export const LANGUAGE_COOKIE = "ffusa_lang";
export const LANGUAGE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export function isLanguage(value: string | null | undefined): value is Language {
  return (LANGUAGES as readonly string[]).includes(value ?? "");
}

interface ResultText {
  headline: string;
  detail: string;
}

export interface LeadCopy {
  toggleLabel: string;
  consentText: string;
  consentTextVersion: string;
  address: {
    label: string;
    labelRep: string;
    placeholder: string;
    check: string;
    checking: string;
    hint: string;
    unresolved: string;
    changeAddress: string;
  };
  result: {
    liveVerified: (isp: string, street: string) => ResultText;
    liveNearby: (isp: string) => ResultText;
    comingSoon: (isp: string) => ResultText;
    unknown: (street: string) => ResultText;
    ctaPublic: string;
    ctaComingSoon: string;
  };
  contact: {
    providerLegend: string;
    providerLegendRep: string;
    bestOption: string;
    otherProvider: string;
    speedLegend: string;
    speedUnsure: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneHint: string;
    email: string;
    dateOfBirth: string;
    dateOfBirthHint: string;
    currentProvider: string;
    selectOne: string;
    noInternet: string;
    otherCurrent: string;
    sending: string;
  };
  done: {
    requestNumber: string;
    thanks: (firstName: string) => string;
    sentToCloser: string;
    callSoon: (minutes: number, phone: string) => string;
    comingSoon: (isp: string) => string;
    repNext: (minutes: number) => string;
    nextTitle: string;
    steps: (minutes: number) => readonly string[];
    callNow: (phone: string) => string;
    textInstead: string;
    textNoted: string;
    nextDoor: string;
    queuedTitle: string;
    queuedDetail: string;
  };
  door: {
    verified: string;
    headline: string;
    badges: readonly string[];
    footer: string;
  };
}

const EN: LeadCopy = {
  toggleLabel: "Español",
  consentText: CONSENT_TEXT,
  consentTextVersion: CONSENT_TEXT_VERSION,
  address: {
    label: "Street address",
    labelRep: "Homeowner's street address",
    placeholder: "123 Main St, City, ST 12345",
    check: "Check address",
    checking: "Checking",
    hint: "We check the fiber footprint for this exact address. No credit check, no payment.",
    unresolved: "We couldn't find that address. Pick one from the list or add the city and ZIP.",
    changeAddress: "Change address",
  },
  result: {
    liveVerified: (isp, street) => ({
      headline: `Good news — fiber is live at ${street}.`,
      detail: `Our map shows ${isp} at this exact address. Tell us which provider and speed you want; we find the best promo available to you.`,
    }),
    liveNearby: (isp) => ({
      headline: "Fiber appears to serve your street.",
      detail: `Our map shows ${isp} on nearby homes. Tell us which provider and speed you want; we confirm the best offer on a quick call.`,
    }),
    comingSoon: (isp) => ({
      headline: `${isp} fiber is coming to your neighborhood.`,
      detail: "Tell us what you want and we call you the day it goes live — or sooner if another provider already serves you.",
    }),
    unknown: (street) => ({
      headline: `We'll check every provider at ${street}.`,
      detail: "Tell us which provider and speed you want. A specialist checks all of them by hand and calls you with the best offer.",
    }),
    ctaPublic: "Get my best offer",
    ctaComingSoon: "Put me on the list",
  },
  contact: {
    providerLegend: "Which provider do you want?",
    providerLegendRep: "Which provider are you pitching?",
    bestOption: "Find me the best option",
    otherProvider: "Other",
    speedLegend: "What speed do you want?",
    speedUnsure: "Not sure — advise me",
    firstName: "First name",
    lastName: "Last name",
    phone: "Mobile number",
    phoneHint: "We call this number",
    email: "Email",
    dateOfBirth: "Date of birth (optional)",
    dateOfBirthHint: "Speeds up the order",
    currentProvider: "Current internet provider (optional)",
    selectOne: "Select one",
    noInternet: "No internet right now",
    otherCurrent: "Other",
    sending: "Sending…",
  },
  done: {
    requestNumber: "Request number",
    thanks: (firstName) => `Thanks, ${firstName} — you're in the queue.`,
    sentToCloser: "Sent to the closing team.",
    callSoon: (minutes, phone) => `A fiber specialist calls you within about ${minutes} minutes from ${phone}. Calls are recorded for quality.`,
    comingSoon: (isp) => `We'll call the day ${isp} Fiber goes live at this address. Keep this number handy.`,
    repNext: (minutes) => `A closer calls the homeowner within about ${minutes} minutes on a recorded line. Tell them to expect the call.`,
    nextTitle: "What happens next",
    steps: (minutes) => [
      `Within ~${minutes} min a specialist calls you. Save our number so you recognize it.`,
      "On the call they shop every provider at your address and read you the best promo and price.",
      "If you like it, they place the order and book your free installation. Nothing to pay online.",
    ],
    callNow: (phone) => `Call us now: ${phone}`,
    textInstead: "Text me instead",
    textNoted: "Got it — we'll text you first.",
    nextDoor: "Next door",
    queuedTitle: "No signal — saved on this phone.",
    queuedDetail: "The lead is stored on this device and sends itself to the closing team the moment the connection returns. Keep this page open or come back to it; do not clear the browser.",
  },
  door: {
    verified: "Verified FiberFastUSA representative",
    headline: "Let's see which fiber is live at this address.",
    badges: ["No contract", "Free install", "No data caps", "Nothing to pay today"],
    footer: "FiberFastUSA · A specialist calls the homeowner on a recorded line.",
  },
};

const ES: LeadCopy = {
  toggleLabel: "English",
  consentText: CONSENT_TEXT_ES,
  consentTextVersion: CONSENT_TEXT_VERSION_ES,
  address: {
    label: "Dirección",
    labelRep: "Dirección del propietario",
    placeholder: "123 Main St, Ciudad, TX 12345",
    check: "Verificar dirección",
    checking: "Verificando",
    hint: "Revisamos la cobertura de fibra para esta dirección exacta. Sin verificación de crédito, sin pago.",
    unresolved: "No encontramos esa dirección. Elija una de la lista o agregue la ciudad y el código postal.",
    changeAddress: "Cambiar dirección",
  },
  result: {
    liveVerified: (isp, street) => ({
      headline: `Buenas noticias: hay fibra activa en ${street}.`,
      detail: `Nuestro mapa muestra ${isp} en esta dirección exacta. Díganos qué proveedor y velocidad quiere; buscamos la mejor promoción disponible para usted.`,
    }),
    liveNearby: (isp) => ({
      headline: "Parece que la fibra llega a su calle.",
      detail: `Nuestro mapa muestra ${isp} en casas cercanas. Díganos qué proveedor y velocidad quiere; confirmamos la mejor oferta en una llamada rápida.`,
    }),
    comingSoon: (isp) => ({
      headline: `La fibra de ${isp} llegará pronto a su vecindario.`,
      detail: "Díganos qué quiere y le llamamos el día que se active, o antes si otro proveedor ya le da servicio.",
    }),
    unknown: (street) => ({
      headline: `Revisaremos todos los proveedores en ${street}.`,
      detail: "Díganos qué proveedor y velocidad quiere. Un especialista los revisa todos a mano y le llama con la mejor oferta.",
    }),
    ctaPublic: "Quiero mi mejor oferta",
    ctaComingSoon: "Anótenme en la lista",
  },
  contact: {
    providerLegend: "¿Qué proveedor quiere?",
    providerLegendRep: "¿Qué proveedor está ofreciendo?",
    bestOption: "Búsquenme la mejor opción",
    otherProvider: "Otro",
    speedLegend: "¿Qué velocidad quiere?",
    speedUnsure: "No estoy seguro, aconséjenme",
    firstName: "Nombre",
    lastName: "Apellido",
    phone: "Número de celular",
    phoneHint: "Llamamos a este número",
    email: "Correo electrónico",
    dateOfBirth: "Fecha de nacimiento (opcional)",
    dateOfBirthHint: "Agiliza el pedido",
    currentProvider: "Proveedor de internet actual (opcional)",
    selectOne: "Seleccione uno",
    noInternet: "Sin internet por ahora",
    otherCurrent: "Otro",
    sending: "Enviando…",
  },
  done: {
    requestNumber: "Número de solicitud",
    thanks: (firstName) => `Gracias, ${firstName}: ya está en la fila.`,
    sentToCloser: "Enviado al equipo de cierre.",
    callSoon: (minutes, phone) => `Un especialista en fibra le llama en unos ${minutes} minutos desde el ${phone}. Las llamadas se graban por calidad.`,
    comingSoon: (isp) => `Le llamaremos el día que la fibra de ${isp} se active en esta dirección. Guarde este número.`,
    repNext: (minutes) => `Un cerrador llama al propietario en unos ${minutes} minutos por una línea grabada. Avísele que espere la llamada.`,
    nextTitle: "Qué sigue",
    steps: (minutes) => [
      `En unos ${minutes} min un especialista le llama. Guarde nuestro número para reconocerlo.`,
      "En la llamada revisa todos los proveedores en su dirección y le lee la mejor promoción y precio.",
      "Si le gusta, hace el pedido y agenda su instalación gratis. No se paga nada en línea.",
    ],
    callNow: (phone) => `Llámenos ahora: ${phone}`,
    textInstead: "Prefiero mensaje de texto",
    textNoted: "Listo: le escribimos primero por texto.",
    nextDoor: "Siguiente casa",
    queuedTitle: "Sin señal: guardado en este teléfono.",
    queuedDetail: "La solicitud queda guardada en este dispositivo y se envía sola al equipo de cierre en cuanto vuelva la conexión. Mantenga esta página abierta o vuelva a ella; no borre el navegador.",
  },
  door: {
    verified: "Representante verificado de FiberFastUSA",
    headline: "Veamos qué fibra está activa en esta dirección.",
    badges: ["Sin contrato", "Instalación gratis", "Sin límites de datos", "No se paga nada hoy"],
    footer: "FiberFastUSA · Un especialista llama al propietario por una línea grabada.",
  },
};

export const LEAD_COPY: Record<Language, LeadCopy> = { en: EN, es: ES };

/** Speed chip labels per language ("1 Gig" etc. read the same in both). */
export function speedLabel(speed: PreferredSpeed, language: Language, englishLabel: string): string {
  if (speed === "unsure") return LEAD_COPY[language].contact.speedUnsure;
  if (language === "es" && speed === "300") return "Hasta 300 Mbps";
  return englishLabel;
}
