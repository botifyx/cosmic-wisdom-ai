import React from 'react';
import { PlanetaryPositions, PlanetInfo } from '../types';

const PLANET_SHORT_NAMES: { [key: string]: string } = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra',
  Ketu: 'Ke', Ascendant: 'As'
};

const PLANET_COLORS: { [key: string]: string } = {
  Sun: 'text-orange-400', Moon: 'text-slate-300', Mars: 'text-red-500', Mercury: 'text-green-400',
  Jupiter: 'text-yellow-400', Venus: 'text-pink-400', Saturn: 'text-blue-400', Rahu: 'text-indigo-400',
  Ketu: 'text-purple-400', Ascendant: 'text-amber-300 font-bold'
};

// South Indian Chart Layout (Signs are fixed)
const chartLayout = [
  { sign: 'Pisces', gridArea: '1 / 1 / 2 / 2' },
  { sign: 'Aries', gridArea: '1 / 2 / 2 / 3' },
  { sign: 'Taurus', gridArea: '1 / 3 / 2 / 4' },
  { sign: 'Gemini', gridArea: '1 / 4 / 2 / 5' },
  { sign: 'Aquarius', gridArea: '2 / 1 / 3 / 2' },
  { sign: 'Cancer', gridArea: '2 / 4 / 3 / 5' },
  { sign: 'Capricorn', gridArea: '3 / 1 / 4 / 2' },
  { sign: 'Leo', gridArea: '3 / 4 / 4 / 5' },
  { sign: 'Sagittarius', gridArea: '4 / 1 / 5 / 2' },
  { sign: 'Scorpio', gridArea: '4 / 2 / 5 / 3' },
  { sign: 'Libra', gridArea: '4 / 3 / 5 / 4' },
  { sign: 'Virgo', gridArea: '4 / 4 / 5 / 5' },
];

interface StarChartProps {
  positions: PlanetaryPositions;
}

const StarChart: React.FC<StarChartProps> = ({ positions }) => {
  const planetsBySign: { [key: string]: string[] } = {};

  for (const [planet, planetInfo] of Object.entries(positions)) {
    // Fix: Cast planetInfo to PlanetInfo to access properties safely.
    const sign = (planetInfo as PlanetInfo).sign;
    if (sign && !planetsBySign[sign]) {
      planetsBySign[sign] = [];
    }
    if(sign) {
        planetsBySign[sign].push(planet);
    }
  }

  const ascendantSign = positions.Ascendant.sign;

  return (
    <div className="w-full aspect-square bg-gray-800/30 rounded-lg p-2">
      <div className="grid grid-cols-4 grid-rows-4 h-full gap-px bg-gray-700">
        {chartLayout.map(({ sign, gridArea }) => {
          const isAscendant = ascendantSign === sign;
          const housePlanets = planetsBySign[sign] || [];
          
          return (
            <div
              key={sign}
              className={`relative bg-slate-900 p-2 flex flex-col justify-between`}
              style={{ gridArea }}
            >
              <p className="text-xs text-gray-500">{sign}</p>
              <div className="flex-grow flex flex-wrap items-center justify-center gap-x-2 gap-y-1 content-center">
                {housePlanets.map(planet => {
                  const planetInfo = positions[planet];
                  const title = `${planet}${planetInfo.isRetrograde ? ' (Retrograde)' : ''}`;

                  if (planet === 'Rahu') {
                    return (
                      <div key={planet} className="flex items-center gap-1" title={title}>
                          <div className={`w-4 h-4 ${PLANET_COLORS.Rahu}`}>
                              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round">
                                  <path d="M 80 80 C 80 35, 20 35, 20 80" />
                              </svg>
                          </div>
                          {planetInfo.isRetrograde && <span className="text-red-400 text-xs font-mono">R</span>}
                      </div>
                    );
                  }
                  if (planet === 'Ketu') {
                     return (
                      <div key={planet} className="flex items-center gap-1" title={title}>
                          <div className={`w-4 h-4 ${PLANET_COLORS.Ketu}`}>
                              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round">
                                  <path d="M 80 20 C 80 65, 20 65, 20 20" />
                              </svg>
                          </div>
                          {planetInfo.isRetrograde && <span className="text-red-400 text-xs font-mono">R</span>}
                      </div>
                    );
                  }
                  return (
                    <div key={planet} className="flex items-baseline justify-center" title={title}>
                      <span className={`text-sm font-semibold ${PLANET_COLORS[planet] || 'text-white'}`}>
                        {PLANET_SHORT_NAMES[planet]}
                      </span>
                      {planetInfo.isRetrograde && <span className="text-red-400 text-xs font-mono ml-px">R</span>}
                    </div>
                  );
                })}
              </div>
              {isAscendant && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-amber-300 pointer-events-none rounded-sm"></div>
                  <div className="absolute top-0 left-0 w-4 h-4" style={{ background: 'linear-gradient(to bottom right, transparent 49%, #fcd34d 50%)' }}></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4" style={{ background: 'linear-gradient(to top left, transparent 49%, #fcd34d 50%)' }}></div>
                </>
              )}
            </div>
          );
        })}
         {/* Center area - can be empty or have a symbol */}
        <div className="bg-slate-900" style={{ gridArea: '2 / 2 / 4 / 4' }}></div>
      </div>
    </div>
  );
};

export default StarChart;