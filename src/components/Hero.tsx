import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="section-padding min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-8 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl"
          >
            <img 
              src="/lovable-uploads/072d3a59-e643-48d6-bb4c-7f55c36fd5a0.png" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold whitespace-nowrap"
          >
            <span className="text-white">Hassan Hassan Khairalla Adam</span>
          </motion.h1>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-4"
        >
          Principal Resident Engineer - Electrical
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          Specialized in high-voltage power systems with extensive experience in managing and supervising infrastructure projects across the Middle East
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#contact" className="glass px-8 py-4 text-lg hover:bg-white/20 transition-all">
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};