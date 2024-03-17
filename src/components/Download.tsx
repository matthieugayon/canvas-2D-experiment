import { useSceneApi } from '../Scene';
import { downloadJSON } from '../helpers/download';

export const Download: React.FC = () => {
  const getSerializedSceneObject = useSceneApi(state => state.getSerializedSceneObject);

  return (
    <button
      onClick={() => {
        const scene = getSerializedSceneObject();
        downloadJSON(scene, 'scene.json');
      }}
      className="bg-white text-black font-bold py-6 px-4 rounded border-2 border-black w-full mt-4 shadow-md"
    >
      Download JSON
    </button>
  )
};

export default Download;