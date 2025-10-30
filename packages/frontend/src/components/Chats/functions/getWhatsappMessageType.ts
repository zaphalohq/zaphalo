export function getWhatsappMessageType(mimeType: string): 'image' | 'video' | 'audio' | 'document' | null {
  const typeMap = {
    'image/jpeg': 'image',
    'image/jpg': 'image',
    'image/png': 'image',
    'image/webp': 'image',

    'video/mp4': 'video',
    'video/3gpp': 'video',

    'audio/mpeg': 'audio',
    'audio/ogg': 'audio',
    'audio/amr': 'audio',
    'audio/aac': 'audio',
    'audio/mp4': 'audio',
    'audio/webm': 'audio',

    'application/pdf': 'document',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'application/vnd.ms-excel': 'document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document',
    'application/vnd.ms-powerpoint': 'document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'document',
    'text/plain': 'document',
  };
  
  return typeMap[mimeType] || null;
}
