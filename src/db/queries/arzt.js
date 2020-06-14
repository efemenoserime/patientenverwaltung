/**
 * Setzt Anwender als Patient eines gewissen Arztes
 * @param {String} arzt_email Email des betreuenden Arztes
 * @param {String} patient_email Email des zu betreuenden Patienten
 * @param {Object} anwender Object mit `patienten` und `aerzte` Array
 * @throws Wirft Fehler aus wenn Patient bereits durch den angegebenen Arzt betreut wird und wenn `arzt_email` oder `patienten_email` nicht im System zu finden sind.
 * @returns Gibt modifizierten Arzt zurück
 */
export const setPatient = (arzt_email, patient_email, anwender) => {
  let arzt;
  let patient;

  // Überprüfe ob ein Arzt mit dieser Email Adresse existiert
  anwender.aerzte.forEach((dr) => {
    if (dr.email === arzt_email) {
      arzt = dr;
    }
  });

  // Überprüfe ob ein Patient mit dieser Email Adresse existiert
  anwender.patienten.forEach((pat) => {
    if (pat.email === patient_email) {
      patient = pat;
    }
  });

  if (!arzt) {
    throw Error('Es existiert kein Arzt mit dieser Email Adresse');
  } else if (!patient) {
    throw Error('Es existiert kein Patient mit dieser Email Adresse');
  } else {
    // Überprüfen ob patienten Array bereits existiert
    if (arzt.patienten) {
      // Anschließend überprüfen, ob Patient bereits angelegt wurde
      arzt.patienten.forEach((patient) => {
        // Wenn ja, werfe Fehler
        throw Error('Patient wird bereits vom diesem Arzt betreut');
      });
      // Andernfalls füge patient zum Array hinzu
      arzt.patienten.push(patient);
    }
    // Wenn Array nicht existent ist, lege Array an
    else {
      arzt.patienten = [];
      arzt.patienten.push(patient);
    }
  }

  return arzt;
};
