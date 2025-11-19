import { useState, useEffect, useRef } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useNewsForm = (initialData = null) => {
  const [categories, setCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState(initialData?.category || '');
  const [isSearchingCategories, setIsSearchingCategories] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Search categories when search term changes
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search term is empty, fetch default categories
    if (!categorySearchTerm.trim()) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/categories`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
          }
        } catch (err) {
          console.error('Error fetching categories', err);
        }
      };
      fetchCategories();
      return;
    }

    // Debounce search requests
    setIsSearchingCategories(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/search?query=${encodeURIComponent(categorySearchTerm)}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error searching categories', err);
      } finally {
        setIsSearchingCategories(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [categorySearchTerm]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    imageFile: null,
    imagePreview: initialData?.image || null,
    tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : ''
  });

  // Update categorySearchTerm when formData.category changes (for edit mode)
  useEffect(() => {
    if (formData.category && formData.category !== categorySearchTerm) {
      setCategorySearchTerm(formData.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.category]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySearchChange = (e) => {
    const value = e.target.value;
    setCategorySearchTerm(value);
    setShowCategoryDropdown(true);
    
    // Update formData category when user types
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleCategorySelect = (categoryName) => {
    setCategorySearchTerm(categoryName);
    setFormData(prev => ({
      ...prev,
      category: categoryName
    }));
    setShowCategoryDropdown(false);
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

  return {
    categories,
    formData,
    setFormData,
    categorySearchTerm,
    isSearchingCategories,
    showCategoryDropdown,
    setShowCategoryDropdown,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleImageChange,
    handleCategorySearchChange,
    handleCategorySelect,
  };
};

