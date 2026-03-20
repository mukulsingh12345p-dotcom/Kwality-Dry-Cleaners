import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, User, Phone, Home, Building, ArrowRight, Loader2, Lock, ArrowLeft } from 'lucide-react';

interface RegistrationScreenProps {
  onComplete: (userData: any) => void;
  onBack: () => void;
  existingContacts: string[];
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onComplete, onBack, existingContacts }) => {
  const [step, setStep] = useState(1);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: '',
    buildingNo: '',
    landmark: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetectLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding using a free API (Nominatim) for demo purposes
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, location: data.display_name }));
            } else {
              setFormData(prev => ({ ...prev, location: `${position.coords.latitude}, ${position.coords.longitude}` }));
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            setFormData(prev => ({ ...prev, location: `${position.coords.latitude}, ${position.coords.longitude}` }));
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Unable to detect location. Please enter it manually.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.phone && formData.password) {
      if (existingContacts.includes(formData.phone)) {
        setError('Account already exists with this Phone Number.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2 && formData.location && formData.buildingNo && agreedToTerms) {
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-ink-muted text-sm">Create your account to get started</p>
        </div>

        <div className="bg-surface rounded-3xl p-6 shadow-xl border border-line">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-accent' : 'bg-line'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-line'}`} />
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={onBack}
                  className="p-2 -ml-2 text-ink hover:text-accent transition-colors rounded-full hover:bg-bg-base"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-serif text-ink">Personal Details</h2>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Phone Number (Required)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Email ID (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email (optional)"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.phone || !formData.password}
                className="w-full mt-8 bg-ink text-surface py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-serif text-ink mb-6">Address Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your area or detect"
                      className="w-full pl-11 pr-24 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <button 
                      onClick={handleDetectLocation}
                      disabled={isLoadingLocation}
                      className="absolute inset-y-1.5 right-1.5 px-3 bg-accent/10 text-accent text-xs font-medium rounded-xl hover:bg-accent/20 transition-colors flex items-center gap-1"
                    >
                      {isLoadingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Detect'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Building / Flat No.</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="text"
                      name="buildingNo"
                      value={formData.buildingNo}
                      onChange={handleChange}
                      placeholder="House/Flat No., Building Name"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Landmark (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-ink-muted" />
                    </div>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near any known place"
                      className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-line text-accent focus:ring-accent bg-bg-base transition-colors"
                  />
                </div>
                <label htmlFor="terms" className="text-xs text-ink-muted leading-relaxed">
                  By continuing you agree to our <a href="#" className="text-accent hover:underline">Terms of Services</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                </label>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-2xl text-sm font-medium border border-line text-ink hover:bg-bg-base transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.location || !formData.buildingNo || !agreedToTerms}
                  className="flex-1 bg-accent text-surface py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
