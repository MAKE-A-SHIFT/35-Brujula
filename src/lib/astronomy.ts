import { Body, Ecliptic, AstroTime, MoonPhase, Horizon, Observer, Equator, SiderealTime } from 'astronomy-engine';

export interface IAUConstellation {
  name: string;
  startLon: number; // degrés écliptiques
  endLon: number;
}

// Table de référence Vrai Sidéral (Limites Astronomiques de l'UAI - 13 Signes)
export const IAU_13_SIGNS: IAUConstellation[] = [
  { name: 'Bélier', startLon: 29.1, endLon: 53.5 },
  { name: 'Taureau', startLon: 53.5, endLon: 90.4 },
  { name: 'Gémeaux', startLon: 90.4, endLon: 118.1 },
  { name: 'Cancer', startLon: 118.1, endLon: 138.0 },
  { name: 'Lion', startLon: 138.0, endLon: 174.0 },
  { name: 'Vierge', startLon: 174.0, endLon: 218.1 },
  { name: 'Balance', startLon: 218.1, endLon: 241.1 },
  { name: 'Scorpion', startLon: 241.1, endLon: 247.7 },
  { name: 'Ophiuchus', startLon: 247.7, endLon: 266.3 },
  { name: 'Sagittaire', startLon: 266.3, endLon: 299.7 },
  { name: 'Capricorne', startLon: 299.7, endLon: 327.6 },
  { name: 'Verseau', startLon: 327.6, endLon: 348.6 },
  { name: 'Poissons', startLon: 348.6, endLon: 29.1 }, // Franchit le 360°
];

export function getIAUConstellation(longitude: number): string {
  const lon = (longitude % 360 + 360) % 360;
  for (const sign of IAU_13_SIGNS) {
    if (sign.startLon < sign.endLon) {
      if (lon >= sign.startLon && lon < sign.endLon) return sign.name;
    } else {
      // Pour les Poissons qui traversent le 0° (360°)
      if (lon >= sign.startLon || lon < sign.endLon) return sign.name;
    }
  }
  return 'Inconnu';
}

export function calculateGeoFootprint(date: Date, lat: number, lng: number, elevation: number = 0) {
  const time = new AstroTime(date);
  const observer = new Observer(lat, lng, elevation);

  // 1. Vecteur Solaire
  const sunEquator = Equator(Body.Sun, time, observer, true, true);
  const sunEcliptic = Ecliptic(sunEquator.vec);
  const sunConstellation = getIAUConstellation(sunEcliptic.elon);
  
  // Angle d'incidence solaire
  const sunHorizon = Horizon(time, observer, sunEquator.ra, sunEquator.dec, 'normal');
  const solarIncidence = sunHorizon.altitude; // Altitude au dessus/en dessous de l'horizon

  // 2. Gradient Gravitationnel Lunaire
  const moonEquator = Equator(Body.Moon, time, observer, true, true);
  const moonEcliptic = Ecliptic(moonEquator.vec);
  const moonConstellation = getIAUConstellation(moonEcliptic.elon);
  
  // Illumination et Phase
  const moonPhase = MoonPhase(time); // 0-360 degrés
  const illumination = ((1 - Math.cos(moonPhase * Math.PI / 180)) / 2) * 100;

  // 3. Filtre Géomagnétique Local (Ascendant Exact)
  // Calcul basé sur le Temps Sidéral Local et l'obliquité de l'écliptique
  const st = SiderealTime(time) + lng / 15; // Temps Sidéral Local en heures
  const ramc = st * 15; // en degrés
  const eps = 23.439; // Inclinaison axiale de la Terre
  
  // Formule de trigonométrie sphérique pour croisement de l'horizon Est
  const ascRad = Math.atan2(
    Math.cos(ramc * Math.PI / 180),
    -(Math.sin(ramc * Math.PI / 180) * Math.cos(eps * Math.PI / 180) + Math.tan(lat * Math.PI / 180) * Math.sin(eps * Math.PI / 180))
  );
  let ascLon = (ascRad * 180 / Math.PI) % 360;
  if (ascLon < 0) ascLon += 360;
  
  const ascConstellation = getIAUConstellation(ascLon);

  // 4. Résonance des Masses Planétaires
  const jupEquator = Equator(Body.Jupiter, time, observer, true, true);
  const jupEcliptic = Ecliptic(jupEquator.vec);
  
  const satEquator = Equator(Body.Saturn, time, observer, true, true);
  const satEcliptic = Ecliptic(satEquator.vec);
  
  // Angle de déviation par rapport à l'axe Terre-Soleil (0-180°)
  const jupSunAngle = Math.abs(jupEcliptic.elon - sunEcliptic.elon);
  const satSunAngle = Math.abs(satEcliptic.elon - sunEcliptic.elon);

  return {
    solarVector: {
      constellation: sunConstellation,
      longitude: sunEcliptic.elon,
      incidenceAngle: solarIncidence,
    },
    lunarGradient: {
      constellation: moonConstellation,
      illumination: illumination, // Pourcentage d'éclairage
      phaseAngle: moonPhase
    },
    geomagneticFilter: {
      constellation: ascConstellation,
      longitude: ascLon,
    },
    planetaryResonance: {
      jupiterDev: Math.min(jupSunAngle, 360 - jupSunAngle), // Déviation barycentrique
      saturnDev: Math.min(satSunAngle, 360 - satSunAngle)
    }
  };
}

