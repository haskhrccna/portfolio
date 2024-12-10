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
    setIsSubmitting(true);

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
      // First, save to Supabase
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      // Then, send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: data
      });

      if (emailError) throw emailError;

      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: t('contact.error'),
        description: t('contact.errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0B1221] text-white py-16">
      <div className="max-w-3xl mx-auto px-4">
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