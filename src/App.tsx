import React from 'react';

import Canvas from './components/Canvas';
import Add from './components/Add';
import Duration from './components/Duration';
import Play from './components/Play';
import Import from './components/Import';
import Download from './components/Download';

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Canvas container */}
      <div className="flex-grow bg-gray-200">
        <Canvas />
      </div>

      {/* Right sidebar for controls */}
      <div className="controls bg-white p-4 flex flex-col justify-between">
        {/* Top Group: Add rectangle button */}
        <div>
          <Add />
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <hr className="my-4 mx-12" />
        </div>

        {/* Middle Group: Duration control and Play button */}
        <div>
          <Duration />
          <Play />
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <hr className="my-4 mx-12" />
        </div>

        {/* Bottom Group: Import & Download button */}
        <div>
          <Import />
          <Download />
        </div>
      </div>
    </div>
  );
};

export default App;