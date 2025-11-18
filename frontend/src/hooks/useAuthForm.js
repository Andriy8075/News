import { useState, useCallback } from 'react';

export const useAuthForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prev) => {
        if (!prev[name]) return prev;
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    resetForm,
  };
};

