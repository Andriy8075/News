import { useState } from 'react';

export const useNewsForm = (initialData = null) => {
  const [categories, setCategories] = useState([
    { value: 'technology', label: 'Технології' },
    { value: 'politics', label: 'Політика' },
    { value: 'sports', label: 'Спорт' },
    { value: 'entertainment', label: 'Розваги' },
    { value: 'science', label: 'Наука' },
    { value: 'business', label: 'Бізнес' },
  ]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || 'technology',
    imageFile: null,
    imagePreview: initialData?.image || null,
    tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: null
      }));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    const value = trimmed.toLowerCase().replace(/\s+/g, '-');

    const exists = categories.find(cat => cat.value === value);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        category: exists.value
      }));
      setNewCategory('');
      setShowAddCategory(false);
      return;
    }

    const newCatObj = { value, label: trimmed };

    setCategories(prev => [...prev, newCatObj]);
    setFormData(prev => ({
      ...prev,
      category: newCatObj.value
    }));
    setNewCategory('');
    setShowAddCategory(false);
  };

  return {
    categories,
    formData,
    setFormData,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleImageChange,
    handleAddCategory,
  };
};

