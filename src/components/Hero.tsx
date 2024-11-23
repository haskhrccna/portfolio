import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="section-padding min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-white">Hassan Hassan Khairalla Adam</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Principal Resident Engineer - Electrical
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