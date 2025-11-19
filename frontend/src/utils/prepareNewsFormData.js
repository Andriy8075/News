/**
 * Prepares FormData for news submission
 * @param {Object} formData - Form data object
 * @param {string} method - HTTP method override (e.g., 'PATCH')
 * @returns {FormData} Prepared FormData object
 */
export const prepareNewsFormData = (formData, method = null) => {
  const formDataToSend = new FormData();
  
  formDataToSend.append('title', formData.title);
  formDataToSend.append('excerpt', formData.excerpt);
  formDataToSend.append('content', formData.content);
  formDataToSend.append('category', formData.category);
  
  // Add image if selected
  if (formData.imageFile) {
    formDataToSend.append('image', formData.imageFile);
  }

  // Parse tags from comma-separated string to array
  if (formData.tags.trim()) {
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    tagsArray.forEach(tag => {
      formDataToSend.append('tags[]', tag);
    });
  }

  // Add method override if needed (for PATCH requests)
  if (method) {
    formDataToSend.append('_method', method);
  }

  return formDataToSend;
};

