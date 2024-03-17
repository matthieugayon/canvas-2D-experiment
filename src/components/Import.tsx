import { useRef } from 'react';
import { useSceneApi } from '../Scene';
import { serializedSceneSchema } from '../helpers/validation';

export const Import: React.FC = () => {
  const replaceScene = useSceneApi(state => state.replaceScene);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;

        try {
          const jsonData = JSON.parse(text as string);
          // Validate JSON with our zod serializedScene schema validator
          const scene = serializedSceneSchema.parse(jsonData);
          replaceScene(scene);
        } catch (error) {
          window.alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white text-black font-bold rounded border-2 border-black w-full mt-4 shadow-lg">
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
      />
      <button
        onClick={handleButtonClick}
        className="w-full py-6 px-4"
      >
        Import JSON
      </button>
    </div>
  )
};

export default Import;