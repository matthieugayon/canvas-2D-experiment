import { useShallow } from 'zustand/react/shallow'
import { useSceneApi } from '../Scene';

const Duration: React.FC = () => {
  const { duration, setDuration } = useSceneApi(
    useShallow((state) => ({ duration: state.duration, setDuration: state.setDuration })),
  );

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value, 10);
    // Check for valid number and optionally, a reasonable range for duration
    if (!isNaN(newDuration) && newDuration >= 1) {
      setDuration(newDuration);
    }
  };

  console.log('|=====> Duration rendered');

  return (
    <div className="mb-4">
      <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
        Duration:
      </label>
      <input
        type="number"
        min={1}
        value={duration}
        onChange={handleDurationChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 border-black border-2 focus:outline-none focus:shadow-outline shadow-inner"
      />
    </div>
  )
};

export default Duration;
