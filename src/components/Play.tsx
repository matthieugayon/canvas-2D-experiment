import { useShallow } from 'zustand/react/shallow'
import { useSceneApi } from '../Scene';

export const Play: React.FC = () => {
  const { animating, animate } = useSceneApi(
    useShallow((state) => ({ animating: state.animating, animate: state.animate })),
  );

  return (
    <button
      onClick={animate}
      className="bg-white text-black font-bold py-12 px-4 rounded border-2 border-black w-full mb-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={animating}
    >
      Play
    </button>
  )
};

export default Play;
