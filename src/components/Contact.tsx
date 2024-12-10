import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestCV, setRequestCV] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{t('contact.getInTouch')}</h1>
          <p className="text-gray-300">
            {t('contact.description')}
          </p>
        </motion.div>

        <motion.form 
          ref={formRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#131B2E] p-8 rounded-lg"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t('contact.name')} *
              </label>
              <Input
                id="name"
                name="name"
                required
                disabled={isSubmitted}
                className="w-full bg-[#1C2537] border-gray-700 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('contact.email')} *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitted}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className="w-full bg-[#1C2537] border-gray-700 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                {t('contact.companyName')} *
              </label>
              <Input
                id="company"
                name="company"
                required
                disabled={isSubmitted}
                className="w-full bg-[#1C2537] border-gray-700 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                {t('contact.subject')} *
              </label>
              <Input
                id="subject"
                name="subject"
                required
                disabled={isSubmitted}
                className="w-full bg-[#1C2537] border-gray-700 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                {t('contact.message')} *
              </label>
              <Textarea
                id="message"
                name="message"
                required
                disabled={isSubmitted}
                className="w-full bg-[#1C2537] border-gray-700 text-white min-h-[150px] disabled:opacity-50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requestCV"
                checked={requestCV}
                disabled={isSubmitted}
                onCheckedChange={(checked) => setRequestCV(checked as boolean)}
                className="border-gray-700 disabled:opacity-50"
              />
              <label
                htmlFor="requestCV"
                className="text-sm text-gray-300 cursor-pointer"
              >
                {t('contact.requestCV')}
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? t('contact.sending') : t('contact.sendMessage')}
          </Button>

          {isSubmitted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center mt-4 font-medium"
            >
              Thank you for reaching out and I will get back as soon as possible.
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  );
};