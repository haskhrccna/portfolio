import { motion } from "framer-motion";

const skills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "UI/UX Design", level: 75 },
];

export const Skills = () => {
  return (
    <section id="skills" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-12"
        >
          Skills
        </motion.h2>
        <div className="grid gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6"
            >
              <div className="flex justify-between mb-2">
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};