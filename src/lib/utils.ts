/**
 * Returns the user's avatar URL or a fallback.
 * If names is provided, generates a UI Avatar URL.
 */
export const getUserAvatar = (user?: any) => {
  if (user?.avatar) {
    return user.avatar;
  }

  // Use name if available, otherwise "User"
  const name = user?.name || "User";
  
  // Background colors corresponding to TailAdmin/Tailwind themes
  const background = "465fff"; // Blue-600
  const color = "fff";
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${background}&color=${color}&bold=true`;
};

/**
 * Parses API errors into a user-friendly string.
 */
export const parseApiError = (error: any, defaultMessage: string = "An error occurred") => {
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  const status = error.response.status;

  // File too large (Nginx/PHP limit)
  if (status === 413) {
    return "File is too large. Please upload smaller files (Max 10MB total recommended).";
  }

  // Validation Errors
  if (status === 422 && error.response.data?.errors) {
    const errors = error.response.data.errors;
    const messages: string[] = [];

    // Prioritize specific known keys
    Object.keys(errors).forEach((key) => {
      const msgs = errors[key];
      if (Array.isArray(msgs)) {
        msgs.forEach(msg => {
          // Clean up "attachments.0" -> "Attachment"
          let cleanMsg = msg.replace(/attachments\.\d+/g, "Attachment");
          // Clean up "The Attachment field" -> "The Attachment" if needed, 
          // but usually Laravel says "The attachments.0 must be..." -> "The Attachment must be..."
          messages.push(cleanMsg);
        });
      } else {
        messages.push(String(msgs));
      }
    });

    if (messages.length > 0) {
      // Return the first one or a bulleted list if few
      if (messages.length === 1) return messages[0];
      return messages.join("\n");
    }
  }

  // Generic API message
  if (error.response.data?.message) {
      if (error.response.data.message.includes("CSRF")) return "Session expired. Please refresh the page.";
      return error.response.data.message;
  }

  return defaultMessage;
};
