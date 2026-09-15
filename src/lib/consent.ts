/**
 * TCPA express-written-consent text shown next to the (unchecked) checkbox on every lead form.
 * Bump the version whenever the wording changes; the version + timestamp + IP + UA are stored
 * with each lead so we can prove exactly what the homeowner agreed to. Wording pending counsel review.
 */
export const CONSENT_TEXT_VERSION = "2026-09-11.v1";

export const CONSENT_TEXT =
  "By checking this box I agree that FiberFast USA may call and text me at the number provided about fiber " +
  "internet at this address, including with automated technology and prerecorded messages. Calls may be " +
  "recorded. Consent is not a condition of purchase; message and data rates may apply; reply STOP to opt out.";

/** Spanish rendering of the same consent (added 2026-09-15; counsel should confirm the translation). */
export const CONSENT_TEXT_VERSION_ES = "2026-09-15.v1-es";

export const CONSENT_TEXT_ES =
  "Al marcar esta casilla acepto que FiberFast USA me llame y me envíe mensajes de texto al número indicado " +
  "sobre internet de fibra en esta dirección, incluso con tecnología automatizada y mensajes pregrabados. Las " +
  "llamadas pueden grabarse. El consentimiento no es condición de compra; pueden aplicar tarifas de mensajes y " +
  "datos; responda STOP para cancelar.";
