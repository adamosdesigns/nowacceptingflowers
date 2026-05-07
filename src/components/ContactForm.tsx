import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";

export function ContactForm({ isFlush = false }: { isFlush?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    website: "",
    whatDoYouDo: "",
    stage: "",
    challenge: "",
    currentHandling: "",
    services: [] as string[],
    goals: "",
    budget: "",
    timeline: "",
    decisionMaker: "",
    whyNow: "",
  });

  const steps = [
    { id: 'basics', title: 'The Basics', fields: ['fullName', 'email', 'businessName'] },
    { id: 'business', title: 'Your Business', fields: ['whatDoYouDo', 'stage'] },
    { id: 'objectives', title: 'Objectives', fields: ['challenge', 'services'] },
    { id: 'logistics', title: 'Logistics', fields: ['budget', 'timeline', 'decisionMaker'] },
    { id: 'final', title: 'Final Thought', fields: ['whyNow'] }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorText) setErrorText("");
  };

  const handleCheckboxChange = (opt: string) => {
    setFormData((prev) => {
      const services = prev.services.includes(opt)
        ? prev.services.filter((s) => s !== opt)
        : [...prev.services, opt];
      return { ...prev, services };
    });
    if (errorText) setErrorText("");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = (() => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      const val = formData[field as keyof typeof formData];
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    });
  })();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStepValid) return;
    
    setIsSubmitting(true);
    
    // In a real production environment, you would send this to your backend or a service like Formspree
    // Target: grow@nowacceptingflowers.com
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form Submission Success:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="bg-accent rounded-3xl p-12 text-charcoal h-full flex flex-col justify-center min-h-[500px]">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-bebas uppercase tracking-tight mb-6">Application Received.</h2>
          <p className="text-lg font-medium opacity-80 mb-10 leading-relaxed">
            Thank you for sharing your story. We'll review your application and get back to you within 48 hours. 
            The final step is to book a quick call.
          </p>
          <a 
            href="https://calendly.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block bg-charcoal text-offwhite px-10 py-5 rounded-2xl text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-charcoal transition-all shadow-xl"
          >
            Book Discovery Call
          </a>
        </motion.div>
      </div>
    );
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="bg-accent rounded-[2rem] overflow-hidden shadow-2xl border border-charcoal/5 flex flex-col relative text-charcoal">
      {/* Header & Progress */}
      <div className="px-10 py-8 border-b border-charcoal/10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h3 className="text-sm md:text-lg uppercase tracking-[0.3em] font-bold text-charcoal font-bebas flex items-center gap-3">
              {steps[currentStep].title}
              <span className="opacity-40 text-xs tracking-widest font-sans font-bold">({currentStep + 1}/{steps.length})</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 p-2 rounded-lg text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 disabled:opacity-10 transition-opacity"
              title="Previous Step"
            >
              <ChevronLeft size={20} />
            </button>
            
            {isLastStep ? (
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !isStepValid}
                className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-black transition-all disabled:opacity-30 disabled:grayscale"
              >
                {isSubmitting ? "Sending..." : "Submit"}
                <Send size={14} />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!isStepValid}
                className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-black transition-all disabled:opacity-30 disabled:grayscale"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 w-full bg-charcoal/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-charcoal"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col pt-10 px-10 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {currentStep === 0 && (
                <section className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Full Name">
                      <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={e => handleInputChange("fullName", e.target.value)} 
                        className="form-input" 
                        placeholder="Jane Doe"
                      />
                    </FormField>
                    <FormField label="Email Address">
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => handleInputChange("email", e.target.value)} 
                        className="form-input" 
                        placeholder="jane@company.com"
                      />
                    </FormField>
                    <FormField label="Business Name">
                      <input 
                        type="text" 
                        value={formData.businessName} 
                        onChange={e => handleInputChange("businessName", e.target.value)} 
                        className="form-input" 
                        placeholder="Acme Living"
                      />
                    </FormField>
                    <FormField label="Website / Instagram">
                      <input 
                        type="text" 
                        value={formData.website} 
                        onChange={e => handleInputChange("website", e.target.value)} 
                        className="form-input" 
                        placeholder="@acmeliving"
                      />
                    </FormField>
                  </div>
                </section>
              )}

              {currentStep === 1 && (
                <section className="space-y-8">
                  <div className="space-y-8">
                    <FormField label="What does your business do, and who do you serve?" fullWidth>
                      <textarea 
                        rows={4} 
                        value={formData.whatDoYouDo} 
                        onChange={e => handleInputChange("whatDoYouDo", e.target.value)} 
                        className="form-textarea" 
                        placeholder="Tell us about your brand..."
                      />
                    </FormField>
                    
                    <div className="space-y-4">
                      <label className="block text-sm font-bold border-b border-charcoal/10 pb-2 mb-4 uppercase tracking-widest text-charcoal/60">Current Stage</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Just Starting", "Growing", "Scaling"].map(opt => (
                          <SelectionItem 
                            key={opt}
                            label={opt}
                            active={formData.stage === opt}
                            onClick={() => handleInputChange("stage", opt)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section className="space-y-8">
                  <div className="space-y-8">
                    <FormField label="What’s your biggest challenge right now?" fullWidth>
                      <textarea 
                        rows={4} 
                        value={formData.challenge} 
                        onChange={e => handleInputChange("challenge", e.target.value)} 
                        className="form-textarea" 
                        placeholder="Where are you feeling stuck?"
                      />
                    </FormField>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold border-b border-charcoal/10 pb-2 mb-4 uppercase tracking-widest text-charcoal/60 text-balance">What do you need help with?</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {["Content", "Social", "Brand", "Strategy", "Web", "Creative"].map(opt => (
                          <SelectionItem 
                            key={opt}
                            label={opt}
                            active={formData.services.includes(opt)}
                            onClick={() => handleCheckboxChange(opt)}
                            checkbox
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 3 && (
                <section className="space-y-8">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold border-b border-charcoal/10 pb-2 mb-4 uppercase tracking-widest text-charcoal/60">Monthly Investment Budget</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["<$1.5k", "$1.5–3.5k", "$3.5–7.5k", "$7.5k+"].map(opt => (
                          <SelectionItem 
                            key={opt}
                            label={opt}
                            active={formData.budget === opt}
                            onClick={() => handleInputChange("budget", opt)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Timeline</label>
                        <select 
                          value={formData.timeline} 
                          onChange={e => handleInputChange("timeline", e.target.value)}
                          className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-5 py-3 text-sm font-bold text-charcoal focus:border-charcoal focus:outline-none appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="ASAP">ASAP</option>
                          <option value="1 month">Next Month</option>
                          <option value="2-3 months">2-3 Months</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Are you the decision maker?</label>
                        <select 
                          value={formData.decisionMaker} 
                          onChange={e => handleInputChange("decisionMaker", e.target.value)}
                          className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-5 py-3 text-sm font-bold text-charcoal focus:border-charcoal focus:outline-none appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 4 && (
                <section className="space-y-8">
                  <div className="space-y-8">
                    <FormField label="Why Now? Why Us?" fullWidth>
                        <textarea 
                          rows={6} 
                          value={formData.whyNow} 
                          onChange={e => handleInputChange("whyNow", e.target.value)} 
                          className="form-textarea" 
                          placeholder="What made you reach out today?"
                        />
                    </FormField>
                    
                    <FormField label="What's your main goal for the next 6 months?" fullWidth>
                      <textarea 
                        rows={3} 
                        value={formData.goals} 
                        onChange={e => handleInputChange("goals", e.target.value)} 
                        className="form-textarea" 
                        placeholder="Specific outcomes you're looking for..."
                      />
                    </FormField>
                  </div>
                </section>
              )}

            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: #1a1a1a;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: #1a1a1a;
          outline: none;
          background: rgba(0,0,0,0.02);
        }
        .form-textarea {
          width: 100%;
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 1.25rem;
          padding: 1.25rem 1.5rem;
          color: #1a1a1a;
          font-size: 1rem;
          line-height: 1.5;
          transition: all 0.3s ease;
          resize: none;
        }
        .form-textarea:focus {
          border-color: #1a1a1a;
          outline: none;
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}

function FormField({ label, children, fullWidth = false }: { label: string, children: React.ReactNode, fullWidth?: boolean }) {
  return (
    <div className={`space-y-2 ${fullWidth ? 'col-span-full' : ''}`}>
      <label className="block text-[10px] uppercase tracking-widest text-charcoal/40 font-bold px-2">{label}</label>
      {children}
    </div>
  );
}

const SelectionItem: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  checkbox?: boolean;
}> = ({ label, active, onClick, checkbox = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-3 ${
        active 
          ? 'bg-charcoal text-white border-charcoal shadow-lg' 
          : 'bg-transparent border-charcoal/10 text-charcoal/40 hover:border-charcoal/30'
      }`}
    >
      {checkbox && (
        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${active ? 'bg-white border-white text-charcoal' : 'border-charcoal/20'}`}>
          {active && <Check size={8} strokeWidth={4} />}
        </div>
      )}
      {label}
    </button>
  );
};
