import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { ContactHeader } from "./contact/ContactHeader";
import { ContactForm } from "./contact/ContactForm";

export const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestCV, setRequestCV] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Starting form submission...");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company_name: formData.get('company') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      request_cv: requestCV
    };

    try {
      console.log("Attempting to save to Supabase...");
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([data]);

      if (supabaseError) {
        console.error("Supabase insert error:", supabaseError);
        throw supabaseError;
      }

      console.log("Successfully saved to Supabase, sending email...");
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify(data)
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        throw emailError;
      }

      console.log("Form submission successful!");
      setIsSubmitted(true);
      toast({
        title: t('contact.success'),
        description: t('contact.successMessage'),
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: t('contact.error'),
        description: error.message || t('contact.errorMessage'),
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 min-h-screen py-24 text-ivory">
      <div className="mx-auto max-w-3xl px-4">
        <ContactHeader />
        <ContactForm
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
          requestCV={requestCV}
          setRequestCV={setRequestCV}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};
