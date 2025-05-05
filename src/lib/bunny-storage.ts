import { v4 as uuidv4 } from 'uuid';

// Bunny.net Storage configuration
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || '';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || '';
const BUNNY_STORAGE_URL = process.env.BUNNY_STORAGE_URL || '';
const BUNNY_PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL || '';

/**
 * Uploads a file to Bunny.net storage
 * @param file The file to upload
 * @param path The path within the storage zone (e.g., 'tattoos/', 'profiles/')
 * @returns The URL of the uploaded file
 */
export async function uploadToBunnyStorage(
  file: File,
  path: string = 'uploads/'
): Promise<string> {
  if (!BUNNY_STORAGE_ZONE || !BUNNY_API_KEY || !BUNNY_STORAGE_URL) {
    throw new Error('Bunny.net storage configuration is missing');
  }

  // Generate a unique filename
  const fileExtension = file.name.split('.').pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;
  const fullPath = `${path}${uniqueFilename}`;

  // Create form data for the file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Upload to Bunny.net storage
    const response = await fetch(`${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_ZONE}/${fullPath}`, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_API_KEY,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    // Return the public URL for the file
    return `${BUNNY_PULL_ZONE_URL}/${fullPath}`;
  } catch (error) {
    console.error('Error uploading to Bunny.net:', error);
    throw error;
  }
}

/**
 * Deletes a file from Bunny.net storage
 * @param fileUrl The full URL of the file to delete
 * @returns A boolean indicating success
 */
export async function deleteFromBunnyStorage(fileUrl: string): Promise<boolean> {
  if (!BUNNY_STORAGE_ZONE || !BUNNY_API_KEY || !BUNNY_STORAGE_URL) {
    throw new Error('Bunny.net storage configuration is missing');
  }

  try {
    // Extract the path from the URL
    const urlObj = new URL(fileUrl);
    const pathWithoutDomain = urlObj.pathname;
    
    // Delete from Bunny.net storage
    const response = await fetch(`${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_ZONE}${pathWithoutDomain}`, {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_API_KEY,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting from Bunny.net:', error);
    throw error;
  }
}

/**
 * Gets a signed URL for a file in Bunny.net storage
 * @param path The path of the file within the storage zone
 * @param expirationMinutes How long the signed URL should be valid for (in minutes)
 * @returns A signed URL for the file
 */
export function getSignedBunnyUrl(path: string, expirationMinutes: number = 60): string {
  if (!BUNNY_PULL_ZONE_URL) {
    throw new Error('Bunny.net pull zone URL is missing');
  }

  // For signed URLs, you would typically use Bunny.net's token authentication
  // This is a simplified example - in production you would use their security token system
  const expirationTime = Math.floor(Date.now() / 1000) + (expirationMinutes * 60);
  
  // Return the URL with the expiration parameter
  // In a real implementation, you would generate a proper security token
  return `${BUNNY_PULL_ZONE_URL}/${path}?expires=${expirationTime}`;
}
