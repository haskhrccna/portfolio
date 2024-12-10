import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import { CVRequestCheckbox } from "./CVRequestCheckbox";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  isSubmitting: boolean;
  isSubmitted: boolean;
  requestCV: boolean;
  setRequestCV: (value: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ContactForm = ({ 
  isSubmitting, 
  isSubmitted, 
  requestCV, 
  setRequestCV, 
  onSubmit 
}: ContactFormProps) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch admin settings to check if CV request should be shown
  const { data: adminSettings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <motion.form 
      ref={formRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      onSubmit={onSubmit}
      className="space-y-6 bg-[#163C73] p-8 rounded-lg"
    >
      <div className="space-y-4">
        <FormField
          label={t('contact.name')}
          name="name"
          required
          disabled={isSubmitted}
        />
        <FormField
          label={t('contact.email')}
          name="email"
          type="email"
          required
          disabled={isSubmitted}
        />
        <FormField
          label={t('contact.companyName')}
          name="company"
          required
          disabled={isSubmitted}
        />
        <FormField
          label={t('contact.subject')}
          name="subject"
          required
          disabled={isSubmitted}
        />
        <FormField
          label={t('contact.message')}
          name="message"
          type="textarea"
          required
          disabled={isSubmitted}
        />

        {adminSettings?.show_cv_request && (
          <CVRequestCheckbox
            checked={requestCV}
            onCheckedChange={setRequestCV}
            disabled={isSubmitted}
          />
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitted}
        className="w-full bg-[#0D2B59] hover:bg-[#0A2347] text-white disabled:opacity-50"
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? t('contact.sending') : t('contact.sendMessage')}
      </Button>

      {isSubmitted && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-500 text-center mt-4 font-medium"
        >
          {t('contact.successMessage')}
        </motion.p>
      )}
    </motion.form>
  );
};