import { motion } from "framer-motion";

export const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-12"
        >
          About Me
        </motion.h2>
        <div className="glass p-8">
          <p className="text-lg leading-relaxed">
            I'm a passionate developer with 5 years of experience in creating beautiful and functional web applications. 
            I specialize in React, Node.js, and modern web technologies.
          </p>
        </div>
      </div>
    </section>
  );
};