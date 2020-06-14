import { anwender } from '../../mock.json';
import argon from 'argon2';
import * as EmailValidator from 'email-validator';
import { collectArzt, setPatient } from '../db/queries/arzt';

/**
 * Controller zum Auflisten aller Ärzte im System.
 * @param {Request} req
 * @param {Response} res
 */
export const listAerzte = (req, res) => {
  res.status(200).send(anwender.aerzte).end();
};

/**
 * Legt Arzt an, falls die Daten im JSON Body den Anforderungen
 * entsprechen.
 * @param {Request} req
 * @param {Response} res
 */
export const erstelleArzt = async (req, res) => {
  // Erzeuge initiales Error Array
  const errors = [];
  const { name, email, titel, passwort } = req.body;

  // Überprüfen ob notwendige Daten vorhanden
  if (!name) {
    errors.push({
      msg: 'Notwendiges Feld',
      value: name,
      field: 'name',
    });
  }
  if (!passwort) {
    errors.push({
      msg: 'Notwendiges Feld',
      value: passwort,
      field: 'passwort',
    });
  }
  if (!email) {
    errors.push({
      msg: 'Notwendiges Feld',
      value: email,
      field: 'email',
    });
  }

  // Überprüfe Format der Email Adresse auf Richtigkeit
  const isEmail = EmailValidator.validate(email);
  if (!isEmail) {
    errors.push({
      msg: 'Keine gültige Email Adresse',
      value: email,
      field: 'email',
    });
  }

  let users = [...anwender.patienten, ...anwender.aerzte];

  // Überprüfe, ob bereits ein Anwender mit der angegebenen Email existiert
  users.forEach((user) => {
    if (user.email === email) {
      errors.push({
        msg: 'Email existiert bereits',
        value: email,
        field: 'email',
      });
    }
  });

  // Erzeuge neuen Arzt
  const neuerArzt = {
    name,
    email,
  };

  // Erzeuge Hash
  await argon
    .hash(passwort)
    .then((hash) => {
      // Setze Passwort mit dem verschlüsseltem Kennwort gleich
      neuerArzt.passwort = hash;
    })
    .catch((err) => {
      // Füge Fehler zu errors Array hinzu
      errors.push(err);
    });

  // Sende error response, falls Fehler während der Validierung aufgetreten sind
  if (errors.length > 0) {
    res.status(400).send({ success: false, errors }).end();
  } else {
    // Erweitere Object mit titel Attribut, falls existent
    titel ? (neuerArzt.titel = titel) : null;

    // Füge neuen Arzt zu bestehenden Ärzten hinzu
    anwender.aerzte.push(neuerArzt);

    // Sende Antwort mit 201 status code
    res
      .status(201)
      .send({
        success: true,
        msg: 'Arzt wurde erfolgreich angelegt',
        arzt: neuerArzt,
      })
      .end();
  }
};

/**
 * Verbindet Arzt mit Patienten, indem
 * @param {Request} req
 * @param {Response} res
 */
export const patientAnlegen = (req, res) => {
  const { arzt_email, patient_email } = req.params;
  // Initialisiere modifizierten Arzt;
  let modArzt;

  try {
    modArzt = setPatient(arzt_email, patient_email, anwender);
  } catch (error) {
    console.log(error);

    res.status(401).send({ success: false, error: error.message });
  }

  res.status(201).send({ success: true, arzt: modArzt });
};
