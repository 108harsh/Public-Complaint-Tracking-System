import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { UploadCloud, MapPin, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
// We should use react-leaflet for map, but to save complexity here without running into bounds issues,
// We will do a generic map placeholder or basic html inputs for location

export default function NewComplaint() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/complaints/categories');
        setCategories(res.data.categories);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);

  const onNext = () => {
    if (step === 1 && !selectedCategory) {
      toast.error('Please select a category first');
      return;
    }
    setStep(prev => prev + 1);
  };

  const onPrev = () => {
    setStep(prev => prev - 1);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category_id', selectedCategory.category_id);
      
      const locationObj = {
        area: data.area,
        street: data.street,
        city: data.city,
        pincode: data.pincode,
        latitude: 0,
        longitude: 0
      };
      formData.append('location', JSON.stringify(locationObj));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Complaint submitted successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">File a New Complaint</h1>
        <p className="text-gray-500 mt-2">Help us identity issues in your community. Provide accurate details for faster resolution.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100 dark:bg-gray-700">
          <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-gray-500">
          <span className={step >= 1 ? 'text-primary' : ''}>Category</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Details</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Location</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-2xl overflow-hidden p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          
          {/* Step 1: Category */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">What type of issue are you reporting?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div 
                    key={cat.category_id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer rounded-xl p-4 border-2 flex flex-col items-center justify-center text-center transition-all ${selectedCategory?.category_id === cat.category_id ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20 text-primary' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-500'}`}
                  >
                    {/* Simplified icon representing category */}
                    <div className="h-10 w-10 mb-2 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg shadow-sm">
                       {cat.icon === 'droplet' ? '💧' : cat.icon === 'zap' ? '⚡' : cat.icon === 'trash' ? '🗑️' : cat.icon === 'lightbulb' ? '💡' : '🛣️'}
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Describe the issue</h2>
              
              <Input
                label="Complaint Title *"
                placeholder="E.g. Broken street light near Main St."
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  rows="4"
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                  placeholder="Provide as much detail as possible..."
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
              </div>

              {/* Photo Upload */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach a Photo (Optional)</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                    <input 
                       type="file" 
                       accept="image/*" 
                       onChange={(e) => setImageFile(e.target.files[0])}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <span className="relative rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                          <span>{imageFile ? imageFile.name : 'Upload a file or drag and drop'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Where is this happening?</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Area / Locality *" placeholder="Downtown" {...register('area', { required: 'Area is required' })} error={errors.area?.message} />
                 <Input label="Street *" placeholder="123 Civic Way" {...register('street', { required: 'Street is required' })} error={errors.street?.message} />
                 <Input label="City *" placeholder="Metropolis" {...register('city', { required: 'City is required' })} error={errors.city?.message} />
                 <Input label="Pincode" placeholder="10001" {...register('pincode')} />
               </div>

               <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex items-start border border-indigo-100 dark:border-indigo-800 mt-4">
                  <MapPin className="h-5 w-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Map Integration Available</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">In a full env, a Leaflet map would render here allowing you to drop a pin to fetch coordinates.</p>
                  </div>
               </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="mt-8 flex justify-between pt-5 border-t border-gray-200 dark:border-gray-700">
             {step > 1 ? (
               <Button type="button" variant="outline" onClick={onPrev}>
                 <ChevronLeft className="w-4 h-4 mr-1" /> Back
               </Button>
             ) : (
               <div></div>
             )}

             {step < 3 ? (
               <Button type="button" onClick={onNext}>
                 Next <ChevronRight className="w-4 h-4 ml-1" />
               </Button>
             ) : (
               <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting ? 'Submitting...' : 'Submit Complaint'} <CheckCircle className="w-4 h-4 ml-2" />
               </Button>
             )}
          </div>

        </form>
      </div>
    </div>
  );
}
