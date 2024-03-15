import { Scene } from '../types/geometry';

export const downloadJSON = (data: Scene, filename: string) => {
  // Convert the data to a JSON string
  const jsonString: string = JSON.stringify(data);

  // Create a Blob from the JSON string
  const blob: Blob = new Blob([jsonString], { type: 'application/json' });

  // Create a URL for the blob
  const url: string = URL.createObjectURL(blob);

  // Create a temporary anchor element and set its href to the blob URL
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  a.download = filename;

  // Append the anchor to the body, click it to initiate download, and then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke the blob URL to free up resources
  URL.revokeObjectURL(url);
}