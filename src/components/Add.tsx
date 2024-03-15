import { useSceneApi } from '../Scene';

const Add: React.FC = () => {
  const add = useSceneApi(state => state.addRectangle);

  return (
    <button
      onClick={() => add()}
      className="bg-white text-black font-bold py-12 px-4 rounded border-2 border-black w-full mb-4 shadow-lg">
      Add rectangle
    </button>
  )
};

export default Add;
