export const charMap: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

export interface NumerologyResult {
  final: number;
  display: string;
}

// Fonction de réduction récursive stricte Decoz
export function reduceValue(num: number): NumerologyResult {
  if (num === 0) return { final: 0, display: "0" };
  if (num === 11 || num === 22 || num === 33) return { final: num, display: num.toString() };
  if (num <= 9) return { final: num, display: num.toString() };

  let current = num;
  let karmic: number | null = null;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
      if ([13, 14, 16, 19].includes(current) && !karmic) {
          karmic = current;
      }
      let sum = 0;
      const str = current.toString();
      for (let char of str) {
          sum += parseInt(char, 10);
      }
      
      if (sum === 11 || sum === 22 || sum === 33) {
          current = sum;
          break;
      }
      current = sum;
  }

  if (karmic && current <= 9) {
      return { final: current, display: `${karmic}/${current}` };
  }
  
  return { final: current, display: current.toString() };
}

// Analyseur de mots avec la règle du "Y" de Decoz
function getWordValue(word: string, filter: 'all' | 'vowels' | 'consonants'): number {
  let sum = 0;
  // Normalisation des accents (é -> e, etc.) avant de filtrer les lettres
  const normalized = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const chars = normalized.toUpperCase().replace(/[^A-Z]/g, '').split('');
  
  chars.forEach((char, i) => {
      const isStandardVowel = ['A','E','I','O','U'].includes(char);
      let isVowel = isStandardVowel;
      
      if (char === 'Y') {
          // Règle du Y : voyelle s'il n'est pas adjacent à une autre voyelle
          const prev = i > 0 ? chars[i-1] : null;
          const next = i < chars.length - 1 ? chars[i+1] : null;
          const prevIsVowel = prev ? ['A','E','I','O','U'].includes(prev) : false;
          const nextIsVowel = next ? ['A','E','I','O','U'].includes(next) : false;
          
          isVowel = !(prevIsVowel || nextIsVowel);
      }
      
      if (filter === 'all' || (filter === 'vowels' && isVowel) || (filter === 'consonants' && !isVowel)) {
          sum += charMap[char] || 0;
      }
  });
  return sum;
}

// Réduction par blocs des noms (Prénom réduit + Nom réduit = Total réduit)
function calcNameNumber(fullName: string, filter: 'all' | 'vowels' | 'consonants'): NumerologyResult {
  const names = fullName.trim().split(/\s+/);
  let totalSum = 0;
  for (let name of names) {
      const val = getWordValue(name, filter);
      const reduced = reduceValue(val).final;
      totalSum += reduced;
  }
  return reduceValue(totalSum);
}

// 1. CHEMIN DE VIE (Life Path) - Réduction par blocs temporels
export function calcLifePath(day: number, month: number, year: number): NumerologyResult {
  const d = reduceValue(day).final;
  const m = reduceValue(month).final;
  const y = reduceValue(year).final;
  return reduceValue(d + m + y);
}

// LES NOMBRES MAJEURS (Core Numbers)
export function calcCoreNumbers(birthName: string, day: number, month: number, year: number) {
  const lifePath = calcLifePath(day, month, year);
  const expression = calcNameNumber(birthName, 'all');
  const heartsDesire = calcNameNumber(birthName, 'vowels');
  const personality = calcNameNumber(birthName, 'consonants');
  const maturity = reduceValue(lifePath.final + expression.final);
  const birthday = reduceValue(day);

  return {
      lifePath,
      expression,
      heartsDesire,
      personality,
      maturity,
      birthday
  };
}

// LES NOMBRES MINEURS (Minor Numbers via Nom Usuel)
export function calcMinorNumbers(currentName: string) {
  if (!currentName) return null;
  return {
      minorExpression: calcNameNumber(currentName, 'all'),
      minorHeartsDesire: calcNameNumber(currentName, 'vowels'),
      minorPersonality: calcNameNumber(currentName, 'consonants')
  };
}

// LES CYCLES TEMPORELS (Apogées & Défis)
export function calcCycles(day: number, month: number, year: number, lifePathFinal: number) {
  const d = reduceValue(day).final;
  const m = reduceValue(month).final;
  const y = reduceValue(year).final;

  // Pinnacles (Apogées)
  const pin1 = reduceValue(m + d);
  const pin2 = reduceValue(d + y);
  const pin3 = reduceValue(pin1.final + pin2.final);
  const pin4 = reduceValue(m + y);

  // Challenges (Défis) - Réduits à 1 chiffre, valeur absolue
  const cha1 = reduceValue(Math.abs(m - d));
  const cha2 = reduceValue(Math.abs(d - y));
  const cha3 = reduceValue(Math.abs(cha1.final - cha2.final));
  const cha4 = reduceValue(Math.abs(m - y));

  const firstPinnacleEndAge = 36 - lifePathFinal;

  return {
      pinnacles: [pin1, pin2, pin3, pin4],
      challenges: [cha1, cha2, cha3, cha4],
      timing: {
          phase1: `0 - ${firstPinnacleEndAge} ans`,
          phase2: `${firstPinnacleEndAge + 1} - ${firstPinnacleEndAge + 9} ans`,
          phase3: `${firstPinnacleEndAge + 10} - ${firstPinnacleEndAge + 18} ans`,
          phase4: `${firstPinnacleEndAge + 19}+ ans`
      }
  };
}
