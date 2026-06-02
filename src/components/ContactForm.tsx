import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm, ValidationError } from "@formspree/react";
import { Check, Send, ChevronRight, ChevronLeft, ArrowRight, Sparkles, Target, Briefcase, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Initialize Formspree using the ID from the user's request (mwvynrbo)
  const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || "mwvynrbo";
  const [state, handleSubmitToFormspree] = useForm(FORMSPREE_ID);

  useEffect(() => {
    if (state.succeeded) {
      setIsSubmitted(true);
      setTimeout(scrollToForm, 100);
    }
  }, [state.succeeded]);

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    website: "",
    whatDoYouDo: "",
    stage: "",
    challenge: "",
    services: [] as string[],
    budget: "",
    timeline: "",
    decisionMaker: "",
    whyNow: "",
  });

  const steps = [
    { 
      id: 'identity', 
      title: 'The Identity', 
      subtitle: '',
      icon: <Briefcase className="w-5 h-5" />,
      fields: ['fullName', 'email', 'businessName', 'website'] 
    },
    { 
      id: 'vision', 
      title: 'The Vision', 
      subtitle: '',
      icon: <Sparkles className="w-5 h-5" />,
      fields: ['whatDoYouDo', 'stage'] 
    },
    { 
      id: 'strategy', 
      title: 'The Strategy', 
      subtitle: '',
      icon: <Target className="w-5 h-5" />,
      fields: ['challenge', 'services'] 
    },
    { 
      id: 'logistics', 
      title: 'The Logistics', 
      subtitle: '',
      icon: <Zap className="w-5 h-5" />,
      fields: ['budget', 'timeline', 'decisionMaker', 'whyNow'] 
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (opt: string) => {
    setFormData((prev) => {
      const services = prev.services.includes(opt)
        ? prev.services.filter((s) => s !== opt)
        : [...prev.services, opt];
      return { ...prev, services };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeout(scrollToForm, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimeout(scrollToForm, 100);
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      const offset = window.innerWidth >= 640 ? 100 : 88; // Adjusted for responsive sticky header
      const elementPosition = formRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStepValid) return;
    
    // Explicitly send the formData object to Formspree
    await handleSubmitToFormspree(formData);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="bg-accent rounded-[3rem] p-8 md:p-16 lg:p-20 text-charcoal flex flex-col items-center min-h-[60vh] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-charcoal/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full relative z-10 flex flex-col items-center text-center"
        >
          <div className="bg-charcoal text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <Check className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-[80px] font-bebas uppercase tracking-tight mb-4 leading-none">Application Received</h2>
          <p className="text-lg md:text-xl font-normal opacity-70 mb-12 max-w-2xl">
            We’ve received your vision. Next, schedule a brief discovery call to discuss the path forward.
          </p>
          
          <div className="flex flex-col items-center gap-6">
             <a 
                href="https://calendly.com/ariel-nowacceptingflowers/30min?back=1" 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-4 bg-charcoal text-offwhite px-12 py-6 rounded-2xl text-xl uppercase tracking-widest font-bold hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95 group"
              >
                SCHEDULE A CALL <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-sm opacity-40 uppercase tracking-widest font-bold">This will open in a new tab</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <form 
      ref={formRef} 
      className="w-full max-w-6xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === steps.length - 1) {
          handleFinalSubmit(e);
        } else {
          nextStep();
        }
      }}
    >
      {/* Sticky Step Header */}
      <div className="sticky top-[80px] sm:top-[100px] z-[50] bg-charcoal/95 backdrop-blur-md pt-8 pb-4 mb-12 border-b border-offwhite/5 px-2">
        <div className="flex justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center text-charcoal shadow-lg shrink-0">
                {steps[currentStep].icon}
             </div>
             <div>
               <span className="text-[10px] md:text-[14px] uppercase tracking-[0.4em] font-bold text-offwhite/40 block">STEP 0{currentStep + 1}/0{steps.length}</span>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "p-2 md:px-4 md:py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border border-offwhite/10 rounded-lg transition-all",
                currentStep === 0 ? "invisible" : "opacity-60 hover:opacity-100 hover:bg-white/5"
              )}
            >
              <ChevronLeft className="w-4 h-4" /> <span className="hidden md:inline">Back</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={state.submitting || !isStepValid}
                className="px-4 py-2 md:px-8 md:py-3 flex items-center gap-2 bg-accent text-charcoal rounded-lg text-xs md:text-sm uppercase tracking-widest font-bold hover:bg-white transition-all disabled:opacity-40"
              >
                {state.submitting ? "..." : <><span className="hidden md:inline">Submit</span><Send className="w-4 h-4" /></>}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid}
                className="px-4 py-2 md:px-8 md:py-3 flex items-center gap-2 bg-offwhite text-charcoal rounded-lg text-xs md:text-sm uppercase tracking-widest font-bold hover:bg-accent transition-all disabled:opacity-20"
              >
                <span className="hidden md:inline">Next</span> <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="h-1 w-full bg-offwhite/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
        {/* Left Column: Context (Static desktop context) - HIDDEN as per request to remove subtitles/titles */}
        <div className="lg:col-span-4 hidden">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-60"
          >
            <p className="text-xl text-offwhite/60 font-light leading-snug text-balance">
              {steps[currentStep].subtitle}
            </p>
          </motion.div>
        </div>


        {/* Right Column: Form Fields */}
        <div className="lg:col-span-12">
          {state.errors && (
             <div className="mb-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-base">
               <p className="font-bold mb-2 uppercase tracking-wide">Submission Error</p>
               <ValidationError errors={state.errors} className="text-sm font-medium" />
               <p className="mt-2 opacity-80">Please check the fields below or try again.</p>
             </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-12"
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <InputGroup 
                    label="NAME" 
                    name="fullName"
                    errors={state.errors}
                    value={formData.fullName} 
                    onChange={v => handleInputChange("fullName", v)} 
                    placeholder="Full Name"
                    required
                  />
                  <InputGroup 
                    label="Email Address" 
                    name="email"
                    errors={state.errors}
                    value={formData.email} 
                    onChange={v => handleInputChange("email", v)} 
                    placeholder="hello@brand.com"
                    type="email"
                    required
                  />
                  <InputGroup 
                    label="Business Name" 
                    name="businessName"
                    errors={state.errors}
                    value={formData.businessName} 
                    onChange={v => handleInputChange("businessName", v)} 
                    placeholder="The Collective"
                    required
                  />
                  <InputGroup 
                    label="Website or Instagram" 
                    name="website"
                    errors={state.errors}
                    value={formData.website} 
                    onChange={v => handleInputChange("website", v)} 
                    placeholder="@brandname"
                    required
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-16">
                  <TextareaGroup 
                    label="WHAT DOES YOUR BUSINESS DO?"
                    name="whatDoYouDo"
                    errors={state.errors}
                    value={formData.whatDoYouDo}
                    onChange={v => handleInputChange("whatDoYouDo", v)}
                    placeholder="We create..."
                    required
                  />
                  <div className="space-y-6">
                    <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none mb-4 text-left">Current Stage of Business <span className="text-accent">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {["Just Starting", "Growing", "Scaling"].map(opt => (
                        <CardOption 
                          key={opt}
                          label={opt}
                          active={formData.stage === opt}
                          onClick={() => handleInputChange("stage", opt)}
                        />
                      ))}
                    </div>
                    <ValidationError field="stage" errors={state.errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-16">
                  <TextareaGroup 
                    label="What's your biggest challenge right now?"
                    name="challenge"
                    errors={state.errors}
                    value={formData.challenge}
                    onChange={v => handleInputChange("challenge", v)}
                    placeholder="Our primary focus is..."
                    required
                  />
                  <div className="space-y-6">
                    <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none mb-4 text-left">What do you need help with? (Select all that apply) <span className="text-accent">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {["Content Production", "Social Growth", "Brand Identity", "Web Design", "Creative Strategy", "Ad Management"].map(opt => (
                        <CardOption 
                          key={opt}
                          label={opt}
                          active={formData.services.includes(opt)}
                          onClick={() => handleCheckboxChange(opt)}
                          checkbox
                        />
                      ))}
                    </div>
                    <ValidationError field="services" errors={state.errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-16">
                  <div className="space-y-6">
                    <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none mb-4 text-left">MONTHLY BUDGET <span className="text-accent">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {["<$1,500", "$1,500–3,500", "$3,500–7,500", "$7,500+"].map(opt => (
                        <CardOption 
                          key={opt}
                          label={opt}
                          active={formData.budget === opt}
                          onClick={() => handleInputChange("budget", opt)}
                        />
                      ))}
                    </div>
                    <ValidationError field="budget" errors={state.errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <SelectGroup 
                       label="Launch Timeline"
                       name="timeline"
                       errors={state.errors}
                       value={formData.timeline}
                       onChange={v => handleInputChange("timeline", v)}
                       options={["ASAP", "Next Month", "2-3 Months", "Planning Only"]}
                       required
                    />
                    <SelectGroup 
                       label="Decision Maker?"
                       name="decisionMaker"
                       errors={state.errors}
                       value={formData.decisionMaker}
                       onChange={v => handleInputChange("decisionMaker", v)}
                       options={["Yes, I'm the one", "No, I'm the point of contact"]}
                       required
                    />
                  </div>

                  <TextareaGroup 
                    label="Why Now? Why Us?"
                    name="whyNow"
                    errors={state.errors}
                    value={formData.whyNow}
                    onChange={v => handleInputChange("whyNow", v)}
                    placeholder="Share a little context on why you're reaching out..."
                    required
                  />
                </div>
              )}

              {/* Bottom padding Spacer for sticky navigation overlap */}
              <div className="h-20 hidden lg:block" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}

function InputGroup({ label, placeholder, value, onChange, name, errors, type = "text", required = false }: any) {
  return (
    <div className="space-y-4">
      <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none text-left">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border-b-2 border-offwhite/10 px-4 py-5 text-lg md:text-xl lg:text-[24px] font-medium text-offwhite focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-offwhite/20"
      />
      {name && <ValidationError prefix={label} field={name} errors={errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />}
    </div>
  );
}

function TextareaGroup({ label, placeholder, value, onChange, name, errors, required = false }: any) {
  return (
    <div className="space-y-6">
      <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none text-left">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <textarea 
        rows={4}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border-2 border-offwhite/10 rounded-[2rem] p-8 text-lg md:text-xl lg:text-[24px] font-normal text-offwhite focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-offwhite/20 resize-none leading-relaxed lg:leading-[26px]"
      />
      {name && <ValidationError prefix={label} field={name} errors={errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />}
    </div>
  );
}

function SelectGroup({ label, options, value, onChange, name, errors, required = false }: any) {
  return (
    <div className="space-y-4">
      <label className="block text-[24pt] font-bebas uppercase tracking-widest text-offwhite/80 leading-none text-left">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative">
        <select 
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border-2 border-offwhite/10 rounded-2xl px-6 py-5 text-lg font-bold text-offwhite focus:border-accent outline-none appearance-none transition-all"
        >
          <option value="" className="bg-charcoal text-offwhite/40">Select...</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-charcoal">{opt}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
           <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </div>
      {name && <ValidationError prefix={label} field={name} errors={errors} className="text-accent text-xs mt-1 uppercase tracking-widest font-bold" />}
    </div>
  );
}

function CardOption({ label, active, onClick, checkbox = false }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 transition-all group relative overflow-hidden h-full",
        active 
          ? "bg-accent border-accent text-charcoal scale-[1.02] shadow-xl" 
          : "bg-white/5 border-offwhite/10 text-offwhite/60 hover:border-offwhite/30 hover:bg-white/[0.08]"
      )}
    >
      {checkbox && (
        <div className={cn(
          "absolute top-4 right-4 w-5 h-5 rounded border flex items-center justify-center transition-colors",
          active ? "bg-charcoal border-charcoal text-white" : "border-offwhite/20 group-hover:border-offwhite/40"
        )}>
          {active && <Check size={12} strokeWidth={4} />}
        </div>
      )}
      <span className="text-sm md:text-base font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
